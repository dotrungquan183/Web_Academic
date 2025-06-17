from django.http import JsonResponse
from rest_framework.views import APIView
from api.models import Answer, Question
from api.views.auth.authHelper import get_authenticated_user

class TeacherNotificationView(APIView):
    permission_classes = []
    authentication_classes = []

    def get(self, request):
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        # Lấy các câu trả lời cho câu hỏi của người dùng hiện tại,
        # nhưng không phải do chính người dùng đó trả lời
        answers = Answer.objects.filter(
            question__user=user
        ).exclude(
            user__user=user
        ).select_related('user__user', 'question__user').order_by('-created_at')

        total = answers.count()

        data = []
        for answer in answers:
            data.append({
                "id": answer.id,
                "question_id": answer.question.id,
                "question_title": answer.question.title,
                "answer_user": answer.user.user.username,
                "answer_content": answer.content,  # ✅ Trả về nội dung câu trả lời
                "created_at": answer.created_at,
                "total": total
            })

        return JsonResponse(data, safe=False, status=200)
