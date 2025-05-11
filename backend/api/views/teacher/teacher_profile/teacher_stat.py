from rest_framework.views import APIView
from django.http import JsonResponse
from api.models import Question, Answer, UserInformation
from api.views.auth.authHelper import get_authenticated_user

class TeacherProfileStatView(APIView):
    def get(self, request):
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        try:
            user_info = UserInformation.objects.get(user=user)
        except UserInformation.DoesNotExist:
            return JsonResponse({"error": "Không tìm thấy thông tin người dùng!"}, status=404)

        # Lấy điểm reputation
        reputation = user_info.reputation

        # Đếm số lượng câu trả lời và câu hỏi
        total_answers = Answer.objects.filter(user=user_info).count()
        total_questions = Question.objects.filter(user=user).count()

        # Tính xếp hạng theo reputation
        rank = (
            UserInformation.objects
            .filter(reputation__gt=reputation)
            .count() + 1
        )

        return JsonResponse({
            "reputation": reputation,
            "rank": rank,
            "total_answers": total_answers,
            "total_questions": total_questions
        }, status=200)
