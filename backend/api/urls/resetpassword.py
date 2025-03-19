from django.urls import path
from api.views.resetpassword import resetpassword_view

urlpatterns = [
    path('resetpassword/', resetpassword_view, name='resetpassword'),
]