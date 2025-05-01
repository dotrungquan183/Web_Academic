from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import Course
from api.serializers import CourseListSerializer

class TeacherBestCoursesAPIView(APIView):
    def get(self, request):
        courses = Course.objects.all().order_by('-fee')[:10]
        serializer = CourseListSerializer(courses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
