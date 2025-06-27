from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import  Question, Answer, UserInformation, VoteForQuestion, VoteForAnswer, Reputation, ReputationPermission, User
from rest_framework.permissions import AllowAny
from api.views.auth.authHelper import get_authenticated_user
import logging
from django.db import transaction
from django.db.models import Sum, Case, When, IntegerField
from django.shortcuts import get_object_or_404
from django.db import models
from django.core.exceptions import PermissionDenied

# Thiết lập logger

logger = logging.getLogger(__name__)

def check_permission_and_update_reputation(user: User, action_type: str) -> bool:
    """
    Kiểm tra xem người dùng có đủ điểm uy tín để thực hiện action không.
    Nếu không đủ, raise PermissionDenied.
    Nếu đủ, trả về True.
    """
    try:
        permission = ReputationPermission.objects.get(action_key=action_type)
    except ReputationPermission.DoesNotExist:
        raise PermissionDenied(
            f"❌ Action '{action_type}' không tồn tại trong bảng phân quyền!"
        )

    # Lấy thông tin UserInformation để biết reputation
    try:
        user_info = UserInformation.objects.get(user=user)
    except UserInformation.DoesNotExist:
        raise PermissionDenied(
            "❌ Không tìm thấy thông tin điểm uy tín của bạn!"
        )

    if user_info.reputation < permission.min_reputation:
        raise PermissionDenied(
            f"❌ Bạn cần ít nhất {permission.min_reputation} điểm uy tín để thực hiện '{permission.description}'!"
        )

    return True

def reward_new_user(user_info: UserInformation):
    """
    Cộng điểm reputation cho người dùng mới tham gia.
    Rule: new_user
    """
    try:
        rep_record = Reputation.objects.get(rule_key='new_user')
        points = rep_record.point_change
        user_info.reputation += points
        user_info.save()

        logger.info(
            f"Rewarded new user {user_info.user.username}: +{points} points"
        )
    except Reputation.DoesNotExist:
        logger.error("No Reputation record found for 'new_user'")
        
def update_downvote_penalty(user_info, action):
    """
    Cộng hoặc trừ điểm penalty cho người downvote.
    action: add | remove
    """
    try:
        penalty_rule = Reputation.objects.get(rule_key='downvote_penalty')
        points = penalty_rule.point_change
        if action == 'remove':
            points = -points
        user_info.reputation += points
        user_info.save()
        logger.info(
            f"Updated downvote penalty for {user_info.user.username}: {points:+}"
        )
    except Reputation.DoesNotExist:
        logger.error("No Reputation record found for downvote_penalty")


def update_reputation(user_info, action_type, target_type, action):
    """
    Cập nhật điểm reputation của CHỦ SỞ HỮU nội dung.
    action_type: upvote | downvote | accepted
    target_type: question | answer
    action: add | remove
    """
    try:
        if action_type == 'upvote':
            rule_key = 'upvote_question' if target_type == 'question' else 'upvote_answer'
        elif action_type == 'downvote':
            rule_key = 'downvote_question' if target_type == 'question' else 'downvote_answer'
        elif action_type == 'accepted':
            rule_key = 'answer_accepted'
        else:
            logger.warning(f"Unknown action_type: {action_type}")
            return

        rep_record = Reputation.objects.get(rule_key=rule_key)
        points = rep_record.point_change
        if action == 'remove':
            points = -points

        user_info.reputation += points
        user_info.save()
        logger.info(
            f"Updated reputation for {user_info.user.username}: {points:+}"
        )
    except Reputation.DoesNotExist:
        logger.error(f"No Reputation record found for {rule_key}")


