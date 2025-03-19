import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Menu from "./components/normal_users/Menu";
import Login from "./components/Login";
import ForgotPassword from "./components/Forgotpassword"; // Import ForgotPassword
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

  const handleLoginSuccess = (username) => {
    if (username.startsWith("ad")) {
      setUserRole("admin");
      navigate("/admin", { replace: true });
    } else {
      setUserRole("user");
      navigate("/", { replace: true });
    }
  };

  return <Login onLoginSuccess={handleLoginSuccess} />;
}

function App() {
  const [userRole, setUserRole] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <NormalUserLayout>
              <HomeTab />
            </NormalUserLayout>
          }
        />
        <Route path="/home1" element={<NormalUserLayout><Home1 /></NormalUserLayout>} />
        <Route path="/home2" element={<NormalUserLayout><Home2 /></NormalUserLayout>} />
        <Route path="/home3" element={<NormalUserLayout><Home3 /></NormalUserLayout>} />
        <Route path="/intro" element={<NormalUserLayout><IntroTab /></NormalUserLayout>} />
        <Route path="/courses" element={<NormalUserLayout><CoursesTab /></NormalUserLayout>} />
        <Route path="/teachers" element={<NormalUserLayout><TeachersTab /></NormalUserLayout>} />
        <Route path="/media_coverage" element={<NormalUserLayout><MediaCoverageTab /></NormalUserLayout>} />
        <Route path="/parents_corner" element={<NormalUserLayout><ParentsCornerTab /></NormalUserLayout>} />
        <Route path="/contact" element={<NormalUserLayout><ContactTab /></NormalUserLayout>} />

        {/* Route đăng nhập */}
        <Route path="/login" element={<LoginHandler setUserRole={setUserRole} />} />
        {/* Route đăng ký */}
        <Route path="/register" element={<Register />} />
        {/* Route Quên mật khẩu */}
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        {/* Route Admin */}
        <Route
          path="/admin"
          element={userRole === "admin" ? <AdminTab /> : <LoginHandler setUserRole={setUserRole} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
