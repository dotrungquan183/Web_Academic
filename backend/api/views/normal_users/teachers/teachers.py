from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class TeachersView(APIView):
    def get(self, request):
        data = {
            "title": "Giáo viên",
            "teachers": [
                {"id": 1, "name": "Nguyễn Văn A"},
                {"id": 2, "name": "Trần Thị B"},
                {"id": 3, "name": "Phạm Thị C"}
            ]
        }
        return Response(data, status=status.HTTP_200_OK)
