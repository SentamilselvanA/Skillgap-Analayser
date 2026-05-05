import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { SkillsProvider } from "./context/SkillsContext";
import Navbar from "./components/Navbar.jsx";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import Analyzer from "./pages/Analyzer";
import NotFound from "./pages/NotFound";
import Jobs from "./pages/Jobs";
import JDAnalyzer from "./pages/JDAnalyzer";
import Footer from "./components/Footer.jsx";
import RoleCompare from "./pages/RoleCompare";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SkillsProvider>
          <div className="min-h-screen pt-16 transition-colors duration-300"
               style={{ background: "var(--bg-main)", color: "var(--tx-secondary)" }}>

            <Navbar />
            {/* Full-width OS shell — padding only, no max-w cap */}
            <div className="w-full px-6 md:px-10 lg:px-16 py-8">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/analyzer" element={<Analyzer />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:roleId" element={<JobDetails />} />
                <Route path="/jd" element={<JDAnalyzer />} />
                <Route path="/compare" element={<RoleCompare />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </SkillsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

