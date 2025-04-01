from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from api.models import UserInformation
from django.conf import settings

@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"error": "Vui lòng nhập đầy đủ thông tin!"}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)
    if not user:
        return Response({"error": "Sai tài khoản hoặc mật khẩu!"}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        user_info = UserInformation.objects.get(user=user)
    except UserInformation.DoesNotExist:
        return Response({"error": "Không tìm thấy thông tin user!"}, status=status.HTTP_404_NOT_FOUND)

    user_type = user_info.user_type.lower()
    role_map = {"sinh viên": "student", "giảng viên": "teacher", "admin": "admin"}
    role = role_map.get(user_type, "user")

    avatar_path = user_info.avatar.lstrip("/") if user_info.avatar else "default-avatar.png"
    if avatar_path and settings.MEDIA_URL.lstrip("/") in avatar_path:
        avatar_path = avatar_path[len(settings.MEDIA_URL.lstrip("/")):]
    avatar_url = request.build_absolute_uri(f"{settings.MEDIA_URL.rstrip('/')}/{avatar_path}")

    # Tạo token JWT
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)

    return Response({
        "message": "Đăng nhập thành công!",
        "role": role,
        "username": user.username,
        "avatar": avatar_url,
        "token": access_token,
        "refresh_token": str(refresh)
    }, status=status.HTTP_200_OK)
