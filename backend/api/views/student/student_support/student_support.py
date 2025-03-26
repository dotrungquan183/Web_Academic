from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class StudentSupportView(APIView):
    def get(self, request):
        data = {
            "title": "Hỗ trợ học tập cho sinh viên",
            "content": "Hỗ trợ học tập cho sinh viên."
        }
        return Response(data, status=status.HTTP_200_OK)
