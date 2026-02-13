import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import Analyzer from "./pages/Analyzer";
import NotFound from "./pages/NotFound";
import Jobs from "./pages/Jobs";
import JDAnalyzer from "./pages/JDAnalyzer";
import Footer from "./components/Footer";


// import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";



export default function App() {
  return (
    // <div className="min-h-screen bg-slate-950 text-slate-100">
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-20">

      {/* <div className="min-h-screen bg-white text-slate-900"> */}
        

      <Navbar />
      <div className="w-full px-6 py-6">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/analyzer" element={<Analyzer />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:roleId" element={<JobDetails />} />
          <Route path="/jd" element={<JDAnalyzer />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
       <Footer />
    </div>
  );
}
