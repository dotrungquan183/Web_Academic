from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import IntegerField, Case, When, Value, Sum
from django.db.models.functions import Coalesce
from django.db.models import OuterRef, Subquery

from api.models import Answer, Vote
from api.views.auth.authHelper import get_authenticated_user


class TeacherProfileAnswerView(APIView):
    def get(self, request):
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        filter_type = request.query_params.get("filter", "newest")

        # Subquery: tổng điểm vote cho mỗi câu trả lời
        vote_score_subquery = Vote.objects.filter(
            vote_for='answer',
            content_id=OuterRef('pk')
        ).annotate(
            vote_value=Case(
                When(vote_type='like', then=Value(1)),
                When(vote_type='dislike', then=Value(-1)),
                default=Value(0),
                output_field=IntegerField()
            )
        ).values('content_id').annotate(
            total=Sum('vote_value')
        ).values('total')

        answers = Answer.objects.filter(user_id=user.id).annotate(
            vote_score=Coalesce(Subquery(vote_score_subquery, output_field=IntegerField()), 0)
        )

        # Lọc theo kiểu yêu cầu
        if filter_type == "newest":
            answers = answers.order_by("-created_at")[:5]
        elif filter_type == "votes":
            answers = answers.order_by("-vote_score", "-created_at")[:5]
        elif filter_type == "all":
            answers = answers.order_by("-created_at")
        else:
            return Response({"error": "Invalid filter type"}, status=status.HTTP_400_BAD_REQUEST)

        # Format JSON trả về
        answer_list = [{
            "id": a.id,
            "question_id": a.question_id,
            "content": a.content,
            "vote_score": a.vote_score,
            "created_at": a.created_at,
        } for a in answers]

        return Response(answer_list, status=status.HTTP_200_OK)
