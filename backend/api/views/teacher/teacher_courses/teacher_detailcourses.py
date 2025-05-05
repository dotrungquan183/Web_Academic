from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from api.models import Course
from api.serializers import CourseSerializer
from django.shortcuts import get_object_or_404

class TeacherDetailCoursesView(APIView):
    def get(self, request, pk):
        # Lấy khóa học từ ID
        course = get_object_or_404(Course, pk=pk)
        # Serialize khóa học và trả về dữ liệu
        serializer = CourseSerializer(course)
        return Response(serializer.data, status=status.HTTP_200_OK)
