from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

# Bảng dịch lỗi mật khẩu sang tiếng Việt
PASSWORD_ERROR_TRANSLATIONS = {
    "This password is too short. It must contain at least 8 characters.": 
        "Mật khẩu quá ngắn. Phải có ít nhất 8 ký tự.",
    "This password is too common.": 
        "Mật khẩu này quá phổ biến. Vui lòng chọn mật khẩu mạnh hơn.",
    "This password is entirely numeric.": 
        "Mật khẩu không được chỉ chứa số.",
    "The password is too similar to the username.": 
        "Mật khẩu quá giống với tên người dùng.",
    "The password is too similar to the email address.": 
        "Mật khẩu quá giống với địa chỉ email.",
}

def translate_password_errors(errors):
    """Dịch lỗi từ tiếng Anh sang tiếng Việt nếu có."""
    translated_errors = [PASSWORD_ERROR_TRANSLATIONS.get(error, error) for error in errors]
    return translated_errors

@api_view(['POST'])
def resetpassword_view(request):
    """
    API đặt lại mật khẩu bằng email.
    """
    email = request.data.get('email')
    new_password = request.data.get('new_password')

    if not email or not new_password:
        return Response({"error": "Vui lòng nhập đầy đủ thông tin!"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)

        # Kiểm tra mật khẩu có hợp lệ không
        try:
            validate_password(new_password, user)
        except ValidationError as e:
            translated_errors = translate_password_errors(e.messages)
            return Response({"error": translated_errors}, status=status.HTTP_400_BAD_REQUEST)

        # Cập nhật mật khẩu mới
        user.set_password(new_password)
        user.save()

        return Response({"message": "Mật khẩu đã được đặt lại thành công!"}, status=status.HTTP_200_OK)
    
    except User.DoesNotExist:
        return Response({"error": "Email không tồn tại!"}, status=status.HTTP_404_NOT_FOUND)
