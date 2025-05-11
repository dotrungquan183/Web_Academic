from rest_framework.views import APIView
from django.http import JsonResponse
from api.models import UserInformation
from api.views.auth.authHelper import get_authenticated_user
from django.utils import timezone
from dateutil.relativedelta import relativedelta

class TeacherProfileAccountView(APIView):
    def get(self, request):
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        try:
            user_info = UserInformation.objects.get(user=user)
        except UserInformation.DoesNotExist:
            return JsonResponse({"error": "User information not found."}, status=404)

        now = timezone.now()

        # --- member_for ---
        date_joined = user.date_joined
        diff_joined = relativedelta(now, date_joined)
        joined_parts = []
        if diff_joined.years:
            joined_parts.append(f"{diff_joined.years} năm")
        if diff_joined.months:
            joined_parts.append(f"{diff_joined.months} tháng")
        if diff_joined.days:
            joined_parts.append(f"{diff_joined.days} ngày")
        member_for = ", ".join(joined_parts) + " trước" if joined_parts else "hôm nay"

        # --- last_seen ---
        last_login = user.last_login
        if last_login:
            diff_login = relativedelta(now, last_login)
            login_parts = []
            if diff_login.years:
                login_parts.append(f"{diff_login.years} năm")
            if diff_login.months:
                login_parts.append(f"{diff_login.months} tháng")
            if diff_login.days:
                login_parts.append(f"{diff_login.days} ngày")
            if diff_login.hours:
                login_parts.append(f"{diff_login.hours} giờ")
            if diff_login.minutes:
                login_parts.append(f"{diff_login.minutes} phút")
            last_seen = ", ".join(login_parts) + " trước" if login_parts else "vừa xong"
        else:
            last_seen = "không hoạt động"

        return JsonResponse({
            "username": user.username,
            "avatar": user_info.avatar,
            "date_joined": date_joined.isoformat(),
            "member_for": member_for,
            "last_seen": last_seen
        })
