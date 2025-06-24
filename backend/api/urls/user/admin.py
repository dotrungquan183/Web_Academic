from django.urls import path

from api.views.admin.admin_view import AdminView
from api.views.admin.auto_approve import AdminAutoApproveSettingView
from api.views.admin.admin_reputationlist import AdminReputationListView    
from api.views.admin.admin_reputationpermission import AdminReputationPermissionView
from api.views.admin.admin_user import AdminUserView
urlpatterns = [
    path('admin/admin_view/', AdminView.as_view(), name='admin'),
    path('admin/auto_approve/', AdminAutoApproveSettingView.as_view(), name='admin_auto_approve'),
    path('admin/admin_reputationlist/', AdminReputationListView.as_view(), name='admin_reputation_list'),
    path('admin/admin_reputationpermission/', AdminReputationPermissionView.as_view(), name='admin_reputation_permission'),
    path('admin/admin_user/', AdminUserView.as_view(), name='admin_user'),
]