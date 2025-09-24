
import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import CR from "./Pages/client/CR.jsx";
import AdminPage from './Pages/admin/adminPage.jsx';
import LoginPage from "./Pages/login.jsx";
import RegisterPage from "./Pages/register.jsx";
import {Toaster} from "react-hot-toast";
import ScrollToTop from "./components/ScrollToTop";   // ✅ import

function App() {
  return (
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

          {/* Admin routes */}
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App
