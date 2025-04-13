from django.views import View
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404
import json
from api.models import Answer, Question, UserInformation

@method_decorator(csrf_exempt, name='dispatch')
class StudentAnsQuestionView(View):
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body.decode('utf-8'))
            print("📥 DỮ LIỆU NHẬN VỀ:", data)
        except Exception as e:
            print("❌ JSON lỗi:", str(e))
            return JsonResponse({'error': 'Dữ liệu không hợp lệ'}, status=400)

        question_id = data.get('question_id')
        user_id = data.get('user_id')
        content = data.get('content')

        if not all([question_id, user_id, content]):
            return JsonResponse({'error': 'Thiếu dữ liệu đầu vào'}, status=400)

        try:
            question = get_object_or_404(Question, id=question_id)
            user = get_object_or_404(UserInformation, user_id=user_id)
        except Exception as e:
            print("❌ Không tìm thấy Question hoặc User:", str(e))
            return JsonResponse({'error': 'Không tìm thấy Question hoặc User'}, status=400)

        answer = Answer.objects.create(
            question=question,
            user=user,
            content=content
        )

        return JsonResponse({'message': 'Success', 'id': answer.id}, status=201)

    def get(self, request, *args, **kwargs):
        question_id = request.GET.get('question_id')
        if not question_id:
            return JsonResponse({'error': 'Thiếu question_id'}, status=400)

        try:
            answers = Answer.objects.filter(question_id=question_id).order_by('-created_at')
            answer_list = []

            for ans in answers:
                try:
                    user_info = ans.user
                    username = user_info.full_name or user_info.user.username or "Người dùng ẩn danh"
                except Exception as e:
                    print("⚠️ Lỗi khi lấy username:", e)
                    username = "Người dùng ẩn danh"

                answer_list.append({
                    'id': ans.id,
                    'username': username,
                    'content': ans.content,
                    'created_at': ans.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                    'userVote': 0  # Placeholder
                })

            return JsonResponse(answer_list, safe=False, status=200)
        except Exception as e:
            print("❌ Lỗi khi lấy câu trả lời:", str(e))
            return JsonResponse({'error': 'Không thể lấy dữ liệu'}, status=500)
