from django.urls import path
from api.views.auth.register import register_view


urlpatterns = [
    path('auth/register/', register_view, name='register'),
]
