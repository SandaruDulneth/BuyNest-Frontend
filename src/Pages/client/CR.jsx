import {Route, Routes} from "react-router-dom";
import HomePage from "./home.jsx";
import Header from "../../components/header.jsx";

export default function CR() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      <Header />
      <div className="w-full flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </div>
    </div>
  );
}
