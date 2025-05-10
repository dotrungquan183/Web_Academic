from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum, IntegerField, Case, When, Value, OuterRef, Subquery
from django.db.models.functions import Coalesce

from api.models import Question, Vote, QuestionTag, QuestionTagMap
from api.views.auth.authHelper import get_authenticated_user


class TeacherProfileTagView(APIView):
    def get(self, request):
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        filter_option = request.GET.get('filter', '').lower()

        # Lấy tất cả câu hỏi của user
        user_questions = Question.objects.filter(user_id=user.id)

        # Lấy tất cả các tag liên quan đến các question của user
        tag_ids = QuestionTagMap.objects.filter(
            question__in=user_questions
        ).values_list('tag_id', flat=True).distinct()

        # Tính total_vote_score cho từng tag của user
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

        # Annotate vote_score cho các câu hỏi của user
        user_questions_with_vote = user_questions.annotate(
            vote_score=Coalesce(Subquery(vote_score_subquery, output_field=IntegerField()), 0)
        )

        # Tính tổng điểm cho mỗi tag
        tag_vote_dict = {}
        mappings = QuestionTagMap.objects.filter(question__in=user_questions_with_vote)

        for mapping in mappings:
            tag_id = mapping.tag.id
            tag_name = mapping.tag.tag_name
            vote = user_questions_with_vote.get(id=mapping.question.id).vote_score

            if tag_id not in tag_vote_dict:
                tag_vote_dict[tag_id] = {
                    "tag_id": tag_id,
                    "tag_name": tag_name,
                    "total_vote_score": 0
                }

            tag_vote_dict[tag_id]["total_vote_score"] += vote

        # Nếu filter là 'all', trả về tất cả các tag của user
        if filter_option == 'all':
            tags = list(tag_vote_dict.values())
            return Response(tags, status=status.HTTP_200_OK)

        # Nếu filter không phải 'all', lấy top 5 tag có tổng điểm cao nhất
        top_tags = sorted(tag_vote_dict.values(), key=lambda x: x["total_vote_score"], reverse=True)[:5]

        return Response(top_tags, status=status.HTTP_200_OK)


