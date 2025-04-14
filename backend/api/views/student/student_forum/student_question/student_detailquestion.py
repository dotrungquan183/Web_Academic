from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import Vote, Question, Answer
from rest_framework.permissions import AllowAny
from api.views.auth.authHelper import get_authenticated_user
import logging
from django.db import IntegrityError, transaction
from django.db.models import Sum, Case, When, IntegerField

# Thiết lập logger
logger = logging.getLogger(__name__)

class StudentDetailQuestionView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        logger.info(f"Request data: {request.data}")

        user, error_response = get_authenticated_user(request)
        if error_response:
            logger.error(f"Error in getting authenticated user: {error_response}")
            return error_response
        logger.info(f"Authenticated user: {user}")

        vote_type = request.data.get('vote_type')  # 'like' hoặc 'dislike'
        vote_for = request.data.get('vote_for')    # 'question' hoặc 'answer'
        content_id = request.data.get('content_id')

        if vote_type not in ['like', 'dislike'] or vote_for not in ['question', 'answer'] or not content_id:
            logger.warning("Dữ liệu không hợp lệ.")
            return Response({"error": "Dữ liệu không hợp lệ"}, status=status.HTTP_400_BAD_REQUEST)

        model = Question if vote_for == 'question' else Answer
        try:
            content = model.objects.get(id=content_id)
            logger.info(f"Found content: {content}")
        except model.DoesNotExist:
            logger.error(f"Nội dung không tồn tại: {content_id}")
            return Response({"error": "Nội dung không tồn tại"}, status=status.HTTP_404_NOT_FOUND)

        try:
            with transaction.atomic():
                vote, created = Vote.objects.get_or_create(user=user, vote_for=vote_for, content_id=content_id)
                logger.info(f"Vote object: {vote}, Created: {created}")

                if created:
                    vote.vote_type = vote_type
                    vote.save()
                    return Response({"success": True, "action": "created"}, status=status.HTTP_201_CREATED)

                if vote.vote_type == vote_type:
                    vote.delete()
                    return Response({"success": True, "action": "removed"}, status=status.HTTP_200_OK)
                else:
                    vote.vote_type = vote_type
                    vote.save()
                    return Response({"success": True, "action": "updated"}, status=status.HTTP_200_OK)

        except IntegrityError as e:
            logger.error(f"IntegrityError: {e}")
            return Response({"error": "Lỗi cơ sở dữ liệu."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return Response({"error": "Đã xảy ra lỗi khi xử lý yêu cầu"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request, question_id):
        logger.info(f"Request to get total vote score for question {question_id}")

        try:
            question = Question.objects.get(id=question_id)
        except Question.DoesNotExist:
            logger.error(f"Question not found: {question_id}")
            return Response({"error": "Câu hỏi không tồn tại"}, status=status.HTTP_404_NOT_FOUND)

        # Lấy tổng điểm bỏ phiếu cho câu hỏi
        total_vote_score = Vote.objects.filter(
            vote_for='question', content_id=str(question_id)
        ).aggregate(
            total_score=Sum(Case(
                When(vote_type='like', then=1),
                When(vote_type='dislike', then=-1),
                default=0,
                output_field=IntegerField()
            ))
        )['total_score']

        # Lấy tổng số câu trả lời cho câu hỏi
        total_answers = Answer.objects.filter(question=question_id).count()

        logger.info(f"Total vote score for question {question_id}: {total_vote_score if total_vote_score is not None else 0}")
        logger.info(f"Total answers for question {question_id}: {total_answers}")

        return Response({
            "question_id": question_id,
            "total_vote_score": total_vote_score if total_vote_score is not None else 0,
            "total_answers": total_answers
        }, status=status.HTTP_200_OK)