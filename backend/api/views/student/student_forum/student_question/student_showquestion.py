from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Prefetch, Sum
from api.models import Question, QuestionTagMap, View, UserInformation, Vote, Answer, Comment
from django.utils import timezone
from django.contrib.auth.models import User
from api.views.auth.authHelper import get_authenticated_user
import logging
from datetime import timedelta
from django.db.models import Count, Sum, F, Q, Prefetch
from django.db.models import OuterRef, Exists



logger = logging.getLogger(__name__)


class StudentShowQuestionView(APIView):
    def get(self, request):
         # 🔍 Log URL đầy đủ (bao gồm query string)
        print("🟡 Full URL:", request.build_absolute_uri())

        # ✅ In query params
        print("🟣 Query Params:", request.GET.dict())

        # ✅ Đọc tham số unanswered
        unanswered = request.GET.get("unanswered", "false") == "true"
        
        # ✅ Lấy tất cả câu hỏi
        questions = Question.objects.all()

        # ✅ Lọc những câu hỏi chưa có câu trả lời (nếu được yêu cầu)
        if unanswered:
            questions = questions.annotate(
                has_answer=Exists(Answer.objects.filter(question=OuterRef('pk')))
            ).filter(has_answer=False)

        print("✅ Đang lọc unanswered, số lượng:", questions.count())

        
        time_filter = request.GET.get("time")
        bounty_filter = request.GET.get("bounty")
        interest_filter = request.GET.get("interest")
        quality_filter = request.GET.get("quality")

        now = timezone.now()

        questions = questions.select_related("user").prefetch_related(
            Prefetch(
                'questiontagmap_set',
                queryset=QuestionTagMap.objects.select_related('tag')
            )
        )

        # TIME FILTER
        if time_filter == "Newest":
            questions = questions.filter(created_at__gte=now - timedelta(hours=24))
        elif time_filter == "Week":
            questions = questions.filter(created_at__gte=now - timedelta(days=7))
        elif time_filter == "Month":
            questions = questions.filter(created_at__gte=now - timedelta(days=30))

        # BOUNTY FILTER
        if bounty_filter == "Bountied":
            questions = questions.filter(bounty_amount__gt=0)

        # INTEREST FILTER
        recent_period = now - timedelta(days=3)
        if interest_filter == "Trending":
            questions = questions.annotate(
                recent_views=Sum('view__view_count', filter=Q(view__viewed_at__gte=recent_period))
            ).order_by('-recent_views')
        elif interest_filter == "Hot":
            questions = questions.annotate(
                hotness=Count('answer', filter=Q(answer__created_at__gte=recent_period)) +
                        Sum('vote__score', filter=Q(vote__created_at__gte=recent_period))
            ).order_by('-hotness')
        elif interest_filter == "Frequent":
            questions = questions.annotate(freq=Count('title')).order_by('-freq')
        elif interest_filter == "Active":
            questions = questions.order_by('-updated_at')

        # QUALITY FILTER
        if quality_filter == "Interesting":
            questions = questions.annotate(
                quality_score=F('view__view_count') + F('vote__score')
            ).order_by('-quality_score')
        elif quality_filter == "Score":
            questions = questions.annotate(score=Sum('vote__score')).order_by('-score')

        # Convert thành list
        question_list = []
        for question in questions:
            tags = [qt.tag.tag_name for qt in question.questiontagmap_set.all()]
            total_views = View.objects.filter(question_id=question.id).aggregate(
                total_views=Sum('view_count')
            )["total_views"] or 0

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
                "username": question.user.username,
                "avatar": avatar,
                "user_id": question.user.id
            })

        return Response(question_list)
   
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

    def delete(self, request, question_id, *args, **kwargs):
        # Lấy thông tin người dùng đã xác thực
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response  # Trả về phản hồi lỗi nếu có

        try:
            # Tìm câu hỏi theo question_id
            question = Question.objects.get(id=question_id)

            # Kiểm tra quyền sở hữu câu hỏi
            if question.user.id != user.id:  # So sánh ID người dùng
                return Response({"error": "Bạn không có quyền xoá câu hỏi này!"}, status=status.HTTP_403_FORBIDDEN)

            # Bắt đầu xóa các dữ liệu liên quan
            # Xóa tất cả các lượt bình chọn (votes) liên quan đến câu hỏi
            Vote.objects.filter(vote_for='question', content_id=question_id).delete()

            # Xóa tất cả các lượt xem (views) liên quan đến câu hỏi
            View.objects.filter(question=question).delete()

            # Xóa tất cả các bình luận (comments) liên quan đến câu hỏi
            Comment.objects.filter(type_comment='question', content_id=question_id).delete()

            # Xóa các thẻ (tags) liên quan đến câu hỏi
            QuestionTagMap.objects.filter(question=question).delete()

            # Xóa tất cả các câu trả lời (answers) liên quan đến câu hỏi
            Answer.objects.filter(question=question).delete()

            # Xóa câu hỏi
            question.delete()

            return Response({"message": "Đã xoá câu hỏi và tất cả các liên quan thành công!"}, status=status.HTTP_200_OK)

        except Question.DoesNotExist:
            return Response({"error": "Câu hỏi không tồn tại."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            # Nếu có lỗi bất thường nào khác
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)