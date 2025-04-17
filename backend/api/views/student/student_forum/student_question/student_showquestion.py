from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Prefetch, Sum
from api.models import Question, QuestionTagMap, View, UserInformation
from django.utils import timezone
from django.contrib.auth.models import User
import logging
from datetime import timedelta
from django.db.models import Count

logger = logging.getLogger(__name__)

class StudentShowQuestionView(APIView):
    def get(self, request):
        # Lấy filter từ query params
        time_filter = request.GET.get("time", None)
        bounty_filter = request.GET.get("bounty", None)
        interest_filter = request.GET.get("interest", None)
        quality_filter = request.GET.get("quality", None)

        questions = Question.objects.select_related("user").prefetch_related(
            Prefetch(
                'questiontagmap_set',
                queryset=QuestionTagMap.objects.select_related('tag')
            )
        )

        # --- TIME FILTER ---
        if time_filter == "Week":
            start_date = timezone.now() - timedelta(days=7)
            questions = questions.filter(created_at__gte=start_date)
        elif time_filter == "Month":
            start_date = timezone.now() - timedelta(days=30)
            questions = questions.filter(created_at__gte=start_date)
        # Mặc định: newest -> không lọc thời gian

        # --- BOUNTY FILTER ---
        if bounty_filter == "Bountied":
            questions = questions.filter(bounty_amount__gt=0)

        # --- INTEREST FILTER (ví dụ: nhiều lượt xem) ---
        if interest_filter == "Trending":
            questions = questions.annotate(view_count=Sum('view__view_count')).order_by('-view_count')
        elif interest_filter == "Hot":
            questions = questions.annotate(num_answers=Count('answer')).order_by('-num_answers')
        elif interest_filter == "Frequent":
            questions = questions.order_by('-id')  # giả định câu hỏi mới = hỏi thường xuyên
        elif interest_filter == "Active":
            questions = questions.order_by('-created_at')  # hoặc thêm trường last_active_at nếu có

        # --- QUALITY FILTER ---
        if quality_filter == "Interesting":
            questions = questions.annotate(view_count=Sum('view__view_count')).order_by('-view_count')
        elif quality_filter == "Score":
            questions = questions.annotate(score=Sum('vote__score')).order_by('-score')

        question_list = []

        for question in questions:
            tags = [qt.tag.tag_name for qt in question.questiontagmap_set.all()]
            total_views = View.objects.filter(question_id=question.id).aggregate(
                total_views=Sum('view_count')
            )["total_views"] or 0
            username = question.user.username
            try:
                user_info = UserInformation.objects.get(user=question.user)
                avatar = user_info.avatar
            except UserInformation.DoesNotExist:
                avatar = None

            question_list.append({
                "id": question.id,
                "title": question.title,
                "content": question.content,
                "created_at": question.created_at,
                "bounty_amount": question.bounty_amount,
                "tags": tags,
                "views": total_views,
                "username": username,
                "avatar": avatar,
                "user_id": question.user.id
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
