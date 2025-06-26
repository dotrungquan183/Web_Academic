# api/views/admin/admin_users.py
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from api.models import UserInformation, LoginHistory
import json
from django.db.models import ForeignKey
from django.core.files.storage import default_storage
from django.utils import timezone
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
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

    def post(self, request):

        # Lấy trường
        username = request.POST.get('username')
        password = request.POST.get('password')
        full_name = request.POST.get('full_name')
        phone = request.POST.get('phone')
        birth_date = request.POST.get('birth_date')
        gender = request.POST.get('gender')
        user_type = request.POST.get('user_type')
        address = request.POST.get('address')
        email = request.POST.get('email')
        avatar_file = request.FILES.get('avatar')

        # Validate
        if not username or not password:
            return JsonResponse({'error': 'username và password là bắt buộc'}, status=400)

        # Tạo User
        try:
            user = User.objects.create_user(
                username=username,
                password=password,
                email=email,
                is_active=True
            )
        except Exception as e:
            return JsonResponse({'error': f'Lỗi tạo User: {e}'}, status=500)

        # Xử lý avatar
        avatar_path = "/image/default-avatar.png"
        if avatar_file:
            file_name = f"{user.username}_{int(timezone.now().timestamp())}_{avatar_file.name}"
            file_path = file_name  # vì MEDIA_ROOT đã trỏ vào image/
            default_storage.save(file_path, avatar_file)
            avatar_path = f"/image/{file_name}"

        # Tạo UserInformation
        try:
            user_info = UserInformation.objects.create(
                user=user,
                full_name=full_name or "",
                phone=phone or "",
                birth_date=birth_date or None,
                gender=gender or "",
                user_type=user_type or "",
                address=address or "",
                avatar=avatar_path,
                reputation=0
            )
        except Exception as e:
            user.delete()
            return JsonResponse({'error': f'Lỗi tạo UserInformation: {e}'}, status=500)

        # Avatar tuyệt đối
        avatar_url = request.build_absolute_uri(avatar_path)

        # JWT
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        return JsonResponse(
            {
                "message": "Tạo người dùng thành công",
                "role": user_info.user_type,
                "username": user.username,
                "avatar": avatar_url,
                "token": access_token,
                "refresh_token": str(refresh),
            },
            status=201
        )



    def put(self, request):
        data = json.loads(request.body)

        user_id = data.get('user_id')
        is_active = data.get('is_active', None)  

        if not user_id:
            return JsonResponse(
                {'error': 'user_id là bắt buộc'},
                status=400
            )

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse(
                {'error': 'User không tồn tại'},
                status=404
            )

        # Nếu không truyền thêm trường nào ngoài is_active => chỉ update is_active
        # Nếu có truyền thêm thông tin khác => update cả UserInformation
        extra_fields = {k: v for k, v in data.items() if k not in ['user_id', 'is_active']}

        if extra_fields:
            # Cập nhật is_active nếu có
            if is_active is not None:
                user.is_active = is_active
                user.save()

            # Cập nhật UserInformation
            info, created = UserInformation.objects.get_or_create(user=user)
            info.full_name = extra_fields.get('full_name', info.full_name)
            info.phone = extra_fields.get('phone', info.phone)
            info.birth_date = extra_fields.get('birth_date', info.birth_date)
            info.gender = extra_fields.get('gender', info.gender)
            info.user_type = extra_fields.get('user_type', info.user_type)
            info.address = extra_fields.get('address', info.address)
            info.avatar = extra_fields.get('avatar', info.avatar)
            info.save()

            return JsonResponse(
                {'message': 'Cập nhật thông tin người dùng thành công'},
                status=200
            )
        else:
            # Nếu không có extra_fields thì chỉ update is_active
            if is_active is None:
                return JsonResponse(
                    {'error': 'Vui lòng truyền is_active hoặc các trường thông tin để update'},
                    status=400
                )

            user.is_active = is_active
            user.save()
            return JsonResponse(
                {'message': 'Cập nhật is_active thành công'},
                status=200
            )

    def delete(self, request):
    
        data = json.loads(request.body)
        user_id = data.get('user_id')
        if not user_id:
            return JsonResponse({'error': 'user_id là bắt buộc'}, status=400)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User không tồn tại'}, status=404)

        # Xóa UserInformation
        UserInformation.objects.filter(user=user).delete()

        # Duyệt qua các quan hệ reverse liên quan đến User
        for rel in user._meta.related_objects:
            if isinstance(rel.field, ForeignKey) and rel.field.null:
                # Dùng update để set null
                rel.related_model.objects.filter(**{rel.field.name: user}).update(**{rel.field.name: None})

        # Cuối cùng xóa User
        user.delete()

        return JsonResponse({'message': 'Xóa user và set null các tham chiếu thành công'}, status=200)
