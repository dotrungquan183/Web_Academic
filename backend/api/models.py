from django.db import models
from django.contrib.auth.models import User
import datetime

class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.title 

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
    vote_type = models.CharField(max_length=10, choices=VOTE_TYPE_CHOICES, null=True)
    vote_for = models.CharField(max_length=10, choices=CONTENT_TYPE_CHOICES)  # Xác định loại nội dung được vote
    content_id = models.BigIntegerField()  # Lưu ID của câu hỏi hoặc câu trả lời
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'vote_for', 'content_id')  # Mỗi người chỉ vote 1 lần cho cùng 1 nội dung
        db_table = 'votes'  # Đặt tên bảng trong database

class View(models.Model):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    view_date = models.DateField(default=datetime.date.today)
    view_count = models.IntegerField(default=1)

    class Meta:
        unique_together = ('user', 'question', 'view_date')
        db_table = 'views'  # Đặt tên bảng là 'views'