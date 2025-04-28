from api.views.auth.authHelper import get_authenticated_user
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from api.models import Course, Chapter, Lesson
from datetime import timedelta
import json
import os
from moviepy import VideoFileClip
from django.core.files.storage import FileSystemStorage

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
        qr_code = request.FILES.get('qr_code')
        chapters_data = request.data.get('chapters')

        if not title:
            return Response({'error': 'Tiêu đề khóa học là bắt buộc.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Tạo khóa học mới
            course = Course.objects.create(
                title=title,
                intro=description,
                tags=tags,
                fee=price,
                intro_video=intro_video,
                thumbnail=thumbnail,
                qr_code=qr_code,
                user=user,
            )

            # Chỉ khi tạo khóa học thành công mới tiếp tục xử lý chapters và lessons
            if chapters_data:
                if isinstance(chapters_data, str):
                    chapters_data = json.loads(chapters_data)

                for chapter_data in chapters_data:
                    chapter = Chapter.objects.create(
                        course=course,
                        title=chapter_data['title'],
                        lesson_count=len(chapter_data.get('lessons', []))
                    )

                    for lesson_data in chapter_data.get('lessons', []):
                        video_file = request.FILES.get(lesson_data['video'])
                        # Lấy thời gian video
                        video_duration = self.get_video_duration(video_file)

                        # Kiểm tra nếu có tài liệu bài học
                        document_file = request.FILES.get(lesson_data.get('document_link'))

                        # Tạo thư mục để lưu tài liệu nếu chưa tồn tại
                        document_storage_path = os.path.join('image', 'lesson_documents')  # Đổi đường dẫn lưu tài liệu
                        if not os.path.exists(document_storage_path):
                            os.makedirs(document_storage_path)

                        # Lưu tài liệu vào thư mục lesson_documents
                        if document_file:
                            fs = FileSystemStorage(location=document_storage_path)
                            document_file_name = fs.save(document_file.name, document_file)
                            document_file_url = fs.url(document_file_name)
                        else:
                            document_file_url = None

                        Lesson.objects.create(
                            chapter=chapter,
                            title=lesson_data['title'],
                            video=video_file,
                            duration=video_duration,  # Gán thời gian video vào duration
                            document_link=f'lesson_documents/{document_file_name}' if document_file else None  # Lưu URL tài liệu
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
        qr_code = request.FILES.get('qr_code')
        chapters_data = request.data.get('chapters')

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
        if qr_code:
            course.qr_code = qr_code

        # Cập nhật khóa học trong cơ sở dữ liệu
        course.save()

        try:
            # Chỉ khi cập nhật khóa học thành công mới tiếp tục xử lý chapters và lessons
            if chapters_data:
                if isinstance(chapters_data, str):
                    chapters_data = json.loads(chapters_data)

                # Xóa hết chapter + lesson cũ
                course.chapters.all().delete()

                # Tạo mới lại chapters và lessons
                for chapter_data in chapters_data:
                    chapter = Chapter.objects.create(
                        course=course,
                        title=chapter_data['title'],
                        lesson_count=len(chapter_data.get('lessons', []))
                    )

                    for lesson_data in chapter_data.get('lessons', []):
                        video_file = request.FILES.get(lesson_data['video'])
                        # Lấy thời gian video
                        video_duration = self.get_video_duration(video_file)

                        # Kiểm tra nếu có tài liệu bài học
                        document_file = request.FILES.get(lesson_data.get('document_link'))

                        # Tạo thư mục để lưu tài liệu nếu chưa tồn tại
                        document_storage_path = os.path.join('image', 'lesson_documents')  # Đổi đường dẫn lưu tài liệu
                        if not os.path.exists(document_storage_path):
                            os.makedirs(document_storage_path)

                        # Lưu tài liệu vào thư mục lesson_documents
                        if document_file:
                            fs = FileSystemStorage(location=document_storage_path)
                            document_file_name = fs.save(document_file.name, document_file)
                            document_file_url = fs.url(document_file_name)
                        else:
                            document_file_url = None

                        Lesson.objects.create(
                            chapter=chapter,
                            title=lesson_data['title'],
                            video=video_file,
                            duration=video_duration,  # Gán thời gian video vào duration
                            document_link=f'lesson_documents/{document_file_name}' if document_file else None  # Lưu URL tài liệu
                        )

            return Response({'message': 'Cập nhật khóa học thành công.'}, status=status.HTTP_200_OK)

        except Exception as e:
            # Nếu có lỗi trong quá trình cập nhật chapters và lessons thì xóa khóa học đã lưu để tránh lỗi
            course.delete()
            return Response({'error': 'Có lỗi xảy ra khi cập nhật khóa học.'}, status=status.HTTP_400_BAD_REQUEST)

    def get_video_duration(self, video_file):
        """
        Lấy thời gian video từ file video.
        """
        if not video_file:
            return timedelta()

        video_path = f'/tmp/{video_file.name}'  # Đường dẫn tạm thời để lưu file video
        with open(video_path, 'wb') as f:
            for chunk in video_file.chunks():
                f.write(chunk)

        try:
            # Sử dụng moviepy để lấy thời gian video
            clip = VideoFileClip(video_path)
            duration = clip.duration  # Thời gian video tính bằng giây
            return timedelta(seconds=duration)
        except Exception as e:
            return timedelta()  # Nếu có lỗi thì trả về timedelta() (0 giây)
        finally:
            # Đảm bảo xóa file video sau khi lấy thời gian xong và giải phóng tài nguyên
            try:
                os.remove(video_path)
            except Exception as e:
                print(f"Error removing file: {e}")
