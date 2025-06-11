import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Menu from "./components/normal_users/Menu";
import Login from "./components/auth/Login";
import AccountPage from "./components/auth/Account";
import ForgotPassword from "./components/auth/Forgotpassword";

import HomeTab from "./components/normal_users/Tabs/HomeTab";
import IntroTab from "./components/normal_users/Tabs/IntroTab";
import CoursesTab from "./components/normal_users/Tabs/CoursesTab";
import TeachersTab from "./components/normal_users/Tabs/TeachersTab";
import Register from "./components/auth/Register";
import MediaCoverageTab from "./components/normal_users/Tabs/MediaCoverageTab";
import ParentsCornerTab from "./components/normal_users/Tabs/ParentsCornerTab";
import RegistrationTab from "./components/normal_users/Tabs/RegistrationTab";
import ContactTab from "./components/normal_users/Tabs/ContactTab";

import StudentMenu from "./components/student/StudentMenu";
import StudentFooter from "./components/student/StudentFooter";
import StudentHomeTab from "./components/student/Tabs/StudentHome/StudentHomeTab";
import StudentHome1 from "./components/student/Tabs/StudentHome/StudentHome1Tab";
import StudentHome2 from "./components/student/Tabs/StudentHome/StudentHome2Tab";
import StudentHome3 from "./components/student/Tabs/StudentHome/StudentHome3Tab";
import StudentIntroTab from "./components/student/Tabs/StudentIntroTab";
import StudentDocsTab from "./components/student/Tabs/StudentDocsTab"
import StudentForumTab from "./components/student/Tabs/StudentForumTab/Menu"
import StudentForumQuestion from "./components/student/Tabs/StudentForumTab/Tabs/Questions/Question"
import StudentAskQuestion from "./components/student/Tabs/StudentForumTab/Tabs/Questions/AskQuestion"
import StudentForumQuestionDetail from "./components/student/Tabs/StudentForumTab/Tabs/Questions/DetailQuestion"
import StudentForumUnanswer from "./components/student/Tabs/StudentForumTab/Tabs/Unanswer"
import StudentForumTag from "./components/student/Tabs/StudentForumTab/Tabs/Tag"
import StudentForumSave from "./components/student/Tabs/StudentForumTab/Tabs/Save"
import StudentSupportTab from "./components/student/Tabs/StudentSupportTab"
import StudentHomeworkTab from "./components/student/Tabs/StudentHomeworkTab"
import StudentContactTab from "./components/student/Tabs/StudentContactTab";
import StudentListCourses from "./components/student/Tabs/StudentCoursesTab/Tabs/Courses/ListCourses"; 
import StudentAddCourses from "./components/student/Tabs/StudentCoursesTab/Tabs/Courses/AddCourses";
import StudentDetailCourses from "./components/student/Tabs/StudentCoursesTab/Tabs/Courses/DetailCourses";
import StudentRoadmap from "./components/student/Tabs/StudentCoursesTab/Tabs/Roadmap";
import StudentProfileCourses from "./components/student/Profile/Tabs/ProfileCourses";
import StudentProfileForum from "./components/student/Profile/Tabs/ProfileForum";

import TeacherMenu from "./components/teacher/TeacherMenu";
import TeacherFooter from "./components/teacher/TeacherFooter";
import TeacherHomeTab from "./components/teacher/Tabs/TeacherHome/TeacherHomeTab";
import TeacherHome1 from "./components/teacher/Tabs/TeacherHome/TeacherHome1Tab";
import TeacherHome2 from "./components/teacher/Tabs/TeacherHome/TeacherHome2Tab";
import TeacherHome3 from "./components/teacher/Tabs/TeacherHome/TeacherHome3Tab";
import TeacherIntroTab from "./components/teacher/Tabs/TeacherIntroTab";
import TeacherDocsTab from "./components/teacher/Tabs/TeacherDocsTab"
import TeacherForumTab from "./components/teacher/Tabs/TeacherForumTab/Menu"
import TeacherForumQuestion from "./components/teacher/Tabs/TeacherForumTab/Tabs/Questions/Question"
import TeacherAskQuestion from "./components/teacher/Tabs/TeacherForumTab/Tabs/Questions/AskQuestion"
import TeacherForumHome from "./components/teacher/Tabs/TeacherForumTab/Tabs/Home"
import TeacherForumQuestionDetail from "./components/teacher/Tabs/TeacherForumTab/Tabs/Questions/DetailQuestion"

