from django.urls import path

from api.views.student.student_home.student_home1 import StudentHome1View
from api.views.student.student_home.student_home2 import StudentHome2View
from api.views.student.student_home.student_home3 import StudentHome3View

from api.views.student.student_intro import StudentIntroView
from api.views.student.student_courses.student_courses import StudentCoursesView
from api.views.student.student_docs.student_docs import StudentDocView
from api.views.student.student_homework.student_homework import StudentHomeworkView
from api.views.student.student_support.student_support import StudentSupportView
from api.views.student.student_contact.student_contact import StudentContactView
from api.views.student.student_forum.student_question import StudentQuestionView
from api.views.student.student_forum.student_unanswer import StudentUnanswerView
from api.views.student.student_forum.student_tag import StudentTagView
from api.views.student.student_forum.student_save import StudentSaveView

from api.views.auth.login import login_view
from api.views.auth.forgotpassword import forgotpassword_view
from api.views.auth.register import register_view
urlpatterns = [
    path("auth/login/", login_view, name="login"),
    path("auth/forgotpassword/", forgotpassword_view, name="forgotpassword"),
    path("auth/register/", register_view, name="register"),
    path('student/student_home/student_home1/', StudentHome1View.as_view(), name='student_home1'),
    path('student/student_home/student_home2/', StudentHome2View.as_view(), name='student_home2'),
    path('student/student_home/student_home3/', StudentHome3View.as_view(), name='student_home3'),
    path('student/student_intro/', StudentIntroView.as_view(), name='student_intro'),
    path('student/student_courses/student_courses/', StudentCoursesView.as_view(), name='student_courses'),
    path('student/student_docs/student_docs/', StudentDocView.as_view(), name='student_docs'),
    path('student/student_homework/student_homework/', StudentHomeworkView.as_view(), name='student_homework'),
    path('student/student_contact/student_contact/', StudentContactView.as_view(), name='student_contact'),
    path('student/student_forum/student_question/', StudentQuestionView.as_view(), name='student_question'),
    path('student/student_forum/student_unanswer/', StudentUnanswerView.as_view(), name='student_unanswer'),
    path('student/student_forum/student_tag/', StudentTagView.as_view(), name='student_tag'),
    path('student/student_forum/student_save/', StudentSaveView.as_view(), name='student_save'),
    path('student/student_support/student_support/', StudentSupportView.as_view(), name='student_support'),
]

