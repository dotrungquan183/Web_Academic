import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Menu from "./components/normal_users/Menu";
import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/Forgotpassword";
import HomeTab from "./components/normal_users/Tabs/HomeTab";
import Home1 from "./components/normal_users/Tabs/Home/Home1";
import Home2 from "./components/normal_users/Tabs/Home/Home2";
import Home3 from "./components/normal_users/Tabs/Home/Home3";
import IntroTab from "./components/normal_users/Tabs/IntroTab";
import CoursesTab from "./components/normal_users/Tabs/CoursesTab";
import TeachersTab from "./components/normal_users/Tabs/TeachersTab";
import Register from "./components/auth/Register";
import MediaCoverageTab from "./components/normal_users/Tabs/MediaCoverageTab";
import ParentsCornerTab from "./components/normal_users/Tabs/ParentsCornerTab";
import RegistrationTab from "./components/normal_users/Tabs/RegistrationTab";
import ContactTab from "./components/normal_users/Tabs/ContactTab";

import StudentMenu from "./components/student/StudentMenu";
import StudentHomeTab from "./components/student/Tabs/StudentHome/StudentHomeTab";
import StudentHome1 from "./components/student/Tabs/StudentHome/StudentHome1Tab";
import StudentHome2 from "./components/student/Tabs/StudentHome/StudentHome2Tab";
import StudentHome3 from "./components/student/Tabs/StudentHome/StudentHome3Tab";
import StudentIntroTab from "./components/student/Tabs/StudentIntroTab";
import StudentCoursesTab from "./components/student/Tabs/StudentCoursesTab";
import StudentDocsTab from "./components/student/Tabs/StudentDocsTab"
import StudentForumTab from "./components/student/Tabs/StudentForumTab/Menu"
import StudentForumQuestion from "./components/student/Tabs/StudentForumTab/Tabs/Question"
import StudentForumUnanswer from "./components/student/Tabs/StudentForumTab/Tabs/Unanswer"
import StudentForumTag from "./components/student/Tabs/StudentForumTab/Tabs/Tag"
import StudentForumSave from "./components/student/Tabs/StudentForumTab/Tabs/Save"
import StudentSupportTab from "./components/student/Tabs/StudentSupportTab"
import StudentHomeworkTab from "./components/student/Tabs/StudentHomeworkTab"
import StudentContactTab from "./components/student/Tabs/StudentContactTab";

import TeacherMenu from "./components/teacher/TeacherMenu";
import TeacherHomeTab from "./components/teacher/Tabs/TeacherHome/TeacherHomeTab";
import TeacherHome1 from "./components/teacher/Tabs/TeacherHome/TeacherHome1Tab";
import TeacherHome2 from "./components/teacher/Tabs/TeacherHome/TeacherHome2Tab";
import TeacherHome3 from "./components/teacher/Tabs/TeacherHome/TeacherHome3Tab";
import TeacherIntroTab from "./components/teacher/Tabs/TeacherIntroTab";
import TeacherCoursesTab from "./components/teacher/Tabs/TeacherCoursesTab";
import TeacherDocsTab from "./components/teacher/Tabs/TeacherDocsTab"
import TeacherForumTab from "./components/teacher/Tabs/TeacherForumTab/Menu"
import TeacherForumQuestion from "./components/teacher/Tabs/TeacherForumTab/Tabs/Question"
import TeacherForumUnanswer from "./components/teacher/Tabs/TeacherForumTab/Tabs/Unanswer"
import TeacherForumTag from "./components/teacher/Tabs/TeacherForumTab/Tabs/Tag"
import TeacherForumSave from "./components/teacher/Tabs/TeacherForumTab/Tabs/Save"
import TeacherSupportTab from "./components/teacher/Tabs/TeacherSupportTab"
import TeacherHomeworkTab from "./components/teacher/Tabs/TeacherHomeworkTab"
import TeacherContactTab from "./components/teacher/Tabs/TeacherContactTab";

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
    </>
  );
}

