import random
import string
import datetime
from django.core.mail import send_mail
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from api.models import OTP

def generate_otp(length=6):
    """Tạo mã OTP ngẫu nhiên gồm 6 chữ số."""
    return ''.join(random.choices(string.digits, k=length))

@api_view(['POST'])
def forgotpassword_view(request):
    email = request.data.get('email')
    
    if not email:
        return Response({"error": "Vui lòng nhập email!"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "Email không tồn tại trong hệ thống!"}, status=status.HTTP_404_NOT_FOUND)
    
    # Xóa OTP cũ của người dùng (nếu có)
    OTP.objects.filter(user=user).delete()

    # Tạo và lưu OTP mới
    otp_code = generate_otp()
    OTP.objects.create(user=user, otp_code=otp_code)

    # Gửi email chứa OTP
    subject = "Mã OTP để đặt lại mật khẩu"
    message = f"Xin chào {user.username},\n\nMã OTP của bạn là: {otp_code}\n\nVui lòng không chia sẻ mã này với bất kỳ ai!"
    sender_email = "your-email@gmail.com"  # Thay bằng email của bạn
    
    try:
        send_mail(subject, message, sender_email, [email])
        return Response({"message": "Chúng tôi đã gửi mã OTP về email của bạn."}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": f"Lỗi khi gửi email: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
