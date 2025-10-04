
import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import CR from "./Pages/client/CR.jsx";
import AdminPage from './Pages/admin/adminPage.jsx';
import LoginPage from "./Pages/login.jsx";
import RegisterPage from "./Pages/register.jsx";
import {Toaster} from "react-hot-toast";
import ScrollToTop from "./components/ScrollToTop";
import ForgetPasswordPage from "./Pages/forgetPassword.jsx";
import {GoogleOAuthProvider} from "@react-oauth/google";   // ✅ import


function App() {
  return (
      <GoogleOAuthProvider clientId="932522795625-37a6btc2f1i50g4eva3eg69f1nft5dsi.apps.googleusercontent.com">
    <BrowserRouter>
      {/* 👇 ensures every route change scrolls to top */}
      <ScrollToTop />

      <div>
        <Toaster position="top-right" />
        <Routes>
          {/* Client routes */}
          <Route path="/*" element={<CR />} />
          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<RegisterPage />} />
            <Route path="/forget" element={<ForgetPasswordPage />} />
          {/* Admin routes */}
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      </div>
    </BrowserRouter>
          </GoogleOAuthProvider>
  );
}

export default App
