import json
from django.http import JsonResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from api.views.auth.authHelper import get_authenticated_user
from api.models import Question, QuestionTag, QuestionTagMap
from django.utils.timezone import now
@method_decorator(csrf_exempt, name="dispatch")
class StudentAskQuestionView(View):
    def post(self, request, *args, **kwargs):
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        try:
            data = json.loads(request.body)
            title = data.get("title")
            description = data.get("description")
            tags = data.get("tags")
            bounty_amount = data.get("bounty_amount", 0)

            if not title or not description or not tags:
                return JsonResponse({"error": "Vui lòng điền đầy đủ thông tin!"}, status=400)

            question = Question.objects.create(
                user=user,
                title=title,
                content=description,
                bounty_amount=bounty_amount,
            )

            tag_names = set(tag.strip() for tag in tags.split(",") if tag.strip())
            for tag_name in tag_names:
                tag, _ = QuestionTag.objects.get_or_create(tag_name=tag_name)
                QuestionTagMap.objects.create(question=question, tag=tag)

            return JsonResponse({"message": "Câu hỏi đã được đăng!"}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Dữ liệu không hợp lệ!"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    from django.utils.timezone import now

    def put(self, request, question_id, *args, **kwargs):
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        try:
            data = json.loads(request.body)
            title = data.get("title")
            content = data.get("content") or data.get("description")
            tags = data.get("tags")
            bounty_amount = data.get("bounty_amount", 0)

            if not title or not content or not tags:
                return JsonResponse({"error": "Vui lòng điền đầy đủ thông tin!"}, status=400)

            try:
                question = Question.objects.get(id=question_id)
            except Question.DoesNotExist:
                return JsonResponse({"error": "Câu hỏi không tồn tại!"}, status=404)

            if question.user != user:
                return JsonResponse({"error": "Bạn không có quyền chỉnh sửa câu hỏi của người khác!"}, status=403)

            # Cập nhật thông tin câu hỏi
            question.title = title
            question.content = content
            question.bounty_amount = bounty_amount
            question.created_at = now()  # ✅ cập nhật thời gian hiện tại
            question.save()

            # Cập nhật tag
            QuestionTagMap.objects.filter(question=question).delete()

            tag_names = set(tag.strip() for tag in tags if tag.strip()) if isinstance(tags, list) else set(
                tag.strip() for tag in tags.split(",") if tag.strip()
            )
            for tag_name in tag_names:
                tag, _ = QuestionTag.objects.get_or_create(tag_name=tag_name)
                QuestionTagMap.objects.create(question=question, tag=tag)

            return JsonResponse({"message": "Cập nhật câu hỏi thành công!"}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Dữ liệu không hợp lệ!"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
