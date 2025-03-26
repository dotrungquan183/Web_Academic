from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class StudentHome1View(APIView):
    def get(self, request):
        data = {
            "title": "Home 1",
            "content": "Nội dung của Home 1 trang sinh viên"
        }
        return Response(data, status=status.HTTP_200_OK)
