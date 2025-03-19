from django.urls import path
from api.views.forgotpassword import forgotpassword_view


urlpatterns = [
    path('forgotpassword/', forgotpassword_view, name='forgotpassword'),
]
