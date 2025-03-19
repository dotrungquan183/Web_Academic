from django.urls import path

from api.views.normal_users.home.home1 import Home1View
from api.views.normal_users.home.home2 import Home2View
from api.views.normal_users.home.home3 import Home3View

from api.views.normal_users.intro import IntroView
from api.views.normal_users.courses.courses import CoursesView
from api.views.normal_users.media_coverage.media_coverage import MediaCoverageView
from api.views.normal_users.teachers.teachers import TeachersView
from api.views.normal_users.registration.registration import RegistrationView
from api.views.normal_users.parents_corner.parents_corner import ParentsCornerView
from api.views.normal_users.contact.contact import ContactView

from api.views.login import login_view
from api.views.forgotpassword import forgotpassword_view
urlpatterns = [
    path("login/", login_view, name="login"),
    path("forgotpassword/", forgotpassword_view, name="forgotpassword"),
    path('normal_users/home/home1/', Home1View.as_view(), name='home1'),
    path('normal_users/home/home2/', Home2View.as_view(), name='home2'),
    path('normal_users/home/home3/', Home3View.as_view(), name='home3'),
    path('normal_users/intro/', IntroView.as_view(), name='intro'),
    path('normal_users/courses/courses/', CoursesView.as_view(), name='courses'),
    path('normal_users/teachers/teachers/', TeachersView.as_view(), name='teachers'),
    path('normal_users/registration/registration/', RegistrationView.as_view(), name='registration'),
    path('normal_users/media_coverage/media_coverage/', MediaCoverageView.as_view(), name='media-coverage'),
    path('normal_users/parents_corner/parents_corner/', ParentsCornerView.as_view(), name='parents-corner'),
    path('normal_users/contact/contact/', ContactView.as_view(), name='contact'),
]

