
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

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Academics", to: "/academics" },
  { label: "Teachers", to: "/teachers" },
  { label: "Contact", to: "/contact" },
  { label: "Login", to: "/login" },
];

const academicLinks = [
  { label: "Junior Secondary School", to: "/academics" },
  { label: "Senior Secondary School", to: "/academics" },
];

// Example URLs — replace with Greenfield's actual profiles later.
const socialLinks = [
  {
    label: "Facebook",
    icon: Facebook,
    href: "https://www.facebook.com/greenfieldschoolf",
  },
  {
    label: "Instagram",
    icon: Instagram,
    href: "https://www.instagram.com/greenfieldschool",
  },
  {
    label: "Twitter",
    icon: Twitter,
    href: "https://x.com/greenfieldschool",
  },
  {
    label: "YouTube",
    icon: Youtube,
    href: "https://www.youtube.com/@greenfieldschool",
  },
  {
    label: "LinkedIn",
    icon: Linkedin,
    href: "https://www.linkedin.com/school/greenfieldschool",
  },
];

function Footer() {
  return (
    <footer className="bg-green-950 px-6 pt-16 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-4">

        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold">
            Greenfield School
          </h2>

          <p className="mt-1 text-sm text-amber-400">
            Raising role models
          </p>

          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
            Providing quality education and helping students
            develop the knowledge, character, and skills they
            need for a brighter future.
          </p>

          {/* Social Media */}
          <div className="mt-6 flex gap-3">
            {socialLinks.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-amber-400 hover:text-green-950"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-amber-400">
            Quick Links
          </h3>

          <ul className="mt-4 space-y-3 text-sm">
            {quickLinks.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-white/70 transition hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Academics */}
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-amber-400">
            Academics
          </h3>

          <ul className="mt-4 space-y-3 text-sm">
            {academicLinks.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className="text-white/70 transition hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-amber-400">
            Contact Us
          </h3>

          <ul className="mt-4 space-y-4 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <MapPin
                size={16}
                className="mt-0.5 shrink-0 text-amber-400"
              />
              <span>Ilorin, Kwara State, Nigeria</span>
            </li>

            <li className="flex items-center gap-2">
              <Phone
                size={16}
                className="shrink-0 text-amber-400"
              />
              <a
                href="tel:+2347041797484"
                className="transition hover:text-white"
              >
                +2347041797484
              </a>
            </li>

            <li className="flex items-center gap-2">
              <Mail
                size={16}
                className="shrink-0 text-amber-400"
              />
              <a
                href="mailto:info@greenfieldschool.com"
                className="transition hover:text-white"
              >
                info@greenfieldschool.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 py-6 text-xs text-white/60 sm:flex-row">
        <p>
          © {new Date().getFullYear()} Greenfield School.
          All rights reserved.
        </p>

        <Link
          to="/privacy-policy"
          className="transition hover:text-white"
        >
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
