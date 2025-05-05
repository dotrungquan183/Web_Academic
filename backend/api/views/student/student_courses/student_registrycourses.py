from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import Course, CourseRegistration
from api.views.auth.authHelper import get_authenticated_user

class StudentRegistryCoursesView(APIView):
    def post(self, request, course_id):
        # Kiểm tra xác thực người dùng
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response  # Trả về lỗi nếu chưa đăng nhập

        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response({'lỗi': 'Không tìm thấy khóa học'}, status=status.HTTP_404_NOT_FOUND)

        # Kiểm tra học phí
        if course.fee != 0:
            return Response({'lỗi': 'Khóa học này yêu cầu thanh toán học phí'}, status=status.HTTP_400_BAD_REQUEST)

        # Đăng ký khóa học nếu chưa đăng ký trước đó
        registration, created = CourseRegistration.objects.get_or_create(user=user, course=course)

        if not created:
            return Response({'thông báo': 'Bạn đã đăng ký khóa học này trước đó'}, status=status.HTTP_200_OK)

        # Tăng số lượng học viên nếu đăng ký mới
        course.student_count += 1
        course.save()

        return Response({'thông báo': 'Đăng ký khóa học thành công'}, status=status.HTTP_201_CREATED)

    def get(self, request):
        # Kiểm tra xác thực người dùng
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        # Lấy danh sách đăng ký
        registrations = CourseRegistration.objects.filter(user=user).values('user_id', 'course_id')

        return Response({'registrations': list(registrations)}, status=status.HTTP_200_OK)