import TeacherUnanswersAskQuestion from "./components/teacher/Tabs/TeacherForumTab/Tabs/Unanswers/AskQuestion"
import TeacherUnanswersForumQuestion from "./components/teacher/Tabs/TeacherForumTab/Tabs/Unanswers/Question"
import TeacherUnanswersForumQuestionDetail from "./components/teacher/Tabs/TeacherForumTab/Tabs/Unanswers/DetailQuestion"

import TeacherForumTag from "./components/teacher/Tabs/TeacherForumTab/Tabs/Tags/Tag"
import TeacherTagsForumQuestion from "./components/teacher/Tabs/TeacherForumTab/Tabs/Tags/Question";

import TeacherResultTab from "./components/teacher/Tabs/TeacherResultTab"
import TeacherHomeworkTab from "./components/teacher/Tabs/TeacherHomeworkTab"
import TeacherContactTab from "./components/teacher/Tabs/TeacherContactTab";
import TeacherListCourses from "./components/teacher/Tabs/TeacherCoursesTab/Tabs/Courses/ListCourses"; 
import TeacherAddCourses from "./components/teacher/Tabs/TeacherCoursesTab/Tabs/Courses/AddCourses";
import TeacherDetailCourses from "./components/teacher/Tabs/TeacherCoursesTab/Tabs/Courses/DetailCourses";
import TeacherRoadmap from "./components/teacher/Tabs/TeacherCoursesTab/Tabs/Roadmap";
import TeacherProfileCourses from "./components/teacher/Profile/Tabs/ProfileCourses";
import TeacherProfileForum from "./components/teacher/Profile/Tabs/ProfileForum";

import AdminMenu from "./components/admin/AdminMenu";
import AdminForumTab from "./components/admin/Tabs/AdminForumTab/Menu"
import AdminForumQuestion from "./components/admin/Tabs/AdminForumTab/Tabs/Questions/Question"
import AdminForumUnanswer from "./components/admin/Tabs/AdminForumTab/Tabs/Unanswer"
import AdminForumTag from "./components/admin/Tabs/AdminForumTab/Tabs/Tag"
import AdminForumSave from "./components/admin/Tabs/AdminForumTab/Tabs/Save"
import AdminResultTab from "./components/admin/Tabs/AdminResultTab"
import AdminListCourses from "./components/admin/Tabs/AdminCoursesTab/Tabs/Courses/ListCourses"; 
import AdminDetailCourses from "./components/admin/Tabs/AdminCoursesTab/Tabs/Courses/DetailCourses";
import AdminPost from "./components/admin/Tabs/AdminCoursesTab/Tabs/Post";
import AdminForumQuestionDetail from "./components/admin/Tabs/AdminForumTab/Tabs/Questions/DetailQuestion"
import AdminManageAccount from "./components/admin/Tabs/AdminManageTab/AdminManageAccount";
import AdminManageDetailAccount from "./components/admin/Tabs/AdminManageTab/AdminManageDetailAccount";

function NormalUserLayout({ children }) {
  return (
    <>
      <Menu />
      {children}
    </>
  );
}

function StudentLayout({ children }) {
  return (
    <>
      <StudentMenu />
      {children}
      <StudentFooter />
    </>
  );
}

function TeacherLayout({ children }) {
  return (
    <>
      <TeacherMenu />
      {children}
      <TeacherFooter />
    </>
  );
}

function AdminLayout({ children }) {
  return (
    <>
      <AdminMenu />
      {children}
    </>
  );
}

function LoginHandler({ setUserRole }) {
  const navigate = useNavigate();

  useEffect(() => {
    const isPasswordReset = localStorage.getItem("passwordReset") === "true";
    if (isPasswordReset) {
      localStorage.removeItem("passwordReset");
      navigate("/", { replace: true }); // Ngăn người dùng quay lại ForgotPassword
    }
  }, [navigate]);

  const handleLoginSuccess = (role) => {
    console.log("DEBUG: Role nhận từ API:", role);
    if (!role) return;

    setUserRole(role);
    localStorage.setItem("userRole", role);

    // Điều hướng dựa trên vai trò
    switch (role) {
        case "student":
            navigate("/studentintro", { replace: true });
            break;
        case "teacher":
            navigate("/teacherintro", { replace: true });
            break;
        case "admin":
            navigate("/admin", { replace: true });
            break;
        default:
            navigate("/", { replace: true });
            break;
    }
};


  return <Login onLoginSuccess={handleLoginSuccess} />;
}

