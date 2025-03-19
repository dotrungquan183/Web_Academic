from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class CoursesView(APIView):
    def get(self, request):
        data = {
            "title": "Khóa học",
            "courses": [
                {"id": 1, "name": "Khóa học lập trình Python"},
                {"id": 2, "name": "Khóa học thiết kế web"},
                {"id": 3, "name": "Khóa học AI cơ bản"}
            ]
        }
        return Response(data, status=status.HTTP_200_OK)
