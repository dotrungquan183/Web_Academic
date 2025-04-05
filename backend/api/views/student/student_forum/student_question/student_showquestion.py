from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Prefetch, Sum
from api.models import Question, QuestionTagMap, View
from django.utils import timezone
from django.contrib.auth.models import User
import logging

logger = logging.getLogger(__name__)

class StudentShowQuestionView(APIView):
    def get(self, request):
        # Lấy danh sách câu hỏi
        questions = Question.objects.prefetch_related(
            Prefetch(
                'questiontagmap_set',
                queryset=QuestionTagMap.objects.select_related('tag')
            )
        ).values("id", "title", "content", "created_at")

        question_list = []

        for question in questions:
            # Lấy tags
            tags = QuestionTagMap.objects.filter(question_id=question["id"]).select_related('tag')
            tag_names = [tag.tag.tag_name for tag in tags]

            # Tính tổng số lượt xem
            total_views = View.objects.filter(question_id=question["id"]).aggregate(
                total_views=Sum('view_count')
            )["total_views"] or 0

            question_list.append({
                "id": question["id"],
                "title": question["title"],
                "content": question["content"],
                "created_at": question["created_at"],
                "tags": tag_names,
                "views": total_views,  # ✅ thêm vào đây
            })

        return Response(question_list, status=status.HTTP_200_OK)

    def post(self, request):
        question_id = request.data.get("question_id")
        user_id = request.data.get("user_id")

        if not question_id:
            return Response({"error": "Thiếu question_id"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            question = Question.objects.get(pk=question_id)
        except Question.DoesNotExist:
            return Response({"error": "Không tìm thấy câu hỏi"}, status=status.HTTP_404_NOT_FOUND)

        user = None
        if user_id is not None:
            try:
                user = User.objects.get(pk=user_id)
            except User.DoesNotExist:
                return Response({"error": "Không tìm thấy người dùng"}, status=status.HTTP_404_NOT_FOUND)

        today = timezone.now().date()

        # Ghi nhận lượt xem
        view, created = View.objects.get_or_create(
            user=user,
            question=question,
            view_date=today,
            defaults={'view_count': 1}
        )

        if not created:
            view.view_count += 1
            view.save()

        return Response({"message": "Đã ghi nhận lượt xem"}, status=status.HTTP_200_OK)
