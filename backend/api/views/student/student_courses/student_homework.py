from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from api.views.auth.authHelper import get_authenticated_user
from api.models import (
    Homework, HomeworkQuestion, HomeworkChoice,
    HomeworkSubmission, HomeworkSubmissionAnswer,
    LessonVideoView, UserInformation
)
from django.db import transaction
from decimal import Decimal, ROUND_HALF_UP
from django.utils import timezone
from datetime import timedelta


class StudentSubmitHomeworkView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        data = request.data
        homework_id = data.get("homework_id")
        answers = data.get("answers")  # { "question_id": [choice_id, ...] }

        if not homework_id or not answers:
            return Response({"detail": "Thiếu dữ liệu."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            homework = Homework.objects.select_related("lesson").get(id=homework_id)
        except Homework.DoesNotExist:
            return Response({"detail": "Bài tập không tồn tại."}, status=status.HTTP_404_NOT_FOUND)

        with transaction.atomic():
            # Tạo bài nộp
            submission = HomeworkSubmission.objects.create(student=user, homework=homework)
            correct_count = 0
            total_questions = 0

            for question_id_str, selected_ids in answers.items():
                try:
                    question_id = int(question_id_str)
                    question = HomeworkQuestion.objects.get(id=question_id, homework=homework)
                except (ValueError, HomeworkQuestion.DoesNotExist):
                    continue

                total_questions += 1

                # Đảm bảo selected_ids là list
                if not isinstance(selected_ids, list):
                    selected_ids = [selected_ids]

                # Lưu từng đáp án
                for choice_id in selected_ids:
                    try:
                        selected_choice = HomeworkChoice.objects.get(id=choice_id, question=question)
                        HomeworkSubmissionAnswer.objects.create(
                            submission=submission,
                            question=question,
                            selected_choice=selected_choice
                        )
                    except HomeworkChoice.DoesNotExist:
                        continue

                # Tính đúng nếu chọn đủ và không dư
                correct_choices = set(
                    HomeworkChoice.objects.filter(question=question, is_correct=True).values_list("id", flat=True)
                )
                if set(selected_ids) == correct_choices:
                    correct_count += 1

            # Tính điểm
            if total_questions == 0:
                score = Decimal("0.00")
            else:
                raw_score = (Decimal(correct_count) / Decimal(total_questions)) * Decimal(10)
                score = raw_score.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

            submission.score = score
            submission.save()

            # Trừ điểm uy tín nếu cần
            try:
                user_info = UserInformation.objects.get(user=user)
            except UserInformation.DoesNotExist:
                user_info = None

            now = timezone.now()

            # Trừ nếu làm muộn hơn 1 giờ sau khi xem video
            if user_info:
                last_view = LessonVideoView.objects.filter(user=user, lesson=homework.lesson).order_by("-view_at").first()

                if last_view:
                    time_diff = now - last_view.view_at
                    if time_diff > timedelta(minutes=60):
                        user_info.reputation = max(0, user_info.reputation - 3)
                        user_info.save()
                        late_penalty = True
                    else:
                        late_penalty = False
                else:
                    late_penalty = False

                # Trừ nếu điểm thấp
                if score < 5:
                    user_info.reputation = max(0, user_info.reputation - 2)
                    user_info.save()
                    low_score_penalty = True
                else:
                    low_score_penalty = False
            else:
                late_penalty = False
                low_score_penalty = False

        return Response({
            "detail": "Nộp bài thành công",
            "score": float(score),
            "correct_questions": correct_count,
            "total_questions": total_questions,
            "late_penalty": late_penalty,
            "low_score_penalty": low_score_penalty
        }, status=status.HTTP_200_OK)


    def get(self, request):
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        submissions = HomeworkSubmission.objects.filter(student=user).select_related('homework__lesson')

        result = []
        for sub in submissions:
            result.append({
                "lesson_id": sub.homework.lesson.id,
                "homework_id": sub.homework.id,
                "student_id": sub.student.id,
                "score": sub.score,
                "submitted_at": sub.submitted_at,
            })

        return Response(result, status=status.HTTP_200_OK)
