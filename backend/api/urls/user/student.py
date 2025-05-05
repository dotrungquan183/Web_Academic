from django.urls import path

from api.views.student.student_home.student_home1 import StudentHome1View
from api.views.student.student_home.student_home2 import StudentHome2View
from api.views.student.student_home.student_home3 import StudentHome3View

from api.views.student.student_intro import StudentIntroView
from api.views.student.student_docs.student_docs import StudentDocView
from api.views.student.student_homework.student_homework import StudentHomeworkView
from api.views.student.student_support.student_support import StudentSupportView
from api.views.student.student_contact.student_contact import StudentContactView
from api.views.student.student_forum.student_question.student_showquestion import StudentShowQuestionView
from api.views.student.student_forum.student_question.student_askquestion import StudentAskQuestionView
from api.views.student.student_forum.student_question.student_detailquestion import StudentDetailQuestionView
from api.views.student.student_forum.student_question.student_ansquestion import StudentAnsQuestionView
from api.views.student.student_forum.student_question.student_comment import StudentCommentView
from api.views.student.student_forum.student_unanswer import StudentUnanswerView
from api.views.student.student_forum.student_tag import StudentTagView
from api.views.student.student_forum.student_save import StudentSaveView
from api.views.student.student_forum.student_question.student_relatedquestion import StudentRelatedQuestionView
from api.views.student.student_forum.student_question.student_hotquestion import StudentHotQuestionView
from api.views.student.student_courses.student_addcourses import StudentAddCoursesView
from api.views.student.student_courses.student_lastestcourses import StudentLastestCoursesView
from api.views.student.student_courses.student_bestcourses import StudentBestCoursesView
from api.views.student.student_courses.student_detailcourses import StudentDetailCoursesView
from api.views.student.student_courses.student_registrycourses import StudentRegistryCoursesView

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
    path('student/student_courses/student_addcourses/', StudentAddCoursesView.as_view(), name='student_addcourses'),
    path('student/student_courses/student_addcourses/<int:pk>/', StudentAddCoursesView.as_view(), name='student_addcourses_id'),
    path('student/student_courses/student_lastestcourses/', StudentLastestCoursesView.as_view(), name='student_lastestcourses'),
    path('student/student_courses/student_bestcourses/', StudentBestCoursesView.as_view(), name='student_bestcourses'),
    path('student/student_courses/student_detailcourses/', StudentDetailCoursesView.as_view(), name='student_detailcourses'),
    path('student/student_courses/student_detailcourses/<int:pk>/', StudentDetailCoursesView.as_view(), name='student_detailcourses_id'),
    path('student/student_courses/student_registrycourses/<int:course_id>/', StudentRegistryCoursesView.as_view(), name='student_registrycourses_id'),
    path('student/student_courses/student_registrycourses/', StudentRegistryCoursesView.as_view(), name='student_registrycourses_id'),
    path('student/student_docs/student_docs/', StudentDocView.as_view(), name='student_docs'),
    path('student/student_homework/student_homework/', StudentHomeworkView.as_view(), name='student_homework'),
    path('student/student_contact/student_contact/', StudentContactView.as_view(), name='student_contact'),
    path('student/student_forum/student_question/student_showquestion/', StudentShowQuestionView.as_view(), name='student_showquestion'),
    path('student/student_forum/student_question/student_showquestion/<int:question_id>/', StudentShowQuestionView.as_view(), name='student_showquestion_id'),
    path('student/student_forum/student_question/student_askquestion/', StudentAskQuestionView.as_view(), name='student_askquestion'),
    path('student/student_forum/student_question/student_askquestion/<int:question_id>/', StudentAskQuestionView.as_view(), name='student_askquestion_id'),
    path('student/student_forum/student_question/student_detailquestion/', StudentDetailQuestionView.as_view(), name='student_detailquestion'),
    path('student/student_forum/student_question/student_detailquestion/<int:question_id>/', StudentDetailQuestionView.as_view(), name='student_detailquestion_id'),
    path('student/student_forum/student_question/student_ansquestion/', StudentAnsQuestionView.as_view(), name='student_ansquestion'),
    path('student/student_forum/student_question/student_ansquestion/<int:answer_id>/', StudentAnsQuestionView.as_view()),
    path('student/student_forum/student_question/student_comment/', StudentCommentView.as_view(), name='student_comment'),
    path('student/student_forum/student_question/student_comment/<int:comment_id>/', StudentCommentView.as_view(), name='student_comment'),
    path('student/student_forum/student_unanswer/', StudentUnanswerView.as_view(), name='student_unanswer'),
    path('student/student_forum/student_tag/', StudentTagView.as_view(), name='student_tag'),
    path('student/student_forum/student_save/', StudentSaveView.as_view(), name='student_save'),
    path('student/student_support/student_support/', StudentSupportView.as_view(), name='student_support'),
    path("student/student_forum/student_question/<int:question_id>/", StudentAskQuestionView.as_view()),
    path('student/student_forum/student_question/student_relatedquestion/<int:question_id>/', StudentRelatedQuestionView.as_view(), name='student_related_questions'),
    path('student/student_forum/student_question/student_hotquestion/', StudentHotQuestionView.as_view(), name='student_hot_questions'),
]

