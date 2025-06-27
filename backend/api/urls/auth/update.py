from django.urls import path
from api.views.auth.update import AdminUserUpdateView

urlpatterns = [
    path('auth/update/', AdminUserUpdateView.as_view, name='update'),
]