import { Routes, Route } from "react-router-dom";

import PublicLayout from "./components/layout/PublicLayout";
import Home from "./pages/public/Home";
import Contact from "./pages/public/Contact";
import About from "./pages/public/About";
import Academics from "./pages/public/Academics";

export default function App() {
  return (
      <Routes>

        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/academics" element={<Academics/>}/>
        </Route>

      </Routes>
  );
}