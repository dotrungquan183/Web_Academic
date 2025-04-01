import json
from django.http import JsonResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from api.views.auth.authHelper import get_authenticated_user
from api.models import Question, QuestionTag, QuestionTagMap

@method_decorator(csrf_exempt, name="dispatch")
class StudentAskQuestionView(View):
    def post(self, request, *args, **kwargs):
        # Gọi hàm lấy user từ token
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response  # Trả về lỗi nếu có

        try:
            # Lấy dữ liệu từ request body
            data = json.loads(request.body)
            title = data.get("title")
            description = data.get("description")
            tags = data.get("tags")
            bounty_amount = data.get("bounty_amount", 0)  # Mặc định 0 nếu không có

            # Kiểm tra dữ liệu có đầy đủ không
            if not title or not description or not tags:
                return JsonResponse({"error": "Vui lòng điền đầy đủ thông tin!"}, status=400)

            # Tạo câu hỏi mới
            question = Question.objects.create(
                user=user,
                title=title,
                content=description,
                bounty_amount=bounty_amount,
            )

            # Xử lý tag
            tag_names = set(tag.strip() for tag in tags.split(",") if tag.strip())
            for tag_name in tag_names:
                tag, created = QuestionTag.objects.get_or_create(tag_name=tag_name)
                QuestionTagMap.objects.create(question=question, tag=tag)

            return JsonResponse({"message": "Câu hỏi đã được đăng!"}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Dữ liệu không hợp lệ!"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
