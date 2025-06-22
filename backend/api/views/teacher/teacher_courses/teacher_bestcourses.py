from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import Course
from api.serializers import CourseListSerializer

class TeacherBestCoursesView(APIView):
    def get(self, request):
        # ✅ Chỉ lấy các khóa học đã được duyệt
        courses = Course.objects.filter(is_approve=1).order_by('-fee')[:10]
        serializer = CourseListSerializer(courses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
