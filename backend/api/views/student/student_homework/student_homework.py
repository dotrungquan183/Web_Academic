from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class StudentHomeworkView(APIView):
    def get(self, request):
        data = {
            "title": "Bài tập và đánh giá",
            "content": "Bài tập sinh viên"
        }
        return Response(data, status=status.HTTP_200_OK)
