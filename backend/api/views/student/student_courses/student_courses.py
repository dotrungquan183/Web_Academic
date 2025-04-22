from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import Course, Chapter, Lesson
from api.serializers import CourseSerializer
from datetime import timedelta

class StudentCoursesView(APIView):
    def get(self, request):
        # Thêm dữ liệu thủ công nếu bảng rỗng
        if not Course.objects.exists():  # Nếu không có dữ liệu trong bảng Course
            # Tạo dữ liệu khóa học
            course = Course.objects.create(
                title="Khóa học React cơ bản",
                description="Khóa học này sẽ giúp bạn hiểu về React JS.",
                total_duration=timedelta(hours=2, minutes=30)
            )
            
            # Tạo dữ liệu chương cho khóa học
            chapter1 = Chapter.objects.create(
                course=course,
                title="Chương 1: Giới thiệu về React"
            )
            chapter2 = Chapter.objects.create(
                course=course,
                title="Chương 2: Cài đặt và cấu hình"
            )
            
            # Thêm bài học cho chương
            lesson1 = Lesson.objects.create(
                title="Bài học 1: Cài đặt môi trường phát triển",
                duration=timedelta(hours=1),  # Thời gian bài học là 1 giờ
                video="image/videos/file.mp4",  # Đường dẫn video
                chapter=chapter1
            )
            lesson2 = Lesson.objects.create(
                title="Bài học 2: Tạo ứng dụng React đầu tiên",
                duration=timedelta(hours=2),
                video="image/videos/file.mp4",
                chapter=chapter2
            )
            
            # Gán các chương vào khóa học (đã tự động khi tạo Chapter)
            course.save()

        # Lấy tất cả khóa học và trả về dữ liệu
        courses = Course.objects.all()
        serializer = CourseSerializer(courses, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

