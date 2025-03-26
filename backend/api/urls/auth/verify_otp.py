from django.urls import path
from api.views.auth.verify_otp import verify_otp

urlpatterns = [
    path('auth/verify_otp/', verify_otp, name='verify_otp'),
]
