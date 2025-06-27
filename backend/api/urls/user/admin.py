from django.urls import path

from api.views.admin.admin_view import AdminView
from api.views.admin.auto_approve import AdminAutoApproveSettingView
from api.views.admin.admin_reputationlist import AdminReputationListView    
from api.views.admin.admin_reputationpermission import AdminReputationPermissionView
from api.views.admin.admin_user import AdminUserView
from api.views.admin.admin_forum.admin_question.admin_showquestion import AdminShowQuestionView
from api.views.admin.admin_forum.admin_question.admin_showquestion_unanswers import AdminShowUnanswersQuestionView
from api.views.admin.admin_forum.admin_question.admin_askquestion import AdminAskQuestionView
from api.views.admin.admin_forum.admin_question.admin_detailquestion import AdminDetailQuestionView
from api.views.admin.admin_forum.admin_question.admin_ansquestion import AdminAnsQuestionView
from api.views.admin.admin_forum.admin_question.admin_comment import AdminCommentView
from api.views.admin.admin_forum.admin_tag.admin_show_tags import AdminShowTagsView
from api.views.admin.admin_forum.admin_tag.admin_showquestion_tags import AdminShowQuestionByTagView
from api.views.admin.admin_forum.admin_question.admin_relatedquestion import AdminRelatedQuestionView
from api.views.admin.admin_forum.admin_question.admin_hotquestion import AdminHotQuestionView

from api.views.admin.admin_courses.admin_lastestcourses import AdminLastestCoursesView
from api.views.admin.admin_courses.admin_addcourses import AdminAddCoursesView
from api.views.admin.admin_courses.admin_bestcourses import AdminBestCoursesView
from api.views.admin.admin_courses.admin_detailcourses import AdminDetailCoursesView
from api.views.admin.admin_courses.admin_listregistrycourses import AdminListRegistryCoursesView
from api.views.admin.admin_update import AdminUserUpdateView

urlpatterns = [
    path('admin/admin_view/', AdminView.as_view(), name='admin'),
    path('admin/auto_approve/', AdminAutoApproveSettingView.as_view(), name='admin_auto_approve'),
    path('admin/admin_reputationlist/', AdminReputationListView.as_view(), name='admin_reputation_list'),
    path('admin/admin_reputationpermission/', AdminReputationPermissionView.as_view(), name='admin_reputation_permission'),
    path('admin/admin_user/', AdminUserView.as_view(), name='admin_user'),

    path('admin/admin_forum/admin_question/admin_showquestion_unanswers/', AdminShowUnanswersQuestionView.as_view(), name='admin_showquestion_unanswers'),
    path('admin/admin_forum/admin_question/admin_showquestion/', AdminShowQuestionView.as_view(), name='admin_showquestion'),
    path('admin/admin_forum/admin_question/admin_showquestion/<int:question_id>/', AdminShowQuestionView.as_view(), name='admin_showquestion_id'),
    path('admin/admin_forum/admin_question/admin_askquestion/', AdminAskQuestionView.as_view(), name='admin_askquestion'),
    path('admin/admin_forum/admin_question/admin_askquestion/<int:question_id>/', AdminAskQuestionView.as_view(), name='admin_askquestion_id'),
    path('admin/admin_forum/admin_question/admin_detailquestion/', AdminDetailQuestionView.as_view(), name='admin_detailquestion'),
    path('admin/admin_forum/admin_question/admin_detailquestion/<int:question_id>/', AdminDetailQuestionView.as_view(), name='admin_detailquestion_id'),
    path('admin/admin_forum/admin_question/admin_ansquestion/', AdminAnsQuestionView.as_view(), name='admin_ansquestion'),
    path('admin/admin_forum/admin_question/admin_ansquestion/<int:answer_id>/', AdminAnsQuestionView.as_view()),
    path('admin/admin_forum/admin_question/admin_comment/', AdminCommentView.as_view(), name='admin_comment'),
    path('admin/admin_forum/admin_question/admin_comment/<int:comment_id>/', AdminCommentView.as_view(), name='admin_comment'),
    path('admin/admin_forum/admin_tag/admin_show_tags/', AdminShowTagsView.as_view(), name='admin_show_tags'),
    path('admin/admin_forum/admin_tag/admin_showquestion_tags/<int:id>', AdminShowQuestionByTagView.as_view(), name='admin_show_question_by_tags'),
    path("admin/admin_forum/admin_question/<int:question_id>/", AdminAskQuestionView.as_view()),
    path('admin/admin_forum/admin_question/admin_relatedquestion/<int:question_id>/', AdminRelatedQuestionView.as_view(), name='admin_related_questions'),
    path('admin/admin_forum/admin_question/admin_hotquestion/', AdminHotQuestionView.as_view(), name='admin_hot_questions'),


    path('admin/admin_courses/admin_lastestcourses/', AdminLastestCoursesView.as_view(), name='admin_lastestcourses'),
    path('admin/admin_courses/admin_addcourses/', AdminAddCoursesView.as_view(), name='admin_addcourses'),
    path('admin/admin_courses/admin_addcourses/<int:pk>/', AdminAddCoursesView.as_view(), name='admin_editcourses_id'),
    path('admin/admin_courses/admin_bestcourses/', AdminBestCoursesView.as_view(), name='admin_bestcourses'),
    path('admin/admin_courses/admin_detailcourses/', AdminDetailCoursesView.as_view(), name='admin_detailcourses'),
    path('admin/admin_courses/admin_detailcourses/<int:pk>/', AdminDetailCoursesView.as_view(), name='admin_detailcourses_id'),
    path('admin/admin_courses/admin_listregistrycourses/', AdminListRegistryCoursesView.as_view(), name='admin_listregistrycourses'),
    path('admin/admin_courses/admin_listregistrycourses/<int:course_id>/', AdminListRegistryCoursesView.as_view(), name='admin_listregistrycourses_id'),
    path('admin/admin_update/', AdminUserUpdateView.as_view(), name='admin_update'),
]