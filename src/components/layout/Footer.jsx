import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  MapPin,
  Phone,
  Mail,
} from "../common/Icons";

function Footer() {
  return (
    <footer className="bg-green-950 px-6 pt-16 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-4">

        {/* Brand */}
        <div className="footer-column">
          <h2 className="text-xl font-bold">Greenfield School</h2>
          <p className="mt-1 text-sm text-amber-400">Raising role models</p>

          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
            Providing quality education and helping students develop the
            knowledge, character, and skills they need for a brighter future.
          </p>

          <div className="mt-6 flex gap-3">
            <a href="#" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-amber-400 hover:text-green-950">
              <Facebook size={16} />
            </a>
            <a href="#" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-amber-400 hover:text-green-950">
              <Instagram size={16} />
            </a>
            <a href="#" aria-label="Twitter" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-amber-400 hover:text-green-950">
              <Twitter size={16} />
            </a>
            <a href="#" aria-label="YouTube" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-amber-400 hover:text-green-950">
              <Youtube size={16} />
            </a>
            <a href="#" aria-label="LinkedIn" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-amber-400 hover:text-green-950">
              <Linkedin size={16} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h3 className="text-sm font-semibold tracking-wide text-amber-400">Quick Links</h3>

          <ul className="mt-4 space-y-3 text-sm">
            <li><Link to="/" className="text-white/70 transition hover:text-white">Home</Link></li>
            <li><Link to="/about" className="text-white/70 transition hover:text-white">About Us</Link></li>
            <li><Link to="/academics" className="text-white/70 transition hover:text-white">Academics</Link></li>
            <li><Link to="/teachers" className="text-white/70 transition hover:text-white">Teachers</Link></li>
            <li><Link to="/contact" className="text-white/70 transition hover:text-white">Contact</Link></li>
          </ul>
        </div>

        {/* Academics */}
        <div className="footer-column">
          <h3 className="text-sm font-semibold tracking-wide text-amber-400">Academics</h3>

          <ul className="mt-4 space-y-3 text-sm">
            <li className="text-white/70">Junior Secondary School</li>
            <li className="text-white/70">Senior Secondary School</li>
            <li><Link to="/" className="text-white/70 transition hover:text-white">Student Activities</Link></li>
            <li><Link to="/" className="text-white/70 transition hover:text-white">School Facilities</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-column">
          <h3 className="text-sm font-semibold tracking-wide text-amber-400">Contact Us</h3>

          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-amber-400" />
              <span>Ilorin, Kwara State, Nigeria</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="shrink-0 text-amber-400" />
              <span>+234 800 000 0000</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="shrink-0 text-amber-400" />
              <span>info@greenfieldschool.com</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 py-6 text-xs text-white/60 sm:flex-row">
        <p>© 2026 Greenfield School. All rights reserved.</p>

        <div className="flex gap-4">
          <Link to="/privacy-policy" className="transition hover:text-white">Privacy Policy</Link>
          <Link to="/terms-of-use" className="transition hover:text-white">Terms of Use</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;