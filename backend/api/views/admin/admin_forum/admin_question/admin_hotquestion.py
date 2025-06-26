from django.db.models import Count
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import Question, VoteForQuestion


class AdminHotQuestionView(APIView):
    def get(self, request):
        # 1. Lọc danh sách câu hỏi like nhiều nhất (chỉ những câu hỏi is_approve=0)
        like_counts = (
            VoteForQuestion.objects
            .filter(vote_type='like', question__is_approve=0)  # Lọc câu hỏi đã được duyệt
            .values('question_id')
            .annotate(like_count=Count('id'))
            .order_by('-like_count')[:10]
        )

        # 2. Danh sách question_id đã sort theo like_count
        hot_question_ids = [item['question_id'] for item in like_counts]

        # 3. Lấy danh sách câu hỏi
        hot_questions = list(
            Question.objects
            .filter(id__in=hot_question_ids, is_approve=0)
            .values('id', 'title')
        )

        # 4. Sắp xếp câu hỏi đúng thứ tự like_count
        hot_questions_sorted = sorted(
            hot_questions,
            key=lambda x: hot_question_ids.index(x['id'])
        )

        return Response(hot_questions_sorted, status=status.HTTP_200_OK)
