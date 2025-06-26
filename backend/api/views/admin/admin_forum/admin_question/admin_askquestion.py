import json
from django.http import JsonResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from api.views.auth.authHelper import get_authenticated_user
from api.models import Question, QuestionTag, QuestionTagMap, Answer, UserInformation
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
        # Xác thực người dùng
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        try:
            data = json.loads(request.body)
            title = data.get("title")
            content = data.get("content") or data.get("description")
            tags = data.get("tags")
            bounty_amount = int(data.get("bounty_amount", 0))
            accepted_answer_id = data.get("accepted_answer_id")

            # Validate
            if not title or not content or not tags:
                return JsonResponse({"error": "Vui lòng điền đầy đủ thông tin!"}, status=400)

            # Lấy câu hỏi
            try:
                question = Question.objects.get(id=question_id)
            except Question.DoesNotExist:
                return JsonResponse({"error": "Câu hỏi không tồn tại!"}, status=404)

            if question.user != user:
                return JsonResponse({"error": "Bạn không có quyền chỉnh sửa câu hỏi của người khác!"}, status=403)

            # Xử lý accepted_answer_id
            old_accepted_id = question.accepted_answer_id
            new_accepted_id = accepted_answer_id if accepted_answer_id else None

            # Nếu id cũ khác id mới → xử lý cộng/trừ điểm
            if old_accepted_id and old_accepted_id != new_accepted_id:
                try:
                    old_answer = Answer.objects.get(id=old_accepted_id, question=question)
                    old_author_info = get_object_or_404(UserInformation, user=old_answer.user)
                    # Trừ điểm cũ
                    update_reputation(
                        user_info=old_author_info,
                        action_type='accepted',
                        target_type='answer',
                        action='remove'
                    )
                except Answer.DoesNotExist:
                    logger.warning("Câu trả lời cũ không tồn tại!")

            if new_accepted_id and old_accepted_id != new_accepted_id:
                try:
                    new_answer = Answer.objects.get(id=new_accepted_id, question=question)
                    new_author_info = get_object_or_404(UserInformation, user=new_answer.user)
                    # Cộng điểm mới
                    update_reputation(
                        user_info=new_author_info,
                        action_type='accepted',
                        target_type='answer',
                        action='add'
                    )
                    question.accepted_answer_id = new_accepted_id
                except Answer.DoesNotExist:
                    return JsonResponse({"error": "Câu trả lời không hợp lệ!"}, status=400)
            elif not new_accepted_id:
                # Hủy accepted
                question.accepted_answer_id = None

            # Cập nhật các trường
            question.title = title
            question.content = content
            question.bounty_amount = bounty_amount
            question.created_at = now()
            question.save()

            # Cập nhật tags
            QuestionTagMap.objects.filter(question=question).delete()
            tag_names = set(tag.strip() for tag in tags) if isinstance(tags, list) else set(
                tag.strip() for tag in tags.split(",") if tag.strip()
            )
            for tag_name in tag_names:
                tag, _ = QuestionTag.objects.get_or_create(tag_name=tag_name)
                QuestionTagMap.objects.create(question=question, tag=tag)

            return JsonResponse({"message": "Cập nhật câu hỏi thành công!"}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Dữ liệu không hợp lệ!"}, status=400)
        except Exception as e:
            logger.error(f"Lỗi khi cập nhật câu hỏi: {e}")
            return JsonResponse({"error": str(e)}, status=500)

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

