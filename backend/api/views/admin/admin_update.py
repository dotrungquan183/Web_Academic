from django.views import View
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from api.models import UserInformation
from api.views.auth.authHelper import get_authenticated_user
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

@method_decorator(csrf_exempt, name='dispatch')
class AdminUserUpdateView(View):
    def get(self, request):
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        try:
            user_info = UserInformation.objects.get(user=user)
        except UserInformation.DoesNotExist:
            return JsonResponse({'error': 'Không tìm thấy thông tin người dùng'}, status=404)

        # === Xử lý avatar ===
        if user_info.avatar:
            # Xóa tiền tố MEDIA_URL nếu có
            avatar_path = user_info.avatar.lstrip("/") if isinstance(user_info.avatar, str) else str(user_info.avatar)
            if settings.MEDIA_URL.lstrip("/") in avatar_path:
                avatar_path = avatar_path[len(settings.MEDIA_URL.lstrip("/")):]
            avatar_url = request.build_absolute_uri(f"{settings.MEDIA_URL.rstrip('/')}/{avatar_path}")
        else:
            # fallback ảnh mặc định
            avatar_url = request.build_absolute_uri(f"{settings.MEDIA_URL.rstrip('/')}/default-avatar.png")

        return JsonResponse({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_active': user.is_active,
            'last_login': user.last_login,
            'date_joined': user.date_joined,

            'full_name': user_info.full_name,
            'phone': user_info.phone,
            'birth_date': user_info.birth_date,
            'gender': user_info.gender,
            'user_type': user_info.user_type,
            'address': user_info.address,
            'avatar': avatar_url,
        })

    def post(self, request):
        data = request.POST
        files = request.FILES

        # ===== Lấy user =====
        raw_user_id = data.get("user_id")
        try:
            user_id = int(raw_user_id)
            user = User.objects.get(id=user_id)
        except (TypeError, ValueError, User.DoesNotExist):
            return JsonResponse({'error': f"user_id không hợp lệ hoặc không tồn tại: {raw_user_id}"}, status=400)

        # ===== Xử lý đổi mật khẩu =====
        new_password = data.get("new_password", "").strip()
        old_password = data.get("old_password", "").strip()

        if new_password:
            if not old_password:
                return JsonResponse({'error': 'Phải nhập mật khẩu cũ để đổi mật khẩu'}, status=400)

            authenticated = authenticate(username=user.username, password=old_password)
            if not authenticated:
                return JsonResponse({'error': 'Mật khẩu cũ không đúng'}, status=400)

            user.set_password(new_password)
            user.save()

        # ===== Trạng thái hoạt động =====
        is_active_raw = data.get("is_active")
        if is_active_raw is not None:
            user.is_active = str(is_active_raw).lower() in ["true", "1"]
            user.save()

        # ===== Cập nhật UserInformation =====
        info, _ = UserInformation.objects.get_or_create(user=user)

        info.full_name = data.get("full_name", info.full_name)
        info.phone = data.get("phone", info.phone)

        # Sửa lỗi birth_date = "" gây ValidationError
        birth_date_raw = data.get("birth_date", "").strip()
        info.birth_date = birth_date_raw if birth_date_raw else None

        info.gender = data.get("gender", info.gender)
        info.user_type = data.get("user_type", info.user_type)
        info.address = data.get("address", info.address)

        # ===== Xử lý avatar =====
        avatar_file = files.get("avatar")
        if avatar_file:
            info.avatar = avatar_file

        info.save()

        return JsonResponse({'message': 'Cập nhật thông tin người dùng thành công'}, status=200)