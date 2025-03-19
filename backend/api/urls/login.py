from django.urls import path
from api.views.login import login_view 


urlpatterns = [
    path('login/', login_view, name='login'),
]
