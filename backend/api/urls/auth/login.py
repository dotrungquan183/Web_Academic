from django.urls import path
from api.views.auth.login import login_view 
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('auth/login/', login_view, name='login'),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)