function ForgotPasswordHandler() {
  const handlePasswordResetSuccess = () => {
    localStorage.setItem("passwordReset", "true");
    window.history.replaceState(null, "", "/login");
  };

  return <ForgotPassword onResetSuccess={handlePasswordResetSuccess} />;
}

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || null);

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NormalUserLayout><HomeTab /></NormalUserLayout>} />
        <Route path="/intro" element={<NormalUserLayout><IntroTab /></NormalUserLayout>} />
        <Route path="/courses" element={<NormalUserLayout><CoursesTab /></NormalUserLayout>} />
        <Route path="/teachers" element={<NormalUserLayout><TeachersTab /></NormalUserLayout>} />
        <Route path="/media_coverage" element={<NormalUserLayout><MediaCoverageTab /></NormalUserLayout>} />
        <Route path="/parents_corner" element={<NormalUserLayout><ParentsCornerTab /></NormalUserLayout>} />
        <Route path="/contact" element={<NormalUserLayout><ContactTab /></NormalUserLayout>} />
        <Route path="/registration" element={<NormalUserLayout><RegistrationTab /></NormalUserLayout>} />

        <Route path="/student" element={<StudentLayout><StudentHomeTab /></StudentLayout>} />
        <Route path="/studenthome1" element={<StudentLayout><StudentHome1 /></StudentLayout>} />
        <Route path="/studenthome2" element={<StudentLayout><StudentHome2 /></StudentLayout>} />
        <Route path="/studenthome3" element={<StudentLayout><StudentHome3 /></StudentLayout>} />
        <Route path="/studentintro" element={<StudentLayout><StudentIntroTab /></StudentLayout>} />
        <Route path="/studentcourses/listcourses" element={<StudentLayout><StudentListCourses /></StudentLayout>} />
        <Route path="/studentcourses/listcourses/:courseId" element={<StudentLayout><StudentDetailCourses /></StudentLayout>} />
        <Route path="/studentcourses/listcourses/addcourses" element={<StudentLayout><StudentAddCourses /></StudentLayout>} />
        <Route path="/studentcourses/listcourses/addcourses/:id" element={<StudentLayout><StudentAddCourses /></StudentLayout>} />
        <Route path="/studentcourses/roadmap" element={<StudentLayout><StudentRoadmap /></StudentLayout>} />
        <Route path="/studentdocs" element={<StudentLayout><StudentDocsTab /></StudentLayout>} />
        <Route path="/studentforum" element={<StudentLayout><StudentForumTab /></StudentLayout>} />
        <Route path="/studentsupport" element={<StudentLayout><StudentSupportTab /></StudentLayout>} />
        <Route path="/studentcontact" element={<StudentLayout><StudentContactTab /></StudentLayout>} />
        <Route path="/studenthomework" element={<StudentLayout><StudentHomeworkTab /></StudentLayout>} />
        <Route path="/studentforum/question" element={<StudentLayout><StudentForumQuestion /></StudentLayout>} />
        <Route path="/studentforum/question/askquestion" element={<StudentLayout><StudentAskQuestion /></StudentLayout>} />
        <Route path="/studentforum/question/:id" element={<StudentLayout><StudentForumQuestionDetail /></StudentLayout>} />
        <Route path="/studentforum/unanswer" element={<StudentLayout><StudentForumUnanswer /></StudentLayout>} />
        <Route path="/studentforum/tag" element={<StudentLayout><StudentForumTag /></StudentLayout>} />
        <Route path="/studentforum/save" element={<StudentLayout><StudentForumSave /></StudentLayout>} />       
        <Route path="/studentprofile/courses" element={<StudentLayout><StudentProfileCourses /></StudentLayout>} />
        <Route path="/studentprofile/forum" element={<StudentLayout><StudentProfileForum /></StudentLayout>} />

        <Route path="/teacher" element={<TeacherLayout><TeacherHomeTab /></TeacherLayout>} />
        <Route path="/teacherhome1" element={<TeacherLayout><TeacherHome1 /></TeacherLayout>} />
        <Route path="/teacherhome2" element={<TeacherLayout><TeacherHome2 /></TeacherLayout>} />
        <Route path="/teacherhome3" element={<TeacherLayout><TeacherHome3 /></TeacherLayout>} />
        <Route path="/teacherintro" element={<TeacherLayout><TeacherIntroTab /></TeacherLayout>} />
        <Route path="/teachercourses/listcourses" element={<TeacherLayout><TeacherListCourses /></TeacherLayout>} />
        <Route path="/teachercourses/listcourses/:courseId" element={<TeacherLayout><TeacherDetailCourses /></TeacherLayout>} />
        <Route path="/teachercourses/listcourses/addcourses" element={<TeacherLayout><TeacherAddCourses /></TeacherLayout>} />
        <Route path="/teachercourses/listcourses/addcourses/:id" element={<TeacherLayout><TeacherAddCourses /></TeacherLayout>} />
        <Route path="/teachercourses/roadmap" element={<TeacherLayout><TeacherRoadmap /></TeacherLayout>} />
        <Route path="/teacherdocs" element={<TeacherLayout><TeacherDocsTab /></TeacherLayout>} />
        <Route path="/teacherforum" element={<TeacherLayout><TeacherForumTab /></TeacherLayout>} />
        <Route path="/teacherresult" element={<TeacherLayout><TeacherResultTab /></TeacherLayout>} />
        <Route path="/teachercontact" element={<TeacherLayout><TeacherContactTab /></TeacherLayout>} />
        <Route path="/teacherhomework" element={<TeacherLayout><TeacherHomeworkTab /></TeacherLayout>} />
        <Route path="/teacherforum/question" element={<TeacherLayout><TeacherForumQuestion /></TeacherLayout>} />
        <Route path="/teacherforum/question/askquestion" element={<TeacherLayout><TeacherAskQuestion /></TeacherLayout>} />
        <Route path="/teacherforum/question/:id" element={<TeacherLayout><TeacherForumQuestionDetail /></TeacherLayout>} />
        <Route path="/teacherforum/unanswers" element={<TeacherLayout><TeacherUnanswersForumQuestion /></TeacherLayout>} />
        <Route path="/teacherforum/unanswers/askquestion" element={<TeacherLayout><TeacherUnanswersAskQuestion /></TeacherLayout>} />
        <Route path="/teacherforum/unanswers/:id" element={<TeacherLayout><TeacherUnanswersForumQuestionDetail /></TeacherLayout>} />
        <Route path="/teacherforum/tag" element={<TeacherLayout><TeacherForumTag /></TeacherLayout>} />
        <Route path="/teacherforum/tag/:tagId" element={<TeacherLayout><TeacherTagsForumQuestion /></TeacherLayout>} />
        <Route path="/teacherforum/home" element={<TeacherLayout><TeacherForumHome /></TeacherLayout>} />
        <Route path="/teacherprofile/courses" element={<TeacherLayout><TeacherProfileCourses /></TeacherLayout>} />
        <Route path="/teacherprofile/forum" element={<TeacherLayout><TeacherProfileForum /></TeacherLayout>} />

        <Route path="/admin" element={<AdminLayout><AdminResultTab /></AdminLayout>} />
        <Route path="/admincourses/listcourses" element={<AdminLayout><AdminListCourses /></AdminLayout>} />
        <Route path="/admincourses/listcourses/:courseId" element={<AdminLayout><AdminDetailCourses /></AdminLayout>} />
        <Route path="/admincourses/post" element={<AdminLayout><AdminPost /></AdminLayout>} />
        <Route path="/adminforum" element={<AdminLayout><AdminForumTab /></AdminLayout>} />
        <Route path="/adminresult" element={<AdminLayout><AdminResultTab /></AdminLayout>} />
        <Route path="/adminforum/question" element={<AdminLayout><AdminForumQuestion /></AdminLayout>} />
        <Route path="/adminforum/question/:id" element={<AdminLayout><AdminForumQuestionDetail /></AdminLayout>} />
        <Route path="/adminforum/unanswer" element={<AdminLayout><AdminForumUnanswer /></AdminLayout>} />
        <Route path="/adminforum/tag" element={<AdminLayout><AdminForumTag /></AdminLayout>} />
        <Route path="/adminforum/save" element={<AdminLayout><AdminForumSave /></AdminLayout>} />
        <Route path="/adminmanage" element={<AdminLayout><AdminManageAccount /></AdminLayout>} />
        <Route path="/adminmanagesystem" element={<AdminLayout><AdminManageDetailAccount /></AdminLayout>} />
        {/* Đăng nhập */}
        <Route path="/login" element={<LoginHandler setUserRole={setUserRole} />} />
        {/* Đăng ký */}
        <Route path="/register" element={<Register />} />
        {/* Quên mật khẩu */}
        <Route path="/forgotpassword" element={<ForgotPasswordHandler />} />

        <Route path="/account" element={
          <>
            <TeacherMenu />
            <AccountPage />
            <TeacherFooter />
          </>
        } />

        {/* Sinh viên */}
        <Route path="/student" element={userRole === "student" ? <StudentMenu /> : <LoginHandler setUserRole={setUserRole} />} />

        {/* Giáo viên */}
        <Route path="/teacher" element={userRole === "teacher" ? <TeacherMenu /> : <LoginHandler setUserRole={setUserRole} />} />

        {/* Admin */}
        <Route path="/admin" element={userRole === "admin" ? <AdminMenu /> : <LoginHandler setUserRole={setUserRole} />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
