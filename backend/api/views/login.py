from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from api.models import UserInformation

@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"error": "Vui lòng nhập đầy đủ thông tin!"}, status=status.HTTP_400_BAD_REQUEST)

    # Dùng authenticate() để kiểm tra tài khoản + mật khẩu
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

    print(f"DEBUG: Đăng nhập thành công! User {username}, Role: {user_info.user_type}")
    role = "admin" if user_info.user_type.lower() == "sinh viên" else "user"

    return Response({"message": "Đăng nhập thành công!", "role": role}, status=status.HTTP_200_OK)
