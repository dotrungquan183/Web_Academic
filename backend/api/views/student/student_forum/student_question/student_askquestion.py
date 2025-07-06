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
from django.db import transaction

logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name="dispatch")
class StudentAskQuestionView(View):
    def post(self, request, question_id=None, *args, **kwargs):
        # ✅ Xác thực người dùng
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        try:
            is_update = request.POST.get("_method", "").upper() == "PUT"
            uploaded_file = request.FILES.get("attachment")

            # ✅ Parse dữ liệu
            title = request.POST.get("title")
            content = request.POST.get("content") or request.POST.get("description")
            tags_raw = request.POST.get("tags")
            bounty_amount = int(request.POST.get("bounty_amount", 0))
            accepted_answer_id = request.POST.get("accepted_answer_id")

            # ✅ Parse tags (string dạng JSON)
            try:
                tags = json.loads(tags_raw) if tags_raw else []
                if not isinstance(tags, list) or not all(isinstance(t, str) for t in tags):
                    raise ValueError()
            except Exception:
                return JsonResponse({"error": "Thẻ tags không hợp lệ!"}, status=400)

            if not title or not content or not tags:
                return JsonResponse({"error": "Thiếu thông tin!"}, status=400)

            if is_update:
                # ✅ CẬP NHẬT CÂU HỎI
                try:
                    question = Question.objects.get(id=question_id)
                except Question.DoesNotExist:
                    return JsonResponse({"error": "Câu hỏi không tồn tại!"}, status=404)

                if question.user != user:
                    return JsonResponse({"error": "Không có quyền chỉnh sửa!"}, status=403)

                # ✅ Update accepted_answer_id
                old_accepted_id = question.accepted_answer_id
                new_accepted_id = int(accepted_answer_id) if accepted_answer_id else None

                if old_accepted_id and old_accepted_id != new_accepted_id:
                    try:
                        old_answer = Answer.objects.get(id=old_accepted_id, question=question)
                        old_author = get_object_or_404(UserInformation, user=old_answer.user)
                        update_reputation(old_author, 'accepted', 'answer', 'remove')
                    except Answer.DoesNotExist:
                        pass

                if new_accepted_id and old_accepted_id != new_accepted_id:
                    try:
                        new_answer = Answer.objects.get(id=new_accepted_id, question=question)
                        new_author = get_object_or_404(UserInformation, user=new_answer.user)
                        update_reputation(new_author, 'accepted', 'answer', 'add')
                        question.accepted_answer_id = new_accepted_id
                    except Answer.DoesNotExist:
                        return JsonResponse({"error": "ID câu trả lời không hợp lệ!"}, status=400)
                elif not new_accepted_id:
                    question.accepted_answer_id = None

                # ✅ Cập nhật các trường
                question.title = title
                question.content = content
                question.bounty_amount = bounty_amount
                question.created_at = now()
                if uploaded_file:
                    question.image = uploaded_file
                question.save()

                # ✅ Cập nhật tags
                QuestionTagMap.objects.filter(question=question).delete()
                for tag_name in set(tag.strip() for tag in tags if tag.strip()):
                    tag, _ = QuestionTag.objects.get_or_create(tag_name=tag_name)
                    QuestionTagMap.objects.create(question=question, tag=tag)

                return JsonResponse({"message": "✅ Cập nhật câu hỏi thành công!"}, status=200)

            else:
                # ✅ TẠO MỚI CÂU HỎI
                check_permission_and_update_reputation(user, "ask_question")
                user_info = get_object_or_404(UserInformation, user=user)

                if bounty_amount > 0:
                    if user_info.reputation < bounty_amount:
                        return JsonResponse({"error": "Không đủ điểm!"}, status=400)
                    user_info.reputation -= bounty_amount
                    user_info.save()

                with transaction.atomic():
                    question = Question.objects.create(
                        user=user,
                        title=title,
                        content=content,
                        bounty_amount=bounty_amount,
                        image=uploaded_file or None,
                        created_at=now()
                    )

                    for tag_name in set(tag.strip() for tag in tags if tag.strip()):
                        tag, _ = QuestionTag.objects.get_or_create(tag_name=tag_name)
                        QuestionTagMap.objects.create(question=question, tag=tag)

                return JsonResponse({
                    "message": "✅ Câu hỏi đã được đăng!",
                    "question_id": question.id,
                    "file_url": question.image.url if uploaded_file else None
                }, status=201)

        except Exception as e:
            logger.error(f"❌ Lỗi trong xử lý câu hỏi: {e}")
            return JsonResponse({"error": "❌ Lỗi máy chủ!"}, status=500)

    
    def get(self, request, question_id, *args, **kwargs):
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        try:
            # ✅ Lấy câu hỏi đã được duyệt
            question = Question.objects.get(id=question_id, is_approve=1)

            # ✅ Nếu bạn vẫn muốn check quyền sở hữu
            if question.user != user:
                return JsonResponse({"error": "Bạn không có quyền xem câu hỏi này!"}, status=403)

            # ✅ Lấy danh sách tags
            tags = list(
                QuestionTagMap.objects.filter(question=question)
                .values_list('tag__tag_name', flat=True)
            )

            # ✅ Trả về JSON gồm cả file
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
                    "file_url": question.image.url if question.image else None,
                    "file_name": question.image.name.split("/")[-1] if question.image else None,
                },
                status=200,
            )

        except Question.DoesNotExist:
            return JsonResponse({"error": "Câu hỏi không tồn tại hoặc chưa được duyệt!"}, status=404)

        except Exception as e:
            print("❌ Lỗi khi lấy dữ liệu câu hỏi:", str(e))
            return JsonResponse({"error": "Lỗi máy chủ!"}, status=500)


