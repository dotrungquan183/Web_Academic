from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class StudentUnanswerView(APIView):
    def get(self, request):
        data = {
            "title": "Diễn đàn sinh viên",
            "content": "Đây là câu hỏi chưa được trả lời"
        }
        return Response(data, status=status.HTTP_200_OK)
