from django.urls import path
from api.views.verify_otp import verify_otp

urlpatterns = [
    path('verify_otp/', verify_otp, name='verify_otp'),
]
