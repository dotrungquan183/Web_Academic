from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class TeacherHome2View(APIView):
    def get(self, request):
        data = {
            "title": "Home 2",
            "content": "Nội dung của Home 2 trang giáo viên"
        }
        return Response(data, status=status.HTTP_200_OK)
