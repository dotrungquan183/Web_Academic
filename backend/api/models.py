from django.db import models
from django.contrib.auth.models import User
from datetime import timedelta
import datetime

from django.db import models
from datetime import timedelta

from django.db import models
from django.contrib.auth.models import User
from datetime import timedelta

class Course(models.Model):
    LEVEL_CHOICES = [
        ('basic', 'Dễ'),
        ('medium', 'Trung bình'),
        ('hard', 'Khó'),
    ]

    title = models.CharField(max_length=255, verbose_name="Tên khóa học")
    student_count = models.PositiveIntegerField(default=0, verbose_name="Số người học")
    fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Lệ phí")
    video_count = models.PositiveIntegerField(default=0, verbose_name="Số video")
    total_duration = models.DurationField(default=timedelta(), verbose_name="Tổng thời lượng")
    level = models.CharField(max_length=30, choices=LEVEL_CHOICES, default='basic', verbose_name="Trình độ")
    intro_video = models.FileField(upload_to='intro_videos/', null=True, blank=True, verbose_name="Video giới thiệu")
    thumbnail = models.ImageField(upload_to='course_thumbnails/', null=True, blank=True, verbose_name="Ảnh khóa học")
    tags = models.CharField(max_length=255, blank=True, verbose_name="Thẻ (tags)")
    # 🆕 Thêm dòng này:
    qr_code = models.FileField(upload_to='qr_codes/', null=True, blank=True, verbose_name="Mã QR")
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, verbose_name="Người dùng")
    intro = models.TextField(blank=True, verbose_name="Giới thiệu khóa học")  # Trường intro chứa đoạn văn giới thiệu

    class Meta:
        db_table = 'course'

    def __str__(self):
        return self.title


class Chapter(models.Model):
    course = models.ForeignKey(Course, related_name="chapters", on_delete=models.CASCADE)
    title = models.CharField(max_length=255, verbose_name="Tên chương")
    lesson_count = models.PositiveIntegerField(default=0, verbose_name="Số bài học")

    class Meta:
        db_table = 'chapter'

    def __str__(self):
        return self.title


# models.py

class Lesson(models.Model):
    chapter = models.ForeignKey('Chapter', related_name="lessons", on_delete=models.CASCADE)
    title = models.CharField(max_length=255, verbose_name="Tên bài học")
    video = models.FileField(upload_to='lesson_videos/', null=True, blank=True, verbose_name="Video bài học")  # 👈 Đổi URLField -> FileField
    duration = models.DurationField(verbose_name="Thời lượng")
    document_link = models.FileField(upload_to='lesson_documents/', null=True, blank=True, verbose_name="Tài liệu bài học")  # 👈 Thêm FileField cho tài liệu
    exercise = models.OneToOneField('Exercise', null=True, blank=True, on_delete=models.SET_NULL, verbose_name="Bài tập")

    class Meta:
        db_table = 'lesson'

    def __str__(self):
        return self.title


class Exercise(models.Model):
    total_questions = models.PositiveIntegerField(default=0, verbose_name="Tổng số câu hỏi")

    class Meta:
        db_table = 'exercise'

    def __str__(self):
        return f"Bài tập #{self.id}"


class MultipleChoiceQuestion(models.Model):
    exercise = models.ForeignKey(Exercise, related_name="questions", on_delete=models.CASCADE)
    content = models.TextField(verbose_name="Nội dung")
    choices = models.JSONField(verbose_name="Các đáp án")  # Ví dụ: {"A": "Đáp án A", "B": "Đáp án B", ...}
    correct_answer = models.CharField(max_length=1, verbose_name="Đáp án đúng")  # Ví dụ: "A"
    score = models.DecimalField(max_digits=5, decimal_places=2, default=1.0, verbose_name="Điểm")

    class Meta:
        db_table = 'multiple_choice_question'

    def __str__(self):
        return self.content

class OTP(models.Model):
    user = models.ForeignKey("UserInformation", on_delete=models.CASCADE)
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        return (datetime.datetime.now(datetime.timezone.utc) - self.created_at).seconds < 300

