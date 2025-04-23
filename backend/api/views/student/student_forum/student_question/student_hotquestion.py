from django.db.models import Count, Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import Question, Vote


class StudentHotQuestionView(APIView):
    def get(self, request):
        # Lọc các vote cho question và là like
        vote_counts = (
            Vote.objects
            .filter(vote_for='question', vote_type='like')
            .values('content_id')  # content_id chính là question_id
            .annotate(like_count=Count('id'))
            .order_by('-like_count')[:10]
        )

        # Lấy danh sách question_id từ vote_counts
        hot_question_ids = [item['content_id'] for item in vote_counts]

        # Đảm bảo giữ thứ tự theo số lượt like
        hot_questions = list(
            Question.objects
            .filter(id__in=hot_question_ids)
            .values('id', 'title')
        )

        # Đảm bảo thứ tự hot_questions theo vote_counts
        hot_questions_sorted = sorted(
            hot_questions,
            key=lambda x: hot_question_ids.index(x['id'])
        )

        return Response(hot_questions_sorted, status=status.HTTP_200_OK)