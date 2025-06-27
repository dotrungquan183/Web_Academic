import json
from django.http import JsonResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from api.views.auth.authHelper import get_authenticated_user
from rest_framework.response import Response
from rest_framework import status
from api.models import Question, QuestionTag, QuestionTagMap,UserInformation
from django.utils.timezone import now
from django.shortcuts import get_object_or_404
from api.views.student.student_forum.student_question.student_detailquestion import update_reputation
from django.core.exceptions import PermissionDenied
from api.views.student.student_forum.student_question.student_detailquestion import check_permission_and_update_reputation
import logging

logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name="dispatch")
class AdminAskQuestionView(View):
    def post(self, request, *args, **kwargs):
        # Lấy thông tin người dùng
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        try:
            # ✅ Check quyền đặt câu hỏi
            check_permission_and_update_reputation(user, "ask_question")

            # Parse body
            data = json.loads(request.body)
            title = data.get("title")
            description = data.get("content")  # frontend gửi "content"
            tags = data.get("tags")
            bounty_amount = int(data.get("bounty_amount", 0))

            # Validate đầu vào
            if (
                not title
                or not description
                or not tags
                or not isinstance(tags, list)
                or len([t for t in tags if isinstance(t, str) and t.strip()]) == 0
            ):
                return JsonResponse({"error": "Không đủ thông tin!"}, status=400)

            # Check thông tin user để trừ bounty nếu cần
            try:
                user_info = UserInformation.objects.get(user=user)
            except UserInformation.DoesNotExist:
                return JsonResponse({"error": "Không tìm thấy thông tin người dùng!"}, status=404)

            if bounty_amount > 0:
                if user_info.reputation < bounty_amount:
                    return JsonResponse({"error": "Không đủ điểm để đặt bounty!"}, status=400)
                user_info.reputation -= bounty_amount
                user_info.save()

            # Tạo câu hỏi
            question = Question.objects.create(
                user=user,
                title=title,
                content=description,
                bounty_amount=bounty_amount,
            )

            # Xử lý tags
            tag_names = set(tag.strip() for tag in tags if tag.strip())
            for tag_name in tag_names:
                tag, _ = QuestionTag.objects.get_or_create(tag_name=tag_name)
                QuestionTagMap.objects.create(question=question, tag=tag)

            return JsonResponse({"message": "Câu hỏi đã được đăng!"}, status=201)

        except PermissionDenied as pd:
            # Người không đủ quyền thực hiện
            return JsonResponse({"error": str(pd)}, status=403)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Dữ liệu không hợp lệ!"}, status=400)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def put(self, request, question_id, *args, **kwargs):
        try:
            question = Question.objects.get(id=question_id)
        except Question.DoesNotExist:
            return JsonResponse({"error": "Câu hỏi không tồn tại!"}, status=404)

        if question.is_approve == 1:
            return JsonResponse({"message": "Câu hỏi đã được duyệt trước đó!"}, status=200)

        question.is_approve = 1
        question.save()

        return JsonResponse({"message": "Duyệt câu hỏi thành công!"}, status=200)

    def get(self, request, question_id, *args, **kwargs):
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        try:
            # Lấy câu hỏi với is_approve = 0
            question = Question.objects.get(id=question_id, is_approve=0)

            # Nếu bạn vẫn cần check quyền sở hữu:
            if question.user != user:
                return JsonResponse({"error": "Bạn không có quyền xem câu hỏi này!"}, status=403)

            # Lấy danh sách tags của câu hỏi
            tags = list(
                QuestionTagMap.objects.filter(question=question)
                .values_list('tag__tag_name', flat=True)
            )

            return JsonResponse(
                {
                    "id": question.id,
                    "title": question.title,
                    "content": question.content,
                    "bounty_amount": float(question.bounty_amount or 0),
                    "accepted_answer_id": question.accepted_answer_id,
                    "created_at": question.created_at.isoformat(),
                    "tags": tags,
                    "user_id": question.user.id,
                },
                status=200,
            )

        except Question.DoesNotExist:
            return JsonResponse({"error": "Câu hỏi không tồn tại hoặc chưa được duyệt!"}, status=404)