from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class TeacherSaveView(APIView):
    def get(self, request):
        data = {
            "title": "Diễn đàn giáo viên",
            "content": "Đây là những câu hỏi đã lưu của giáo viên"
        }
        return Response(data, status=status.HTTP_200_OK)
