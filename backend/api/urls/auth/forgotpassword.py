from django.urls import path
from api.views.auth.forgotpassword import forgotpassword_view


urlpatterns = [
    path('auth/forgotpassword/', forgotpassword_view, name='forgotpassword'),
]
