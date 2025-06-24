from rest_framework import serializers
from .models import Course, Question,  Chapter, Lesson, LessonVideoView, Reputation,ReputationPermission
import datetime
class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ["id", "title", "content"]

class LessonSerializer(serializers.ModelSerializer):
    formatted_duration = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = '__all__'  # Bao gồm tất cả các trường trong model

    def get_formatted_duration(self, obj):
        total_seconds = int(obj.duration.total_seconds())
        return str(datetime.timedelta(seconds=total_seconds))

class ChapterSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Chapter
        fields = '__all__' 

class CourseListSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    teacher = serializers.SerializerMethodField()
    students = serializers.IntegerField(source='student_count', default=0)
    thumbnail = serializers.ImageField()

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'fee', 'teacher', 'students',
            'total_duration', 'type', 'video_count', 'thumbnail', 'created_at'
        ]

    def get_type(self, obj):
        return "pro" if round(float(obj.fee), 2) > 0 else "free"

    def get_teacher(self, obj):
        return obj.user.username if obj.user and hasattr(obj.user, 'username') else "Unknown"

class CourseSerializer(serializers.ModelSerializer):
    teacher = serializers.SerializerMethodField()
    chapters = ChapterSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = '__all__'  # Gồm tất cả các trường: title, fee, video_count, user, v.v.

    def get_teacher(self, obj):
        return obj.user.username if obj.user and hasattr(obj.user, 'username') else "Unknown"

class LessonVideoViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonVideoView
        fields = ['lesson', 'user']

class ReputationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reputation
        fields = ['rule_key', 'description', 'point_change']

class ReputationPermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReputationPermission
        fields = [
            "id",
            "action_key",
            "description",
            "min_reputation",
        ]
        read_only_fields = ["user_id_last_update"]