class AdminDetailQuestionView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        logger.info(f"Request data: {request.data}")
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        vote_type = request.data.get('vote_type')  # like | dislike
        vote_for = request.data.get('vote_for')    # question | answer
        content_id = request.data.get('content_id')

        # Validate
        if vote_type not in ['like', 'dislike'] or vote_for not in ['question', 'answer'] or not content_id:
            return Response({"error": "Dữ liệu không hợp lệ"}, status=400)

        action_type = 'upvote' if vote_type == 'like' else 'downvote'
        content_model = Question if vote_for == 'question' else Answer
        vote_model = VoteForQuestion if vote_for == 'question' else VoteForAnswer

        try:
            content = content_model.objects.get(id=content_id)
        except content_model.DoesNotExist:
            return Response({"error": "Nội dung không tồn tại"}, status=404)

        content_owner_info = get_object_or_404(UserInformation, user=content.user)
        voted_by_owner = (user == content.user)

        try:
            with transaction.atomic():
                vote, created = vote_model.objects.get_or_create(
                    user=user,
                    **{vote_for: content}
                )

                if created:
                    # Tạo mới vote
                    vote.vote_type = vote_type
                    vote.save()

                    # Nếu upvote → cộng điểm chủ sở hữu
                    if action_type == 'upvote':
                        update_reputation(content_owner_info, action_type, vote_for, action='add')
                    # Nếu downvote → trừ điểm chủ sở hữu + trừ penalty người downvote
                    else:
                        update_reputation(content_owner_info, action_type, vote_for, action='add')
                        if not voted_by_owner:
                            downvoter_info = UserInformation.objects.get(user=user)
                            update_downvote_penalty(downvoter_info, action='add')
                    return Response({"success": True, "action": "created"}, status=201)

                if vote.vote_type == vote_type:
                    # Bỏ vote
                    vote.delete()

                    # Gỡ điểm cũ của chủ sở hữu
                    update_reputation(content_owner_info, action_type, vote_for, action='remove')
                    if action_type == 'downvote' and not voted_by_owner:
                        downvoter_info = UserInformation.objects.get(user=user)
                        update_downvote_penalty(downvoter_info, action='remove')
                    return Response({"success": True, "action": "removed"}, status=200)

                # Đổi loại vote
                old_action_type = 'upvote' if vote.vote_type == 'like' else 'downvote'
                vote.vote_type = vote_type
                vote.save()

                # Gỡ điểm cũ
                update_reputation(content_owner_info, old_action_type, vote_for, action='remove')
                if old_action_type == 'downvote' and not voted_by_owner:
                    downvoter_info = UserInformation.objects.get(user=user)
                    update_downvote_penalty(downvoter_info, action='remove')

                # Thêm điểm mới
                update_reputation(content_owner_info, action_type, vote_for, action='add')
                if action_type == 'downvote' and not voted_by_owner:
                    downvoter_info = UserInformation.objects.get(user=user)
                    update_downvote_penalty(downvoter_info, action='add')

                return Response({"success": True, "action": "updated"}, status=200)

        except Exception as e:
            logger.error(f"Error: {e}")
            return Response({"error": "Lỗi máy chủ"}, status=500)


    def get(self, request, question_id):
        logger.info(f"Request to get total vote score for question {question_id}")

        try:
            # Chỉ lấy câu hỏi đã được duyệt
            question = Question.objects.get(id=question_id)
        except Question.DoesNotExist:
            logger.error(f"Question not found or not approved: {question_id}")
            return Response({"error": "Câu hỏi không tồn tại hoặc chưa được duyệt"}, status=status.HTTP_404_NOT_FOUND)

        # Tổng điểm vote dựa trên VoteForQuestion
        total_vote_score = VoteForQuestion.objects.filter(
            question=question
        ).aggregate(
            total_score=Sum(
                Case(
                    When(vote_type='like', then=1),
                    When(vote_type='dislike', then=-1),
                    default=0,
                    output_field=IntegerField(),
                )
            )
        )['total_score']

        # Tổng số câu trả lời (chỉ tính câu trả lời đã được duyệt nếu cần)
        total_answers = Answer.objects.filter(question=question, is_approve=0).count()

        logger.info(
            f"Total vote score for question {question_id}: {total_vote_score if total_vote_score is not None else 0}"
        )
        logger.info(f"Total approved answers for question {question_id}: {total_answers}")

        return Response(
            {
                "question_id": question_id,
                "total_vote_score": total_vote_score if total_vote_score is not None else 0,
                "total_answers": total_answers,
            },
            status=status.HTTP_200_OK,
        )
