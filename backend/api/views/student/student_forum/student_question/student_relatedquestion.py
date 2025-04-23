from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import Question, QuestionTagMap


class StudentRelatedQuestionView(APIView):
    def get(self, request, question_id):
        # Lấy tất cả tag_id của câu hỏi hiện tại
        tag_ids = QuestionTagMap.objects.filter(question_id=question_id).values_list('tag_id', flat=True)

        # Lấy tất cả question_id khác có chứa các tag này
        related_question_ids = (
            QuestionTagMap.objects
            .filter(tag_id__in=tag_ids)
            .exclude(question_id=question_id)
            .values_list('question_id', flat=True)
            .distinct()
        )

        # Lấy thông tin các câu hỏi liên quan
        related_questions = Question.objects.filter(id__in=related_question_ids).values('id', 'title')[:10]

        return Response(list(related_questions), status=status.HTTP_200_OK)