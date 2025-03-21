import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Menu from "./components/normal_users/Menu";
import Login from "./components/Login";
import ForgotPassword from "./components/Forgotpassword";
import AdminTab from "./components/admin/AdminTab";
import HomeTab from "./components/normal_users/Tabs/HomeTab";
import Home1 from "./components/normal_users/Tabs/Home/Home1";
import Home2 from "./components/normal_users/Tabs/Home/Home2";
import Home3 from "./components/normal_users/Tabs/Home/Home3";
import IntroTab from "./components/normal_users/Tabs/IntroTab";
import CoursesTab from "./components/normal_users/Tabs/CoursesTab";
import TeachersTab from "./components/normal_users/Tabs/TeachersTab";
import Register from "./components/Register";
import MediaCoverageTab from "./components/normal_users/Tabs/MediaCoverageTab";
import ParentsCornerTab from "./components/normal_users/Tabs/ParentsCornerTab";
import ContactTab from "./components/normal_users/Tabs/ContactTab";

function NormalUserLayout({ children }) {
  return (
    <>
      <Menu />
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

    navigate(role === "admin" ? "/admin" : "/", { replace: true });
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

        {/* Đăng nhập */}
        <Route path="/login" element={<LoginHandler setUserRole={setUserRole} />} />
        {/* Đăng ký */}
        <Route path="/register" element={<Register />} />
        {/* Quên mật khẩu */}
        <Route path="/forgotpassword" element={<ForgotPasswordHandler />} />

        {/* Admin */}
        <Route path="/admin" element={userRole === "admin" ? <AdminTab /> : <LoginHandler setUserRole={setUserRole} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
