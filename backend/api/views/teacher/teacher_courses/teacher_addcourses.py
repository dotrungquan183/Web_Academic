from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from api.models import Course, Chapter, Lesson, Homework, HomeworkQuestion, HomeworkChoice
from api.views.auth.authHelper import get_authenticated_user
from pytube import YouTube
import json
from datetime import timedelta
from api.serializers import CourseListSerializer
from urllib.parse import unquote
import re
import yt_dlp
from decimal import Decimal, InvalidOperation

class TeacherAddCoursesView(APIView):
    permission_classes = [permissions.AllowAny]

    def convert_to_embed_url(self, url):
        try:
            # Nếu đã là embed rồi thì trả luôn
            if 'youtube.com/embed/' in url:
                return url

            # Dùng regex lấy video id từ URL youtube chuẩn
            video_id_match = re.search(r'(?:v=|youtu\.be/)([a-zA-Z0-9_-]+)', url)
            if video_id_match:
                video_id = video_id_match.group(1)
                embed_url = f'https://www.youtube.com/embed/{video_id}'
                return embed_url
            else:
                return url  # Trả lại link gốc nếu không tìm được id
        except Exception as e:
            print(f"Lỗi chuyển đổi sang embed URL: {e}")
            return url
    
    def get_youtube_duration(self, url):
        try:
            # Chuyển embed sang URL chuẩn
            if 'youtube.com/embed/' in url:
                video_id = re.search(r'youtube\.com/embed/([a-zA-Z0-9_-]+)', url)
                if video_id:
                    url = f"https://www.youtube.com/watch?v={video_id.group(1)}"

            ydl_opts = {}
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)
                duration = info.get('duration', 0)  # đơn vị là giây
                return timedelta(seconds=duration)

        except Exception as e:
            print(f"Lỗi khi lấy độ dài video từ URL: {url}")
            print(f"Lỗi chi tiết: {e}")
            return timedelta()


    def post(self, request):
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        try:
            title = request.data.get('title')
            description = request.data.get('description', '')
            tags = request.data.get('tags', '')
            price_str = request.data.get('price', '0')
            level = request.data.get('courseLevel', '')
            intro_video = request.data.get('introVideo', '')
            chapters_data = request.data.get('chapters')
            thumbnail_file = request.FILES.get('courseImage')

            try:
                price = Decimal(price_str)
            except InvalidOperation:
                return Response({'error': 'Giá trị phí không hợp lệ.'}, status=status.HTTP_400_BAD_REQUEST)

            if not title:
                return Response({'error': 'Tiêu đề khóa học là bắt buộc.'}, status=status.HTTP_400_BAD_REQUEST)

            course = Course.objects.create(
                title=title,
                intro=description,
                tags=tags,
                fee=price,
                level=level,
                intro_video=intro_video,
                user=user,
                thumbnail=thumbnail_file
            )

            total_duration = timedelta()
            video_count = 0

            if isinstance(chapters_data, str):
                import json
                chapters_data = json.loads(chapters_data)

            document_files = request.FILES.getlist('document_link')
            file_pointer = 0

            for chapter_data in chapters_data:
                chapter = Chapter.objects.create(
                    course=course,
                    title=chapter_data['title'],
                    lesson_count=len(chapter_data.get('lessons', []))
                )

                for lesson_data in chapter_data.get('lessons', []):
                    video_url = lesson_data.get('video', '')
                    embed_url = self.convert_to_embed_url(video_url) if video_url else ''
                    duration = self.get_youtube_duration(video_url) if video_url else timedelta()

                    if video_url:
                        total_duration += duration
                        video_count += 1

                    document_file = None
                    if file_pointer < len(document_files):
                        document_file = document_files[file_pointer]
                        file_pointer += 1

                    lesson = Lesson.objects.create(
                        chapter=chapter,
                        title=lesson_data['title'],
                        video=embed_url,
                        duration=duration,
                        document_link=document_file
                    )

                    # Tạo bài tập nếu có exercise
                    if 'exercise' in lesson_data:
                        homework = Homework.objects.create(
                            lesson=lesson,
                            title=lesson.title,
                            description=lesson.title
                        )
                        for ex in lesson_data['exercise']:
                            answers = ex.get('answers', [])
                            correct_count = sum(1 for ans in answers if ans.get('is_correct', False))
                            question_type = 'multiple' if correct_count > 1 else 'single'

                            question = HomeworkQuestion.objects.create(
                                homework=homework,
                                question_text=ex['question'],
                                question_type=question_type
)

                            for ans in ex.get('answers', []):
                                HomeworkChoice.objects.create(
                                    question=question,
                                    choice_text=ans['choice_text'],
                                    is_correct=ans['is_correct']
                                )

            course.total_duration = total_duration
            course.video_count = video_count
            course.save()

            return Response({'message': 'Tạo khóa học thành công.', 'course_id': course.id}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


    def put(self, request, *args, **kwargs):
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        course_id = kwargs.get('pk')
        try:
            course = Course.objects.get(id=course_id, user=user)
        except Course.DoesNotExist:
            return Response({'error': 'Không tìm thấy khóa học hoặc bạn không có quyền chỉnh sửa.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            title = request.data.get('title')
            description = request.data.get('description', '')
            tags = request.data.get('tags', '')
            price_str = request.data.get('price', '0')
            level = request.data.get('courseLevel', course.level)
            intro_video = request.data.get('introVideo', course.intro_video)
            chapters_data = request.data.get('chapters')
            thumbnail_file = request.FILES.get('courseImage')

            try:
                price = Decimal(price_str)
            except InvalidOperation:
                return Response({'error': 'Giá trị phí không hợp lệ.'}, status=status.HTTP_400_BAD_REQUEST)

            # Cập nhật
            if title:
                course.title = title
            if description is not None:
                course.intro = description
            if tags is not None:
                course.tags = tags
            course.fee = price
            course.level = level
            course.intro_video = intro_video
            if thumbnail_file:
                course.thumbnail = thumbnail_file
            course.save()

            total_duration = timedelta()
            video_count = 0

            if isinstance(chapters_data, str):
                import json
                chapters_data = json.loads(chapters_data)

            # Xóa toàn bộ chương, bài học, bài tập cũ
            course.chapters.all().delete()

            document_files = request.FILES.getlist('document_link')
            file_pointer = 0

            for chapter_data in chapters_data:
                chapter = Chapter.objects.create(
                    course=course,
                    title=chapter_data['title'],
                    lesson_count=len(chapter_data.get('lessons', []))
                )

                for lesson_data in chapter_data.get('lessons', []):
                    video_url = lesson_data.get('video', '')
                    embed_url = self.convert_to_embed_url(video_url) if video_url else ''
                    duration = self.get_youtube_duration(video_url) if video_url else timedelta()

                    if video_url:
                        total_duration += duration
                        video_count += 1

                    document_file = None
                    if file_pointer < len(document_files):
                        document_file = document_files[file_pointer]
                        file_pointer += 1

                    lesson = Lesson.objects.create(
                        chapter=chapter,
                        title=lesson_data['title'],
                        video=embed_url,
                        duration=duration,
                        document_link=document_file
                    )

                    if 'exercise' in lesson_data:
                        homework = Homework.objects.create(
                            lesson=lesson,
                            title=lesson.title,
                            description=lesson.title
                        )
                        for ex in lesson_data['exercise']:
                            answers = ex.get('answers', [])
                            correct_count = sum(1 for ans in answers if ans.get('is_correct', False))
                            question_type = 'multiple' if correct_count > 1 else 'single'

                            question = HomeworkQuestion.objects.create(
                                homework=homework,
                                question_text=ex['question'],
                                question_type=question_type
                            )

                            for ans in ex.get('answers', []):
                                HomeworkChoice.objects.create(
                                    question=question,
                                    choice_text=ans['choice_text'],
                                    is_correct=ans['is_correct']
                                )

            course.total_duration = total_duration
            course.video_count = video_count
            course.save()

            return Response({'message': 'Cập nhật khóa học thành công.'}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)



    def get(self, request):
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        # ✅ Lấy filter từ query param và giải mã
        filter_param = unquote(request.GET.get('filter', 'all'))
        print(f"Filter param after decoding: {filter_param}")

        # ✅ Lọc khóa học đã được duyệt
        if filter_param == 'Khóa học của tôi':
            print(f"Filter is 'mine', filtering approved courses for user: {user}")
            courses = Course.objects.filter(user=user, is_approve=1)
        else:
            print(f"Filter is 'all', fetching all approved courses")
            courses = Course.objects.filter(is_approve=1)

        # ✅ Serialize và trả dữ liệu
        serializer = CourseListSerializer(courses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)