from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import Lesson, LessonVideoView
from api.views.auth.authHelper import get_authenticated_user

class StudentLessonVideoView(APIView):
    def post(self, request):
        print("🚀 [POST] /lesson-view-log")

        # ✅ Xác thực người dùng từ token
        user, error_response = get_authenticated_user(request)
        if error_response:
            print("❌ Người dùng chưa xác thực.")
            return error_response

        # ✅ Lấy lesson ID từ request
        lesson_id = request.data.get('lesson')
        if not lesson_id:
            print("❌ Không có lesson ID.")
            return Response({'error': 'Thiếu ID bài học'}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Tìm bài học
        try:
            lesson = Lesson.objects.get(id=lesson_id)
            print(f"🎥 Bài học: ID={lesson.id}, Tiêu đề='{lesson.title}'")
        except Lesson.DoesNotExist:
            print("❌ Không tìm thấy bài học.")
            return Response({'error': 'Không tìm thấy bài học'}, status=status.HTTP_404_NOT_FOUND)

        # ✅ Tạo bản ghi lượt xem
        lesson_view = LessonVideoView.objects.create(lesson=lesson, user=user)
        print(f"📺 Ghi nhận lượt xem: User={user.username}, Time={lesson_view.view_at}")

        return Response({'message': 'Đã ghi nhận lượt xem'}, status=status.HTTP_201_CREATED)
