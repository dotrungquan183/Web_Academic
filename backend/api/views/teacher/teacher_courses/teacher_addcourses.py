from api.views.auth.authHelper import get_authenticated_user
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from api.models import Course

class TeacherAddCoursesView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        title = request.data.get('title')
        description = request.data.get('description', '')
        tags = request.data.get('tags', '')
        price = request.data.get('price', 0)
        intro_video = request.FILES.get('introVideo')
        thumbnail = request.FILES.get('courseImage')
        qr_code = request.FILES.get('qr_code')  # 🆕 Thêm dòng này
        chapters = request.data.get('chapters')

        if not title:
            return Response({'error': 'Tiêu đề khóa học là bắt buộc.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            course = Course.objects.create(
                title=title,
                intro=description,
                tags=tags,
                fee=price,
                intro_video=intro_video,
                thumbnail=thumbnail,
                qr_code=qr_code,  # 🆕 Thêm dòng này
                user=user,
            )

            return Response({'message': 'Khóa học được tạo thành công.', 'course_id': course.id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, course_id):
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        try:
            course = Course.objects.get(id=course_id, user=user)
        except Course.DoesNotExist:
            return Response({'error': 'Khóa học không tồn tại hoặc bạn không có quyền chỉnh sửa.'}, status=status.HTTP_404_NOT_FOUND)

        title = request.data.get('title')
        description = request.data.get('description', '')
        tags = request.data.get('tags', '')
        price = request.data.get('price', 0)
        intro_video = request.FILES.get('introVideo')
        thumbnail = request.FILES.get('courseImage')
        qr_code = request.FILES.get('qr_code')  # 🆕 Thêm dòng này
        chapters = request.data.get('chapters')

        if title:
            course.title = title
        if description:
            course.intro = description
        if tags is not None:
            course.tags = tags
        if price is not None:
            course.fee = price
        if intro_video:
            course.intro_video = intro_video
        if thumbnail:
            course.thumbnail = thumbnail
        if qr_code:  # 🆕 Thêm dòng này
            course.qr_code = qr_code

        course.save()

        return Response({'message': 'Cập nhật khóa học thành công.'}, status=status.HTTP_200_OK)
