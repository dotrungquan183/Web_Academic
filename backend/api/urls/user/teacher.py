from django.urls import path

from api.views.teacher.teacher_home.teacher_home1 import TeacherHome1View
from api.views.teacher.teacher_home.teacher_home2 import TeacherHome2View
from api.views.teacher.teacher_home.teacher_home3 import TeacherHome3View

from api.views.teacher.teacher_intro import TeacherIntroView
from api.views.teacher.teacher_courses.teacher_courses import TeacherCoursesView
from api.views.teacher.teacher_docs.teacher_docs import TeacherDocView
from api.views.teacher.teacher_homework.teacher_homework import TeacherHomeworkView
from api.views.teacher.teacher_support.teacher_support import TeacherSupportView
from api.views.teacher.teacher_contact.teacher_contact import TeacherContactView
from api.views.teacher.teacher_forum.teacher_question import TeacherQuestionView
from api.views.teacher.teacher_forum.teacher_unanswer import TeacherUnanswerView
from api.views.teacher.teacher_forum.teacher_tag import TeacherTagView
from api.views.teacher.teacher_forum.teacher_save import TeacherSaveView

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
    path('teacher/teacher_courses/teacher_courses/', TeacherCoursesView.as_view(), name='teacher_courses'),
    path('teacher/teacher_docs/teacher_docs/', TeacherDocView.as_view(), name='teacher_docs'),
    path('teacher/teacher_homework/teacher_homework/', TeacherHomeworkView.as_view(), name='teacher_homework'),
    path('teacher/teacher_contact/teacher_contact/', TeacherContactView.as_view(), name='teacher_contact'),
    path('teacher/teacher_forum/teacher_question/', TeacherQuestionView.as_view(), name='teacher_question'),
    path('teacher/teacher_forum/teacher_unanswer/', TeacherUnanswerView.as_view(), name='teacher_unanswer'),
    path('teacher/teacher_forum/teacher_tag/', TeacherTagView.as_view(), name='teacher_tag'),
    path('teacher/teacher_forum/teacher_save/', TeacherSaveView.as_view(), name='teacher_save'),
    path('teacher/teacher_support/teacher_support/', TeacherSupportView.as_view(), name='teacher_support'),
]

