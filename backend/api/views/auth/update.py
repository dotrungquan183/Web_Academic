# views/admin/admin_user.py

from django.views import View
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from api.models import UserInformation  # Đổi nếu model khác
from django.core.files.storage import default_storage
from django.utils import timezone


class AdminUserUpdateView(View):
    def post(self, request):
        data = request.POST
        files = request.FILES

        raw_user_id = data.get("user_id")
        try:
            user_id = int(raw_user_id)
            user = User.objects.get(id=user_id)
        except (TypeError, ValueError, User.DoesNotExist):
            return JsonResponse({'error': f"user_id không hợp lệ hoặc không tồn tại: {raw_user_id}"}, status=400)

        # Đổi mật khẩu nếu có
        new_password = data.get("new_password", "").strip()
        old_password = data.get("old_password", "").strip()
        if new_password:
            if not old_password:
                return JsonResponse({'error': 'Phải nhập mật khẩu cũ để đổi mật khẩu'}, status=400)
            if not authenticate(username=user.username, password=old_password):
                return JsonResponse({'error': 'Mật khẩu cũ không đúng'}, status=400)
            user.set_password(new_password)
            user.save()

        # Cập nhật trạng thái
        is_active_raw = data.get("is_active")
        if is_active_raw is not None:
            user.is_active = str(is_active_raw).lower() in ["true", "1"]
            user.save()

        # Cập nhật thông tin cá nhân
        info, _ = UserInformation.objects.get_or_create(user=user)
        info.full_name = data.get("full_name", info.full_name)
        info.phone = data.get("phone", info.phone)
        info.birth_date = data.get("birth_date", info.birth_date)
        info.gender = data.get("gender", info.gender)
        info.user_type = data.get("user_type", info.user_type)
        info.address = data.get("address", info.address)

        # Avatar mới
        avatar_file = files.get("avatar")
        if avatar_file:
            file_name = f"{user.username}_{int(timezone.now().timestamp())}_{avatar_file.name}"
            file_path = file_name
            default_storage.save(file_path, avatar_file)
            info.avatar = f"/image/{file_name}"

        info.save()

        return JsonResponse({'message': 'Cập nhật người dùng thành công'}, status=200)
