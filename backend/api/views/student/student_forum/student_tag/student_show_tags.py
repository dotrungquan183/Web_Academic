from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.db.models import Count, Q, Max
from api.models import QuestionTag

class StudentShowTagsView(APIView):
    def get(self, request):
        filter_type = request.GET.get('filter', 'Popular')
        now = timezone.now()
        start_of_today = now.replace(hour=0, minute=0, second=0, microsecond=0)
        start_of_week = start_of_today - timezone.timedelta(days=start_of_today.weekday())

        # Annotate số lượng câu hỏi theo từng tag
        base_queryset = QuestionTag.objects.annotate(
            total_questions=Count('questiontagmap__question'),
            questions_today=Count(
                'questiontagmap__question',
                filter=Q(questiontagmap__question__created_at__gte=start_of_today)
            ),
            questions_this_week=Count(
                'questiontagmap__question',
                filter=Q(questiontagmap__question__created_at__gte=start_of_week)
            ),
        )

        if filter_type == "Newest":
            # Lấy ngày câu hỏi mới nhất cho mỗi tag, sắp xếp giảm dần, lấy 10
            base_queryset = base_queryset.annotate(
                latest_question_created=Max('questiontagmap__question__created_at')
            ).order_by('-latest_question_created')[:10]

        elif filter_type == "Popular":
            # Sắp xếp theo tổng câu hỏi giảm dần, lấy 10
            base_queryset = base_queryset.order_by('-total_questions')[:10]

        elif filter_type == "All":
            # Trả về tất cả tag không giới hạn và không sắp xếp đặc biệt
            base_queryset = base_queryset.order_by('tag_name')

        else:
            # Mặc định cũng trả về Popular để tránh lỗi
            base_queryset = base_queryset.order_by('-total_questions')[:10]

        tags = base_queryset.values(
            'id',
            'tag_name',
            'total_questions',
            'questions_today',
            'questions_this_week'
        )

        return Response({'tags': list(tags)}, status=status.HTTP_200_OK)
