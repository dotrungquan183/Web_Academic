from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import Course, Chapter, Lesson
from api.serializers import CourseSerializer
from datetime import timedelta
from django.conf import settings

class StudentCoursesView(APIView):
    def get(self, request):
        # Thêm dữ liệu mẫu nếu bảng Course trống
        if not Course.objects.exists():
            course = Course.objects.create(
                title="Khóa học React cơ bản",
                total_duration=timedelta(hours=2, minutes=30),
                intro="Khóa học này sẽ giúp bạn hiểu về React JS."
            )
            chapter1 = Chapter.objects.create(course=course, title="Chương 1: Giới thiệu về React")
            chapter2 = Chapter.objects.create(course=course, title="Chương 2: Cài đặt và cấu hình")
            Lesson.objects.create(
                title="Bài học 1: Cài đặt môi trường phát triển",
                duration=timedelta(hours=1),
                video="videos/file.mp4",  # Lưu video relative path (không có /image/)
                chapter=chapter1
            )
            Lesson.objects.create(
                title="Bài học 2: Tạo ứng dụng React đầu tiên",
                duration=timedelta(hours=2),
                video="videos/file.mp4",
                chapter=chapter2
            )

        # Load khóa học
        courses = Course.objects.all()

        # Build dữ liệu trả về thủ công (không cần xài serializer nếu đơn giản)
        course_list = []
        for course in courses:
            course_data = {
                "title": course.title,
                "intro": course.intro,
                "intro_video": request.build_absolute_uri(settings.MEDIA_URL + (course.intro_video.name if course.intro_video else "videos/file.mp4")),
            }
            course_list.append(course_data)

        return Response(course_list, status=status.HTTP_200_OK)
