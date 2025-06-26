from django.urls import re_path
from api.views.student.student_forum.student_question import consumers

websocket_urlpatterns = [
    re_path(r"ws/comments/$", consumers.CommentConsumer.as_asgi()),
]
