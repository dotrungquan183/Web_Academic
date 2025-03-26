from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class StudentDocView(APIView):
    def get(self, request):
        data = {
            "title": "Tài liệu học tập sinh viên",
            "content": "Tài liệu học tập sinh viên"
        }
        return Response(data, status=status.HTTP_200_OK)
