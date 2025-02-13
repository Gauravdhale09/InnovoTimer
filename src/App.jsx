import { useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import Login from "./Components/Login";
import Timer from "./Components/Timer";
import Home from "./Components/Home";
import Cookies from "js-cookie";

function PrivateRoute({ element }) {
  const isAuthenticated = Cookies.get('access_token'); 

  return isAuthenticated ? element : <Navigate to="/login" replace />;
}
function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute element={<Home />} />} />
        <Route path="/timer" element={<PrivateRoute element={<Timer />} />} />
      </Routes>
    </div>
  );
}

function App1() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Timer/>} />
        <Route path="*" element={<Timer />} />
      </Routes>
    </div>
  );
}

export default App1;
