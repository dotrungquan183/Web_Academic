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
