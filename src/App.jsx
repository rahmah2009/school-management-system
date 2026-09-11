import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import PublicLayout from "./components/layout/PublicLayout";
import AdminLayout from "./components/layout/AdminLayout";

// Public pages
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Academics from "./pages/public/Academics";
import PublicTeachers from "./pages/public/Teachers";
import Contact from "./pages/public/Contact";

// Admin pages
import Dashboard from "./pages/admin/Dashboard";
import Students from "./pages/admin/Students";
import Teachers from "./pages/admin/Teachers";
import Classes from "./pages/admin/Classes";
import Results from "./pages/admin/Results";
import Sessions from "./pages/admin/Sessions";
import Settings from "./pages/admin/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public website */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/teachers" element={<PublicTeachers />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Admin website */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="classes" element={<Classes />} />
          <Route path="results" element={<Results />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="settings" element={<Settings />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}