from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

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
        user.set_password(new_password)
        user.save()
        return Response({"message": "Mật khẩu đã được đặt lại thành công!"}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "Email không tồn tại!"}, status=status.HTTP_404_NOT_FOUND)
