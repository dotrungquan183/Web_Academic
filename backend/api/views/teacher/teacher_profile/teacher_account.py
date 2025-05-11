from rest_framework.views import APIView
from django.http import JsonResponse
from api.models import UserInformation
from api.views.auth.authHelper import get_authenticated_user
from django.utils import timezone
from datetime import datetime

class TeacherProfileAccountView(APIView):
    def get(self, request):
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        try:
            user_info = UserInformation.objects.get(user=user)
        except UserInformation.DoesNotExist:
            return JsonResponse({"error": "User information not found."}, status=404)

        # Lấy thời gian tham gia của người dùng (date_joined) từ bảng auth_user
        date_joined = user.date_joined

        # Tính toán thời gian tham gia (ví dụ: 7 years, 8 months)
        now = timezone.now()
        delta = now - date_joined
        years = delta.days // 365
        months = (delta.days % 365) // 30

        # Trả về thông tin người dùng, bao gồm cả thời gian tham gia
        return JsonResponse({
            "username": user.username,
            "avatar": user_info.avatar,
            "date_joined": user.date_joined.isoformat(),  # Trả về ngày tham gia dưới dạng ISO format
            "member_for": f"{years} years, {months} months"  # Trả về thời gian tham gia
        })
