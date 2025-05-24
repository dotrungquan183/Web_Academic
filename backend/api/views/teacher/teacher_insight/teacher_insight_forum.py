from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import connection
import urllib.parse

class TeacherInsightDataView(APIView):
    permission_classes = []  # Không yêu cầu xác thực

    def get(self, request):
        chart = request.GET.get('chart', '')
        chart = urllib.parse.unquote(chart)

        allowed_charts = [
            'user_activity',
            'daily_views',
            'daily_votes',
            'vote_ratio',
            'top_questions_by_views',
            'accepted_answers',
            'avg_votes_per_question',
            'daily_questions',
            'tag_question_count',
            'bounty_distribution',
            'comment_type_distribution',
            'daily_answers'
        ]

        if chart not in allowed_charts:
            return Response({"error": "Invalid chart type"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with connection.cursor() as cursor:
                cursor.execute(f"SELECT * FROM insight_{chart}")
                columns = [col[0] for col in cursor.description]
                data = [dict(zip(columns, row)) for row in cursor.fetchall()]
        except Exception as e:
            print(f"[ERROR] Failed to fetch insight_{chart}: {e}")  # <-- Log lỗi ở đây
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(data, status=status.HTTP_200_OK)
