from django.urls import path

from api.views.admin.admin_view import AdminView


urlpatterns = [
    path('admin/admin_view/', AdminView.as_view(), name='admin'),
]