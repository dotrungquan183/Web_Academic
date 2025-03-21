from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from api.models import OTP, UserInformation

@api_view(['POST'])
def verify_otp(request):
    email = request.data.get('email')
    otp_code = request.data.get('otp')

    if not email or not otp_code:
        return Response({"error": "Vui lòng nhập đầy đủ thông tin!"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Tìm user trong auth_user
        user = User.objects.get(email=email)  # Lấy user từ bảng mặc định của Django

        # Tìm thông tin user trong UserInformation
        user_info = UserInformation.objects.get(user=user)

        # Lấy mã OTP gần nhất cho user này
        otp_record = OTP.objects.filter(user=user_info, otp_code=otp_code).order_by('-created_at').first()

        if otp_record and otp_record.is_valid():  # Kiểm tra mã OTP còn hiệu lực không
            return Response({"message": "OTP hợp lệ! Vui lòng nhập mật khẩu mới."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Mã OTP không hợp lệ hoặc đã hết hạn!"}, status=status.HTTP_400_BAD_REQUEST)

    except User.DoesNotExist:
        return Response({"error": "Email không tồn tại!"}, status=status.HTTP_404_NOT_FOUND)
    except UserInformation.DoesNotExist:
        return Response({"error": "Thông tin người dùng không tồn tại!"}, status=status.HTTP_404_NOT_FOUND)
