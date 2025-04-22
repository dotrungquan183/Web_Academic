from rest_framework import serializers
from .models import Course, Question,  Chapter, Lesson

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ["id", "title", "content"]

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'duration', 'video']

class ChapterSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True)
    class Meta:
        model = Chapter
        fields = ['id', 'title', 'lessons']

class CourseSerializer(serializers.ModelSerializer):
    chapters = ChapterSerializer(many=True)
    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'total_duration', 'chapters']