from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum, IntegerField, Case, When, Value
from django.db.models.functions import Coalesce
from django.db.models import OuterRef, Subquery

from api.models import Question, Vote, View
from api.views.auth.authHelper import get_authenticated_user


class TeacherProfileQuestionView(APIView):
    def get(self, request):
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response  # Trả về lỗi xác thực nếu có

        filter_type = request.query_params.get("filter", "newest")

        # Subquery: tổng vote cho mỗi câu hỏi
        vote_score_subquery = Vote.objects.filter(
            vote_for='question',
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

        # Subquery: tổng lượt xem cho mỗi câu hỏi
        view_total_subquery = View.objects.filter(
            question_id=OuterRef('pk')
        ).values('question_id').annotate(
            total=Sum('view_count')
        ).values('total')

        # Query chính: lọc theo user đang đăng nhập
        questions = Question.objects.filter(user_id=user.id).annotate(
            vote_score=Coalesce(Subquery(vote_score_subquery, output_field=IntegerField()), 0),
            view_total=Coalesce(Subquery(view_total_subquery, output_field=IntegerField()), 0)
        )

        # Sắp xếp theo filter
        if filter_type == "newest":
            questions = questions.order_by("-created_at")[:5]
        elif filter_type == "bountied":
            questions = questions.filter(bounty_amount__gt=0).order_by("-bounty_amount", "-created_at")[:5]
        elif filter_type == "votes":
            questions = questions.order_by("-vote_score", "-created_at")[:5]
        elif filter_type == "views":
            questions = questions.order_by("-view_total", "-created_at")[:5]
        elif filter_type == "all":
            questions = questions.order_by("-created_at")
        else:
            return Response({"error": "Invalid filter type"}, status=status.HTTP_400_BAD_REQUEST)

        # Tạo JSON response
        question_list = [{
            "id": q.id,
            "title": q.title,
            "vote_score": q.vote_score,
            "view_count": q.view_total,
            "created_at": q.created_at,
            "bounty_amount": q.bounty_amount or 0,
        } for q in questions]

        return Response(question_list, status=status.HTTP_200_OK)
