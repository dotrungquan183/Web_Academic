from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import Vote, Question, Answer
from rest_framework.permissions import AllowAny
from api.views.auth.authHelper import get_authenticated_user
import logging
from django.db import IntegrityError, transaction
from django.db.models import Sum, Case, When, IntegerField

# Thiết lập logger để ghi lại thông tin
logger = logging.getLogger(__name__)

class StudentDetailQuestionView(APIView):
    permission_classes = [AllowAny]  # Nên dùng IsAuthenticated nếu sử dụng thực tế

    def post(self, request):
        logger.info(f"Request data: {request.data}")

        # Lấy thông tin người dùng
        user, error_response = get_authenticated_user(request)
        if error_response:
            logger.error(f"Error in getting authenticated user: {error_response}")
            return error_response
        logger.info(f"Authenticated user: {user}")

        # Lấy dữ liệu từ request
        vote_type = request.data.get('vote_type')  # 'like' hoặc 'dislike'
        vote_for = request.data.get('vote_for')    # 'question' hoặc 'answer'
        content_id = request.data.get('content_id')

        # Log thông tin vote nhận được
        logger.info(f"Vote type: {vote_type}, Vote for: {vote_for}, Content ID: {content_id}")

        # Kiểm tra dữ liệu đầu vào
        if not all([vote_type, vote_for, content_id]):
            logger.warning(f"Missing information: vote_type: {vote_type}, vote_for: {vote_for}, content_id: {content_id}")
            return Response({"error": "Thiếu thông tin"}, status=status.HTTP_400_BAD_REQUEST)

        # Kiểm tra loại nội dung (question/answer)
        if vote_for == 'question':
            model = Question
        elif vote_for == 'answer':
            model = Answer
        else:
            logger.error(f"Invalid vote_for value: {vote_for}. It must be either 'question' or 'answer'.")
            return Response({"error": "vote_for phải là 'question' hoặc 'answer'"}, status=status.HTTP_400_BAD_REQUEST)

        # Kiểm tra nội dung tồn tại
        try:
            content = model.objects.get(id=content_id)
            logger.info(f"Found content: {content}")
        except model.DoesNotExist:
            logger.error(f"Content not found: {content_id} for {vote_for}")
            return Response({"error": "Nội dung không tồn tại"}, status=status.HTTP_404_NOT_FOUND)

        # Xử lý vote: toggle logic
        try:
            with transaction.atomic():  # Đảm bảo toàn vẹn dữ liệu
                # Kiểm tra và tạo mới nếu chưa có
                vote, created = Vote.objects.get_or_create(user=user, vote_for=vote_for, content_id=content_id)
                logger.info(f"Vote retrieved: {vote}, Created: {created}")

                # Cập nhật user_id và vote_type trước khi lưu
                vote.user_id = user.id  # Lưu ID người dùng vào cột user_id
                vote.vote_type = vote_type

                if created:
                    # Vote mới được tạo
                    vote.save()
                    logger.info(f"Vote created successfully for content {content_id}")
                    return Response({"success": True, "action": "created"}, status=status.HTTP_201_CREATED)

                elif vote.vote_type == vote_type:
                    # Nếu vote_type giống nhau, xóa vote
                    vote.delete()
                    logger.info(f"Vote removed for content {content_id}")
                    return Response({"success": True, "action": "removed"}, status=status.HTTP_200_OK)

                else:
                    # Nếu vote_type khác nhau, cập nhật và lưu lại
                    vote.save()
                    logger.info(f"Vote updated for content {content_id}")
                    return Response({"success": True, "action": "updated"}, status=status.HTTP_200_OK)

        except IntegrityError as e:
            logger.error(f"Integrity error when saving vote: {e}")
            return Response({"error": "Lỗi cơ sở dữ liệu. Không thể lưu vote."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            logger.error(f"Unexpected error occurred: {e}")
            return Response({"error": "Đã xảy ra lỗi khi xử lý yêu cầu"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request, question_id):
        logger.info(f"Request to get total vote score for question {question_id}")

        # Kiểm tra xem câu hỏi có tồn tại không
        try:
            question = Question.objects.get(id=question_id)
            logger.info(f"Found question: {question}")
        except Question.DoesNotExist:
            logger.error(f"Question not found: {question_id}")
            return Response({"error": "Câu hỏi không tồn tại"}, status=status.HTTP_404_NOT_FOUND)

        # Tính tổng số vote score: +1 cho "like" và -1 cho "dislike"
        total_vote_score = Vote.objects.filter(vote_for='question', content_id=question_id).aggregate(
            total_score=Sum(Case(
                When(vote_type='like', then=1),
                When(vote_type='dislike', then=-1),
                default=0,
                output_field=IntegerField()
            ))
        )['total_score']

        logger.info(f"Total vote score for question {question_id}: {total_vote_score}")

        # Trả về tổng số vote score của câu hỏi
        return Response({
            "question_id": question_id,
            "total_vote_score": total_vote_score if total_vote_score is not None else 0
        }, status=status.HTTP_200_OK)
