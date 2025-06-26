from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count, Sum
from django.db.models.functions import ExtractWeek
from datetime import timedelta

from api.models import (
    Course, Chapter, Lesson, CourseRegistration,
    LessonVideoView, LessonDocumentView, UserInformation,
    Question, Answer, VoteForQuestion, VoteForAnswer,
    CommentForQuestion, CommentForAnswer
)

class TeacherDashboardCoursesView(APIView):
    def get(self, request):
        # ====== COURSE DATA ======
        total_courses = Course.objects.count()
        approved_courses = Course.objects.filter(is_approve=1).count()
        pending_courses = Course.objects.filter(is_approve=0).count()
        rejected_courses = Course.objects.filter(is_approve=2).count()
        total_students = CourseRegistration.objects.count()
        total_videos = Lesson.objects.count()
        total_duration = Lesson.objects.aggregate(total=Sum('duration'))['total'] or timedelta()
        total_minutes = int(total_duration.total_seconds() / 60)

        # ====== WEEKLY VIEWS ======
        videoViewsData = list(
            LessonVideoView.objects.annotate(week=ExtractWeek('view_at'))
            .values('week')
            .annotate(views=Count('id')).order_by('week')
        )
        videoViewsData = [{"week": f"T{d['week']}", "views": d['views']} for d in videoViewsData]

        documentViewsData = list(
            LessonDocumentView.objects.annotate(week=ExtractWeek('view_at'))
            .values('week')
            .annotate(views=Count('id')).order_by('week')
        )
        documentViewsData = [{"week": f"T{d['week']}", "views": d['views']} for d in documentViewsData]

        # ====== TOP LESSONS ======
        topLessonsData = list(
            LessonVideoView.objects.values('lesson__title', 'lesson__chapter__course__title')
            .annotate(views=Count('id')).order_by('-views')[:5]
        )
        topLessonsData = [
            {
                "title": d['lesson__title'],
                "course": d['lesson__chapter__course__title'],
                "views": d['views']
            } for d in topLessonsData
        ]

        # ====== TOP DOCUMENTS ======
        topDocumentsData = list(
            LessonDocumentView.objects.values('lesson__title')
            .annotate(views=Count('id')).order_by('-views')[:5]
        )
        topDocumentsData = [
            {
                "title": d['lesson__title'],
                "type": "PDF - Tài liệu",
                "views": d['views']
            } for d in topDocumentsData
        ]

        # ====== REPUTATION ======
        reputation = UserInformation.objects.aggregate(total=Sum('reputation'))['total'] or 0

        # ====== WEEKLY CONTENT DATA ======
        weeklyContentData = []
        for i in range(1, 7):
            video_views = LessonVideoView.objects.filter(view_at__week=i).count()
            document_views = LessonDocumentView.objects.filter(view_at__week=i).count()
            completion_rate = 75 + i  # giả lập tạm
            weeklyContentData.append({
                "week": f"T{i}",
                "videoViews": video_views,
                "documentViews": document_views,
                "completionRate": completion_rate
            })

        # ====== CONTENT ENGAGEMENT DATA ======
        contentEngagementData = []
        for course in Course.objects.all()[:5]:
            video_views = LessonVideoView.objects.filter(lesson__chapter__course=course).count()
            doc_views = LessonDocumentView.objects.filter(lesson__chapter__course=course).count()
            downloads = doc_views // 10  # giả lập
            contentEngagementData.append({
                "content": course.title,
                "videoViews": video_views,
                "documentViews": doc_views,
                "downloads": downloads
            })

        # ====== WEEKLY ACTIVITY ======
        from django.utils import timezone
        from datetime import timedelta

        now = timezone.now()
        weeklyActivityData = []

        for i in range(6, 0, -1):
            start_of_week = now - timedelta(weeks=i)
            end_of_week = now - timedelta(weeks=i-1)

            answers = Answer.objects.filter(created_at__range=(start_of_week, end_of_week)).count()
            comments_q = CommentForQuestion.objects.filter(created_at__range=(start_of_week, end_of_week)).count()
            comments_a = CommentForAnswer.objects.filter(created_at__range=(start_of_week, end_of_week)).count()
            votes_q = VoteForQuestion.objects.filter(created_at__range=(start_of_week, end_of_week)).count()
            votes_a = VoteForAnswer.objects.filter(created_at__range=(start_of_week, end_of_week)).count()

            weeklyActivityData.append({
                "week": f"T{7 - i}",  # T1 đến T6
                "answers": answers,
                "comments": comments_q + comments_a,
                "votes": votes_q + votes_a
            })


        # ====== RESPONSE TIME (mock) ======
        responseTimeData = [
            { "timeRange": "< 1h", "count": 15 },
            { "timeRange": "1-6h", "count": 12 },
            { "timeRange": "6-24h", "count": 8 },
            { "timeRange": "1-3 ngày", "count": 5 },
            { "timeRange": "> 3 ngày", "count": 2 }
        ]

        # ====== PERFORMANCE METRICS (mock) ======
        performanceMetrics = [
            {
                "label": "Tỷ lệ câu trả lời hữu ích",
                "value": "94%",
                "percentage": 94,
                "color": "#10b981",
                "subtitle": "Rất tốt so với trung bình"
            },
            {
                "label": "Thời gian phản hồi trung bình",
                "value": "2.3h",
                "percentage": 85,
                "color": "#3b82f6",
                "subtitle": "Nhanh hơn 85% giáo viên khác"
            },
            {
                "label": "Mức độ tương tác",
                "value": "8.7/10",
                "percentage": 87,
                "color": "#f59e0b",
                "subtitle": "Học sinh đánh giá cao"
            },
            {
                "label": "Tần suất hoạt động",
                "value": "5.2 ngày/tuần",
                "percentage": 74,
                "color": "#8b5cf6",
                "subtitle": "Hoạt động đều đặn"
            }
        ]

        # ====== ACTIVITY SUMMARY ======
        activityData = [
            { "type": "Câu trả lời", "count": Answer.objects.count(), "color": "#3b82f6" },
            { "type": "Bình luận", "count": CommentForQuestion.objects.count() + CommentForAnswer.objects.count(), "color": "#f59e0b" },
            { "type": "Votes nhận", "count": VoteForQuestion.objects.count() + VoteForAnswer.objects.count(), "color": "#10b981" },
            { "type": "Câu hỏi", "count": Question.objects.count(), "color": "#8b5cf6" }
        ]

        # ====== FORUM DATA ======
        total_answers = Answer.objects.count()
        accepted_answers = Question.objects.exclude(accepted_answer_id__isnull=True).count()
        total_votes = VoteForQuestion.objects.count() + VoteForAnswer.objects.count()
        total_comments = CommentForQuestion.objects.count() + CommentForAnswer.objects.count()
        helpful_comments = CommentForQuestion.objects.filter(is_approve=1).count() + CommentForAnswer.objects.filter(is_approve=1).count()
        total_questions = Question.objects.count()
        approved_questions = Question.objects.filter(is_approve=1).count()

        forumData = {
            "totalAnswers": total_answers,
            "acceptedAnswers": accepted_answers,
            "totalVotes": total_votes,
            "reputation": reputation,
            "totalComments": total_comments,
            "helpfulComments": helpful_comments,
            "totalQuestions": total_questions,
            "approvedQuestions": approved_questions
        }

        # ====== MONTHLY STUDENT REGISTRATION DATA ======
        from django.db.models.functions import ExtractMonth

        monthlyStudentDataRaw = CourseRegistration.objects.annotate(
            month=ExtractMonth('registered_at')
        ).values('month').annotate(
            students=Count('id')
        ).order_by('month')

        monthlyStudentData = []
        for i in range(1, 13):  # Lấy 6 tháng đầu năm
            record = next((item for item in monthlyStudentDataRaw if item['month'] == i), None)
            monthlyStudentData.append({
                "month": f"T{i}",
                "students": record['students'] if record else 0
            })

       # ====== COURSE POPULARITY DATA ======
        coursePopularityQuery = (
            CourseRegistration.objects
            .values('course_id', 'course__title', 'course__video_count', 'course__total_duration')
            .annotate(student_count=Count('user_id'))
            .order_by('-student_count')[:5]
        )

        coursePopularityData = []
        for c in coursePopularityQuery:
            duration_minutes = 0
            if c['course__total_duration']:
                duration_minutes = int(c['course__total_duration'].total_seconds() // 60)
            coursePopularityData.append({
                "name": c['course__title'],
                "students": c['student_count'],
                "videos": c['course__video_count'],
                "duration": duration_minutes
            })
        
        # ====== REPUTATION DATA - TOP USERS ======
        topReputationUsers = (
            UserInformation.objects
            .order_by('-reputation')
            .values('full_name', 'reputation')[:6]
        )

        reputationData = [
            {
                "user": u['full_name'],
                "reputation": u['reputation']
            }
            for u in topReputationUsers
        ]
        
        # ====== FINAL RESPONSE ======
        return Response({
            "courseData": {
                "totalCourses": total_courses,
                "totalStudents": total_students,
                "totalVideos": total_videos,
                "totalDuration": total_minutes,
                "approvedCourses": approved_courses,
                "pendingCourses": pending_courses,
                "rejectedCourses": rejected_courses
            },
            "videoViewsData": videoViewsData,
            "documentViewsData": documentViewsData,
            "topLessonsData": topLessonsData,
            "topDocumentsData": topDocumentsData,
            "reputation": reputation,
            "weeklyContentData": weeklyContentData,
            "contentEngagementData": contentEngagementData,
            "weeklyActivityData": weeklyActivityData,
            "responseTimeData": responseTimeData,
            "performanceMetrics": performanceMetrics,
            "activityData": activityData,
            "forumData": forumData,
            "monthlyStudentData": monthlyStudentData,
            "coursePopularityData": coursePopularityData,
            "reputationData": reputationData,
        })
