
import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import CR from "./Pages/client/CR.jsx";

function App() {


  return (
   <BrowserRouter>
     <Routes path="/*">
         <Route path="/*" element={<CR/>}/>
     </Routes>
   </BrowserRouter>
  )
}

export default App
