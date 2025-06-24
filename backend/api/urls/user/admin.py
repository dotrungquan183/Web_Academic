from django.urls import path

from api.views.admin.admin_view import AdminView
from api.views.admin.auto_approve import AdminAutoApproveSettingView
from api.views.admin.admin_reputationlist import AdminReputationListView    
urlpatterns = [
    path('admin/admin_view/', AdminView.as_view(), name='admin'),
    path('admin/auto_approve/', AdminAutoApproveSettingView.as_view(), name='admin_auto_approve'),
    path('admin/admin_reputationlist/', AdminReputationListView.as_view(), name='admin_reputation_list'),
]