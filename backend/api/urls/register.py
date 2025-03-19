from django.urls import path
from api.views.register import register_view


urlpatterns = [
    path('register/', register_view, name='register'),
]
