import { Routes, Route } from "react-router-dom";

import PublicLayout from "./components/layout/PublicLayout";
import AdminLayout from "./components/layout/AdminLayout";

import ScrollToTop from "./components/common/ScrollToTop";

import Home from "./pages/public/Home";
import Contact from "./pages/public/Contact";
import About from "./pages/public/About";
import Academics from "./pages/public/Academics";
import Teachers from "./pages/public/Teachers";
import Login from "./pages/auth/Login";

import Dashboard from "./pages/admin/Dashboard";
import Students from "./pages/admin/Students"
import Classes from "./pages/admin/Classes"
import TeachersAdmin from "./pages/admin/Teachers";
import Sessions from "./pages/admin/Sessions";

export default function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* Public Website */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/teachers" element={<Teachers />} />
        </Route>

        <Route path="/login" element={<Login />} />

        {/* Admin */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/students" element={<Students />} />
          <Route path="/admin/teachers" element={<TeachersAdmin />} />
          <Route path="/admin/classes" element={<Classes />} />
          <Route path="/admin/sessions" element={<Sessions />} />
        </Route>
      </Routes>
    </>
  );
}