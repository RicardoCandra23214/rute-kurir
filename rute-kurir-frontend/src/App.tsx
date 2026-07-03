import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPages";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Register from "./pages/register";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;