from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class TeacherIntroView(APIView):
    def get(self, request):
        data = {
            "title": "Giới thiệu",
            "content": "Trang giới thiệu của giáo viên"
        }
        return Response(data, status=status.HTTP_200_OK)
