import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.db import models  # Thêm import models ở đây
from api.models import View, Question
from django.contrib.auth.models import User  # hoặc model Student nếu khác

# Thiết lập logger để in thông tin
logger = logging.getLogger(__name__)

class StudentViewQuestionView(APIView):
    def post(self, request):
        question_id = request.data.get("question_id")
        user_id = request.data.get("user_id")  # có thể là None nếu chưa đăng nhập

        if not question_id:
            logger.error("Thiếu question_id trong yêu cầu")
            return Response({"error": "Thiếu question_id"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            question = Question.objects.get(pk=question_id)
        except Question.DoesNotExist:
            logger.error(f"Câu hỏi với id {question_id} không tồn tại.")
            return Response({"error": "Không tìm thấy câu hỏi"}, status=status.HTTP_404_NOT_FOUND)

        user = None
        if user_id is not None:
            try:
                user = User.objects.get(pk=user_id)
            except User.DoesNotExist:
                logger.error(f"Người dùng với id {user_id} không tồn tại.")
                return Response({"error": "Không tìm thấy người dùng"}, status=status.HTTP_404_NOT_FOUND)

        today = timezone.now().date()

        # Kiểm tra xem bản ghi đã tồn tại hay chưa, nếu có thì cập nhật view_count
        view, created = View.objects.get_or_create(
            user=user,
            question=question,
            view_date=today,
            defaults={'view_count': 1}
        )

        if not created:
            view.view_count += 1
            view.save()

        # Tính tổng số lượt xem của câu hỏi, sử dụng django.db.models.Sum
        total_views = View.objects.filter(question=question).aggregate(total_views=models.Sum('view_count'))['total_views'] or 0

        # Trả về dữ liệu câu hỏi cùng với tổng số lượt xem
        question_data = {
            "id": question.id,
            "title": question.title,
            "content": question.content,
            "created_at": question.created_at,
            "views": total_views,  # Lượt xem tổng cộng
        }

        logger.info(f"Cập nhật lượt xem cho câu hỏi ID {question.id}, tổng lượt xem: {total_views}")
        
        return Response({"message": "Đã cập nhật lượt xem", "question": question_data}, status=status.HTTP_200_OK)
