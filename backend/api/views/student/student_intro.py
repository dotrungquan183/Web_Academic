from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class StudentIntroView(APIView):
    def get(self, request):
        data = {
            "title": "Giới thiệu",
            "content": "Trang giới thiệu dành cho sinh viên"
        }
        return Response(data, status=status.HTTP_200_OK)
