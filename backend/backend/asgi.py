import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import api.views.student.student_forum.student_question.routing 

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

application = ProtocolTypeRouter({
    # 👇 Xử lý HTTP như cũ
    "http": get_asgi_application(),

    # 👇 Xử lý WebSocket bằng Auth + URLRouter
    "websocket": AuthMiddlewareStack(
        URLRouter(
            api.views.student.student_forum.student_question.routing.websocket_urlpatterns
        )
    ),
})

