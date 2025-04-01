from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Prefetch
from api.models import Question, QuestionTagMap, QuestionTag

class StudentShowQuestionView(APIView):
    def get(self, request):
        # Lấy danh sách câu hỏi cùng với thông tin tag_name
        questions = Question.objects.prefetch_related(
            Prefetch(
                'questiontagmap_set',
                queryset=QuestionTagMap.objects.select_related('tag')
            )
        ).values("id", "title", "content", "created_at")

        # Tạo danh sách kết quả với tag của mỗi câu hỏi
        question_list = []
        for question in questions:
            tags = QuestionTagMap.objects.filter(question_id=question["id"]).select_related('tag')
            tag_names = [tag.tag.tag_name for tag in tags]  # Lấy danh sách tag_name
            
            question_list.append({
                "id": question["id"],
                "title": question["title"],
                "content": question["content"],
                "created_at": question["created_at"],
                "tags": tag_names  # Gán danh sách tag vào câu hỏi
            })

        return Response(question_list, status=status.HTTP_200_OK)


