from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.timezone import now, timedelta
from api.models import CourseRegistration, Course
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

class TeacherListRegistryCoursesView(APIView):
    def get(self, request, course_id):
        # Kiểm tra khóa học tồn tại
        course = get_object_or_404(Course, pk=course_id)

        # ✅ Chỉ xử lý nếu khóa học đã được duyệt
        if course.is_approve != 1:
            return Response(
                {"error": "Khóa học chưa được phê duyệt."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Lấy danh sách đăng ký
        registrations = CourseRegistration.objects.filter(
            course=course
        ).select_related('user')

        # Thời điểm để xác định người dùng hoạt động (trong vòng 7 ngày gần nhất)
        active_threshold = now() - timedelta(days=7)

        # Tạo danh sách học viên
        students_data = []
        for reg in registrations:
            user = reg.user
            students_data.append({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'registered_at': reg.registered_at,
                'last_login': user.last_login,
                'is_active': user.last_login is not None and user.last_login >= active_threshold
            })

        return Response(
            {
                'course_id': course.id,
                'course_title': course.title,
                'students': students_data
            },
            status=status.HTTP_200_OK
        )
