from django.urls import path
from api.views.auth.resetpassword import resetpassword_view

urlpatterns = [
    path('auth/resetpassword/', resetpassword_view, name='resetpassword'),
]