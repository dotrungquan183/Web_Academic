from django.urls import path

from api.views.teacher.teacher_home.teacher_home1 import TeacherHome1View
from api.views.teacher.teacher_home.teacher_home2 import TeacherHome2View
from api.views.teacher.teacher_home.teacher_home3 import TeacherHome3View

from api.views.teacher.teacher_intro import TeacherIntroView
from api.views.teacher.teacher_courses.teacher_lastestcourses import TeacherLastestCoursesView
from api.views.teacher.teacher_courses.teacher_addcourses import TeacherAddCoursesView
from api.views.teacher.teacher_courses.teacher_bestcourses import TeacherBestCoursesView
from api.views.teacher.teacher_courses.teacher_detailcourses import TeacherDetailCoursesView
from api.views.teacher.teacher_docs.teacher_docs import TeacherDocView
from api.views.teacher.teacher_homework.teacher_homework import TeacherHomeworkView
from api.views.teacher.teacher_support.teacher_support import TeacherSupportView
from api.views.teacher.teacher_contact.teacher_contact import TeacherContactView
from api.views.teacher.teacher_forum.teacher_question import TeacherQuestionView
from api.views.teacher.teacher_forum.teacher_unanswer import TeacherUnanswerView
from api.views.teacher.teacher_forum.teacher_tag import TeacherTagView
from api.views.teacher.teacher_forum.teacher_save import TeacherSaveView
from api.views.teacher.teacher_profile.teacher_question import TeacherProfileQuestionView
from api.views.teacher.teacher_profile.teacher_answer import TeacherProfileAnswerView
from api.views.teacher.teacher_profile.teacher_tag import TeacherProfileTagView
from api.views.teacher.teacher_profile.teacher_stat import TeacherProfileStatView
from api.views.teacher.teacher_profile.teacher_vote import TeacherProfileVoteView
from api.views.teacher.teacher_profile.teacher_account import TeacherProfileAccountView
from api.views.teacher.teacher_insight.teacher_insight_forum import TeacherInsightDataView
from api.views.teacher.teacher_courses.teacher_listregistrycourses import TeacherListRegistryCoursesView
from api.views.auth.login import login_view
from api.views.auth.forgotpassword import forgotpassword_view
from api.views.auth.register import register_view
urlpatterns = [
    path("auth/login/", login_view, name="login"),
    path("auth/forgotpassword/", forgotpassword_view, name="forgotpassword"),
    path("auth/register/", register_view, name="register"),
    path('teacher/teacher_home/teacher_home1/', TeacherHome1View.as_view(), name='teacher_home1'),
    path('teacher/teacher_home/teacher_home2/', TeacherHome2View.as_view(), name='teacher_home2'),
    path('teacher/teacher_home/teacher_home3/', TeacherHome3View.as_view(), name='teacher_home3'),
    path('teacher/teacher_intro/', TeacherIntroView.as_view(), name='teacher_intro'),
    path('teacher/teacher_courses/teacher_lastestcourses/', TeacherLastestCoursesView.as_view(), name='teacher_lastestcourses'),
    path('teacher/teacher_courses/teacher_addcourses/', TeacherAddCoursesView.as_view(), name='teacher_addcourses'),
    path('teacher/teacher_courses/teacher_addcourses/<int:pk>/', TeacherAddCoursesView.as_view(), name='teacher_editcourses_id'),
    path('teacher/teacher_courses/teacher_bestcourses/', TeacherBestCoursesView.as_view(), name='teacher_bestcourses'),
    path('teacher/teacher_courses/teacher_detailcourses/', TeacherDetailCoursesView.as_view(), name='teacher_detailcourses'),
    path('teacher/teacher_courses/teacher_detailcourses/<int:pk>/', TeacherDetailCoursesView.as_view(), name='teacher_detailcourses_id'),
    path('teacher/teacher_courses/teacher_listregistrycourses/', TeacherListRegistryCoursesView.as_view(), name='teacher_listregistrycourses'),
    path('teacher/teacher_courses/teacher_listregistrycourses/<int:course_id>/', TeacherListRegistryCoursesView.as_view(), name='teacher_listregistrycourses_id'),
    path('teacher/teacher_docs/teacher_docs/', TeacherDocView.as_view(), name='teacher_docs'),
    path('teacher/teacher_homework/teacher_homework/', TeacherHomeworkView.as_view(), name='teacher_homework'),
    path('teacher/teacher_contact/teacher_contact/', TeacherContactView.as_view(), name='teacher_contact'),
    path('teacher/teacher_forum/teacher_question/', TeacherQuestionView.as_view(), name='teacher_question'),
    path('teacher/teacher_forum/teacher_unanswer/', TeacherUnanswerView.as_view(), name='teacher_unanswer'),
    path('teacher/teacher_forum/teacher_tag/', TeacherTagView.as_view(), name='teacher_tag'),
    path('teacher/teacher_forum/teacher_save/', TeacherSaveView.as_view(), name='teacher_save'),
    path('teacher/teacher_support/teacher_support/', TeacherSupportView.as_view(), name='teacher_support'),
    path('teacher/teacher_profile/teacher_question/', TeacherProfileQuestionView.as_view(), name='teacher_profile_question'),
    path('teacher/teacher_profile/teacher_answer/', TeacherProfileAnswerView.as_view(), name='teacher_profile_answer'),
    path('teacher/teacher_profile/teacher_tag/', TeacherProfileTagView.as_view(), name='teacher_profile_tag'),
    path('teacher/teacher_profile/teacher_stat/', TeacherProfileStatView.as_view(), name='teacher_profile_stat'),
    path('teacher/teacher_profile/teacher_vote/', TeacherProfileVoteView.as_view(), name='teacher_profile_vote'),
    path('teacher/teacher_profile/teacher_account/', TeacherProfileAccountView.as_view(), name='teacher_profile_account'),
    path('teacher/teacher_insight/teacher_insight_forum/', TeacherInsightDataView.as_view(), name='teacher_insight'),
]

