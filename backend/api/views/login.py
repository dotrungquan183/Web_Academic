from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from api.models import UserInformation
from django.conf import settings
@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"error": "Vui lòng nhập đầy đủ thông tin!"}, status=status.HTTP_400_BAD_REQUEST)

    # Kiểm tra tài khoản và mật khẩu
    user = authenticate(username=username, password=password)
    if not user:
        print("DEBUG: Sai tài khoản hoặc mật khẩu!")
        return Response({"error": "Sai tài khoản hoặc mật khẩu!"}, status=status.HTTP_401_UNAUTHORIZED)

    # Kiểm tra user có trong UserInformation không
    try:
        user_info = UserInformation.objects.get(user=user)
    except UserInformation.DoesNotExist:
        print(f"DEBUG: Không tìm thấy thông tin user {username} trong UserInformation")
        return Response({"error": "Không tìm thấy thông tin user!"}, status=status.HTTP_404_NOT_FOUND)

    # Xác định role
    role = "admin" if user_info.user_type.lower() == "sinh viên" else "user"

    # Debug log
    print(f"DEBUG: Đăng nhập thành công! User {username}, Role: {role}")

    # Trả về avatar với URL đầy đủ

    # Xóa MEDIA_URL nếu avatar đã chứa nó
    avatar_path = user_info.avatar.lstrip("/")
    if avatar_path.startswith(settings.MEDIA_URL.lstrip("/")):
        avatar_path = avatar_path[len(settings.MEDIA_URL.lstrip("/")):]

    # Ghép đường dẫn đầy đủ
    avatar_url = request.build_absolute_uri(f"{settings.MEDIA_URL.rstrip('/')}/{avatar_path}")

    print(f"DEBUG: settings.MEDIA_URL = {settings.MEDIA_URL}")  
    print(f"DEBUG: user_info.avatar = {user_info.avatar}")  
    print(f"DEBUG: Final Avatar URL = {avatar_url}")  

    # Trả về thông tin đầy đủ
    return Response({
        "message": "Đăng nhập thành công!",
        "role": role,
        "username": user.username,
        "avatar": avatar_url
    }, status=status.HTTP_200_OK)