from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import Course
from api.serializers import CourseListSerializer
from api.views.auth.authHelper import get_authenticated_user

class StudentLastestCoursesView(APIView):
    def get(self, request):

        latest_courses = Course.objects.order_by("-created_at")[:10]
        serializer = CourseListSerializer(latest_courses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
