from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class TeacherContactView(APIView):
    def get(self, request):
        data = {
            "title": "Liên hệ của giáo viên",
            "content": "Giáo viên có thể liên hệ qua ... "
        }
        return Response(data, status=status.HTTP_200_OK)
