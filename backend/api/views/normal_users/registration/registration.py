from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class RegistrationView(APIView):
    def get(self, request):
        data = {
            "title": "Hướng dẫn đăng ký học",
            "content": "Để đăng ký học, vui lòng điền thông tin vào mẫu đăng ký trên website."
        }
        return Response(data, status=status.HTTP_200_OK)
