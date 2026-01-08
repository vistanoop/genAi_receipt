import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "@/components/dashboard";
import Report from "@/components/Report";
import LandingPage from "@/components/LandingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<Report />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
