from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class StudentTagView(APIView):
    def get(self, request):
        data = {
            "title": "Diễn đàn sinh viên",
            "content": "Đây là thẻ câu hỏi"
        }
        return Response(data, status=status.HTTP_200_OK)
