from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import Lesson, LessonDocumentView
from api.views.auth.authHelper import get_authenticated_user

class StudentLessonDocumentView(APIView):
    def post(self, request):
        print("📄 [POST] /lesson-document-view-log")

        # ✅ Xác thực người dùng từ token
        user, error_response = get_authenticated_user(request)
        if error_response:
            print("❌ Người dùng chưa xác thực.")
            return error_response

        # ✅ Lấy lesson ID từ request
        lesson_id = request.data.get('lesson')
        if not lesson_id:
            print("❌ Thiếu ID bài học.")
            return Response({'error': 'Thiếu ID bài học'}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Tìm bài học
        try:
            lesson = Lesson.objects.get(id=lesson_id)
            print(f"📚 Bài học: ID={lesson.id}, Tiêu đề='{lesson.title}'")
        except Lesson.DoesNotExist:
            print("❌ Không tìm thấy bài học.")
            return Response({'error': 'Không tìm thấy bài học'}, status=status.HTTP_404_NOT_FOUND)

        # ✅ Tạo bản ghi lượt xem tài liệu
        document_view = LessonDocumentView.objects.create(lesson=lesson, user=user)
        print(f"✅ Ghi nhận xem tài liệu: User={user.username}, Time={document_view.view_at}")

        return Response({'message': 'Đã ghi nhận xem tài liệu'}, status=status.HTTP_201_CREATED)
