# api/views/admin/admin_users.py
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from api.models import UserInformation, LoginHistory

@method_decorator(csrf_exempt, name='dispatch')
class AdminUserView(View):
    def get(self, request):
        result = []
        # Lấy tất cả User và join với UserInformation
        for user in User.objects.all().select_related('userinformation'):
            info = getattr(user, 'userinformation', None)

            # Lấy tối đa 50 lần đăng nhập gần nhất
            login_histories = list(
                LoginHistory.objects.filter(user=user)
                .values_list('login_time', flat=True)[:50]
            )

            result.append(
                {
                    "id": user.id,
                    "user_id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "is_active": user.is_active,
                    "is_staff": user.is_staff,
                    "is_superuser": user.is_superuser,
                    "last_login": user.last_login.strftime("%Y-%m-%d %H:%M:%S") if user.last_login else None,
                    "date_joined": user.date_joined.strftime("%Y-%m-%d %H:%M:%S") if user.date_joined else None,
                    "full_name": info.full_name if info else "",
                    "phone": info.phone if info else "",
                    "birth_date": info.birth_date.strftime("%Y-%m-%d") if info and info.birth_date else None,
                    "gender": info.gender if info else "",
                    "user_type": info.user_type if info else "",
                    "address": info.address if info else "",
                    "avatar": info.avatar if info else "",
                    "reputation": info.reputation if info else 0,
                    "login_histories": [dt.strftime("%Y-%m-%d %H:%M:%S") for dt in login_histories],
                }
            )

        return JsonResponse(result, safe=False, json_dumps_params={'ensure_ascii': False})