function TeacherLayout({ children }) {
  return (
    <>
      <TeacherMenu />
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
            navigate("/student", { replace: true });
            break;
        case "teacher":
            navigate("/teacher", { replace: true });
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
        <Route path="/home1" element={<NormalUserLayout><Home1 /></NormalUserLayout>} />
        <Route path="/home2" element={<NormalUserLayout><Home2 /></NormalUserLayout>} />
        <Route path="/home3" element={<NormalUserLayout><Home3 /></NormalUserLayout>} />
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
        <Route path="/studentcourses" element={<StudentLayout><StudentCoursesTab /></StudentLayout>} />
        <Route path="/studentdocs" element={<StudentLayout><StudentDocsTab /></StudentLayout>} />
        <Route path="/studentforum" element={<StudentLayout><StudentForumTab /></StudentLayout>} />
        <Route path="/studentsupport" element={<StudentLayout><StudentSupportTab /></StudentLayout>} />
        <Route path="/studentcontact" element={<StudentLayout><StudentContactTab /></StudentLayout>} />
        <Route path="/studenthomework" element={<StudentLayout><StudentHomeworkTab /></StudentLayout>} />
        <Route path="/studentforum/question" element={<StudentLayout><StudentForumQuestion /></StudentLayout>} />
        <Route path="/studentforum/unanswer" element={<StudentLayout><StudentForumUnanswer /></StudentLayout>} />
        <Route path="/studentforum/tag" element={<StudentLayout><StudentForumTag /></StudentLayout>} />
        <Route path="/studentforum/save" element={<StudentLayout><StudentForumSave /></StudentLayout>} />

        <Route path="/teacher" element={<TeacherLayout><TeacherHomeTab /></TeacherLayout>} />
        <Route path="/teacherhome1" element={<TeacherLayout><TeacherHome1 /></TeacherLayout>} />
        <Route path="/teacherhome2" element={<TeacherLayout><TeacherHome2 /></TeacherLayout>} />
        <Route path="/teacherhome3" element={<TeacherLayout><TeacherHome3 /></TeacherLayout>} />
        <Route path="/teacherintro" element={<TeacherLayout><TeacherIntroTab /></TeacherLayout>} />
        <Route path="/teachercourses" element={<TeacherLayout><TeacherCoursesTab /></TeacherLayout>} />
        <Route path="/teacherdocs" element={<TeacherLayout><TeacherDocsTab /></TeacherLayout>} />
        <Route path="/teacherforum" element={<TeacherLayout><TeacherForumTab /></TeacherLayout>} />
        <Route path="/teachersupport" element={<TeacherLayout><TeacherSupportTab /></TeacherLayout>} />
        <Route path="/teachercontact" element={<TeacherLayout><TeacherContactTab /></TeacherLayout>} />
        <Route path="/teacherhomework" element={<TeacherLayout><TeacherHomeworkTab /></TeacherLayout>} />
        <Route path="/teacherforum/question" element={<TeacherLayout><TeacherForumQuestion /></TeacherLayout>} />
        <Route path="/teacherforum/unanswer" element={<TeacherLayout><TeacherForumUnanswer /></TeacherLayout>} />
        <Route path="/teacherforum/tag" element={<TeacherLayout><TeacherForumTag /></TeacherLayout>} />
        <Route path="/teacherforum/save" element={<TeacherLayout><TeacherForumSave /></TeacherLayout>} />

        {/* Đăng nhập */}
        <Route path="/login" element={<LoginHandler setUserRole={setUserRole} />} />
        {/* Đăng ký */}
        <Route path="/register" element={<Register />} />
        {/* Quên mật khẩu */}
        <Route path="/forgotpassword" element={<ForgotPasswordHandler />} />

        {/* Sinh viên */}
        <Route path="/student" element={userRole === "student" ? <StudentMenu /> : <LoginHandler setUserRole={setUserRole} />} />

        {/* Giáo viên */}
        <Route path="/teacher" element={userRole === "teacher" ? <TeacherMenu /> : <LoginHandler setUserRole={setUserRole} />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