class UserInformation(models.Model):  
    user = models.OneToOneField(User, on_delete=models.CASCADE, db_column="user_id", primary_key=True)
    full_name = models.CharField(max_length=255)
    #username = models.CharField(max_length=255, unique=True, null=False, blank=False)  # Bắt buộc, không trùng
    #password = models.CharField(max_length=255, null=False, blank=False)  # Bắt buộc nhập
    #email = models.CharField(max_length=255, unique=True)  # Bắt buộc, không trùng
    phone = models.CharField(max_length=20, null=True, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=[("Nam", "Nam"), ("Nữ", "Nữ")])
    user_type = models.CharField(max_length=50)
    address = models.TextField(max_length=255, null=True, blank=True)
    avatar = models.CharField(max_length=255, null=True, blank=True)
    class Meta:
        db_table = "user_info"

    def __str__(self):
        return self.full_name

class Question(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    accepted_answer_id = models.IntegerField(null=True, blank=True)
    bounty_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'questions'  # Đặt tên bảng là 'questions'

class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    user = models.ForeignKey(UserInformation, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Answer {self.id} for Question {self.question_id}"

    class Meta:
        db_table = 'answers'  # Đặt tên bảng là 'answers'

class QuestionTag(models.Model):
    tag_name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.tag_name

    class Meta:
        db_table = 'question_tags'  # Đặt tên bảng là 'question_tags'

class QuestionTagMap(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    tag = models.ForeignKey(QuestionTag, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('question', 'tag')
        db_table = 'question_tag_map'  # Đặt tên bảng là 'question_tag_map'

class Vote(models.Model):
    VOTE_TYPE_CHOICES = [
        ('like', 'Like'),
        ('dislike', 'Dislike'),
    ]

    CONTENT_TYPE_CHOICES = [
        ('question', 'Question'),
        ('answer', 'Answer'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    vote_type = models.CharField(max_length=10, choices=VOTE_TYPE_CHOICES, null=True, blank=True)
    vote_for = models.CharField(max_length=10, choices=CONTENT_TYPE_CHOICES)
    content_id = models.BigIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'vote_for', 'content_id')
        db_table = 'votes'

    def __str__(self):
        return f"{self.user.username} - {self.vote_for} ({self.vote_type})"

    @classmethod
    def toggle_vote(cls, user, vote_for, content_id, vote_type):
        # Lấy hoặc tạo một vote mới cho user, vote_for, content_id
        vote, created = cls.objects.get_or_create(
            user=user,
            vote_for=vote_for,
            content_id=content_id,
        )

        if created:
            # Nếu vote chưa tồn tại, tạo mới và lưu vote_type
            vote.vote_type = vote_type
            vote.save()
            cls.update_vote_count(vote_for, content_id)  # Cập nhật số lượng vote
            return vote_type  # Trả về vote_type để frontend biết hành động thích/ghét

        else:
            if vote.vote_type == vote_type:
                # Nếu vote_type không thay đổi (ví dụ từ like sang like), thì xóa bản ghi cũ
                vote.delete()
                cls.update_vote_count(vote_for, content_id)  # Cập nhật số lượng vote
                return 'remove'  # Trả về 'remove' khi xóa

            else:
                # Nếu vote_type thay đổi (like <-> dislike), cập nhật vote
                vote.vote_type = vote_type
                vote.save()
                cls.update_vote_count(vote_for, content_id)  # Cập nhật số lượng vote
                return vote_type  # Trả về vote_type mới (like hoặc dislike)

    @classmethod
    def update_vote_count(cls, vote_for, content_id):
        # Cập nhật số lượng like/dislike cho câu hỏi hoặc câu trả lời
        likes = cls.objects.filter(vote_for=vote_for, content_id=content_id, vote_type='like').count()
        dislikes = cls.objects.filter(vote_for=vote_for, content_id=content_id, vote_type='dislike').count()

        # Bạn có thể lưu số lượng này vào bảng câu hỏi hoặc câu trả lời nếu cần
        # Ví dụ: Cập nhật tổng số vote vào bảng `Question` hoặc `Answer` nếu cần
        # Question.objects.filter(id=content_id).update(likes=likes, dislikes=dislikes)
        
        # Hoặc bạn có thể trả về số lượng để hiển thị trực tiếp trên frontend
        return likes, dislikes

class View(models.Model):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    view_date = models.DateField(default=datetime.date.today)
    view_count = models.IntegerField(default=1)

    class Meta:
        unique_together = ('user', 'question', 'view_date')
        db_table = 'views'  # Đặt tên bảng là 'views'

class Comment(models.Model):
    TYPE_CHOICES = (
        ('question', 'Question'),
        ('answer', 'Answer'),
    )

    type_comment = models.CharField(max_length=10, choices=TYPE_CHOICES)
    content_id = models.IntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.type_comment} - {self.content[:30]}"

    class Meta:
        db_table = 'comments'