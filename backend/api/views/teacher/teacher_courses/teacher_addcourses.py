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
from api.serializers import CourseListSerializer
import urllib.parse
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
        level = request.data.get('courseLevel', '')
        chapters_data = request.data.get('chapters')

        if not title:
            return Response({'error': 'Tiêu đề khóa học là bắt buộc.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Create the course
            course = Course.objects.create(
                title=title,
                intro=description,
                tags=tags,
                fee=price,
                intro_video=intro_video,
                thumbnail=thumbnail,
                qr_code=qr_code,
                user=user,
                level=level
            )

            # Initialize video count and total duration
            total_duration = timedelta()
            video_count = 0

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
                        video_duration = self.get_video_duration(video_file)

                        # Update total_duration and video_count
                        total_duration += video_duration
                        if video_file:
                            video_count += 1

                        document_file = request.FILES.get(lesson_data.get('document_link'))
                        document_storage_path = os.path.join('image', 'lesson_documents')
                        if not os.path.exists(document_storage_path):
                            os.makedirs(document_storage_path)

                        if document_file:
                            fs = FileSystemStorage(location=document_storage_path)
                            document_file_name = fs.save(document_file.name, document_file)
                        else:
                            document_file_name = None

                        Lesson.objects.create(
                            chapter=chapter,
                            title=lesson_data['title'],
                            video=video_file,
                            duration=video_duration,
                            document_link=f'lesson_documents/{document_file_name}' if document_file else None
                        )

            # Update the course's total duration and video count
            course.total_duration = total_duration
            course.video_count = video_count
            course.save()

            return Response({'message': 'Khóa học được tạo thành công.', 'course_id': course.id}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        course_id = kwargs['pk']  # Lấy tham số 'pk' từ kwargs
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
        level = request.data.get('courseLevel', course.level)
        chapters_data = request.data.get('chapters')

        if title: course.title = title
        if description: course.intro = description
        if tags is not None: course.tags = tags
        if price is not None: course.fee = price
        if intro_video: course.intro_video = intro_video
        if thumbnail: course.thumbnail = thumbnail
        if qr_code: course.qr_code = qr_code
        course.level = level
        course.save()

        try:
            # Initialize video count and total duration
            total_duration = timedelta()
            video_count = 0

            if chapters_data:
                if isinstance(chapters_data, str):
                    chapters_data = json.loads(chapters_data)

                # Delete existing chapters and lessons
                course.chapters.all().delete()

                for chapter_data in chapters_data:
                    chapter = Chapter.objects.create(
                        course=course,
                        title=chapter_data['title'],
                        lesson_count=len(chapter_data.get('lessons', []))
                    )

                    for lesson_data in chapter_data.get('lessons', []):
                        video_file = request.FILES.get(lesson_data['video'])
                        video_duration = self.get_video_duration(video_file)

                        # Update total_duration and video_count
                        total_duration += video_duration
                        if video_file:
                            video_count += 1

                        document_file = request.FILES.get(lesson_data.get('document_link'))
                        document_storage_path = os.path.join('image', 'lesson_documents')
                        if not os.path.exists(document_storage_path):
                            os.makedirs(document_storage_path)

                        if document_file:
                            fs = FileSystemStorage(location=document_storage_path)
                            document_file_name = fs.save(document_file.name, document_file)
                        else:
                            document_file_name = None

                        Lesson.objects.create(
                            chapter=chapter,
                            title=lesson_data['title'],
                            video=video_file,
                            duration=video_duration,
                            document_link=f'lesson_documents/{document_file_name}' if document_file else None
                        )

            # Update the course's total duration and video count
            course.total_duration = total_duration
            course.video_count = video_count
            course.save()

            return Response({'message': 'Cập nhật khóa học thành công.'}, status=status.HTTP_200_OK)

        except Exception as e:
            course.delete()
            return Response({'error': 'Có lỗi xảy ra khi cập nhật khóa học.'}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response
        
        # Lấy tham số filter từ URL và giải mã nếu cần
        filter_param = request.GET.get('filter', 'all')
        filter_param = urllib.parse.unquote(filter_param)  # Giải mã URL

        print(f"Filter param after decoding: {filter_param}")  # In ra giá trị sau khi giải mã
        
        # Kiểm tra giá trị filter và áp dụng filter tương ứng
        if filter_param == 'Khóa học của tôi':  # So sánh với giá trị đã giải mã
            print(f"Filter is 'mine', filtering courses for user: {user}")
            courses = Course.objects.filter(user=user)
        else:
            print(f"Filter is 'all', fetching all courses.")
            courses = Course.objects.all()

        serializer = CourseListSerializer(courses, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get_video_duration(self, video_file):
        if not video_file:
            return timedelta()

        video_path = f'/tmp/{video_file.name}'
        with open(video_path, 'wb') as f:
            for chunk in video_file.chunks():
                f.write(chunk)

        try:
            clip = VideoFileClip(video_path)
            duration_seconds = int(clip.duration)
            return timedelta(seconds=duration_seconds)
        except Exception as e:
            print(f"Error reading video: {e}")
            return timedelta()
        finally:
            try:
                os.remove(video_path)
            except Exception as e:
                print(f"Error removing file: {e}")
