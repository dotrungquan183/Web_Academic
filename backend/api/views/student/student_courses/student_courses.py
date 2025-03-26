from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class StudentCoursesView(APIView):
    def get(self, request):
        data = {
            "title": "Khóa học",
            "courses": [
                {"id": 1, "name": "Khóa học lập trình Python dành cho sinh viên"},
                {"id": 2, "name": "Khóa học thiết kế web dành cho sinh viên"},
                {"id": 3, "name": "Khóa học AI cơ bản dành cho sinh viên"}
            ]
        }
        return Response(data, status=status.HTTP_200_OK)
