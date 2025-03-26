from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class StudentHome3View(APIView):
    def get(self, request):
        data = {
            "title": "Home 3",
            "content": "Nội dung của Home 3 trang sinh viên"
        }
        return Response(data, status=status.HTTP_200_OK)
