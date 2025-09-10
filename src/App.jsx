
import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import CR from "./Pages/client/CR.jsx";
import AdminPage from './Pages/admin/adminPage.jsx';
import LoginPage from "./Pages/login.jsx";
import RegisterPage from "./Pages/register.jsx";

function App() {


  return (
   <BrowserRouter>
     <Routes path="/*">
         <Route path="/*" element={<CR/>}/>
         <Route path="/login" element={<LoginPage/>}/>
         <Route path="/signup" element={<RegisterPage/>}/>
         <Route path="/admin/*" element={<AdminPage/>}/>
     </Routes>
   </BrowserRouter>
  )
}


export default App
