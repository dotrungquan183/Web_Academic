from rest_framework import serializers
from .models import Course, Question,  Chapter, Lesson
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
    lessons = LessonSerializer(many=True)
    class Meta:
        model = Chapter
        fields = ['id', 'title', 'lessons']

class CourseListSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    teacher = serializers.SerializerMethodField()
    students = serializers.IntegerField(source='student_count', default=0)

    class Meta:
        model = Course
        fields = ['id', 'title', 'fee', 'teacher', 'students', 'total_duration', 'type']

    def get_type(self, obj):
        # Sử dụng round để làm tròn giá trị fee nếu cần
        if round(float(obj.fee), 2) > 0:
            return "pro"
        return "free"

    def get_teacher(self, obj):
        if obj.user and hasattr(obj.user, 'username'):
            return obj.user.username
        return "Unknown"