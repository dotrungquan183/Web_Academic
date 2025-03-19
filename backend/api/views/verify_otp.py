from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from api.models import OTP

@api_view(['POST'])
def verify_otp(request):
    email = request.data.get('email')
    otp_code = request.data.get('otp')

    if not email or not otp_code:
        return Response({"error": "Vui lòng nhập đầy đủ thông tin!"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
        otp_record = OTP.objects.filter(user=user, otp_code=otp_code).last()

        if otp_record and otp_record.is_valid():
            return Response({"message": "OTP hợp lệ! Vui lòng nhập mật khẩu mới."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Mã OTP không hợp lệ hoặc đã hết hạn!"}, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({"error": "Email không tồn tại!"}, status=status.HTTP_404_NOT_FOUND)
