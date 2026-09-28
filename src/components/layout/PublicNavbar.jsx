import { Link } from "react-router-dom";
import { useState } from "react";

function PublicNavbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-green-950 px-6 py-4 text-white shadow-md md:px-12">
            <div className="relative mx-auto flex max-w-7xl items-center">

                {/* School Logo */}
                <Link
                    to="/"
                    onClick={() => setMenuOpen(false)}
                    className="text-2xl font-bold text-yellow-400"
                >
                    Greenfield School
                </Link>

                {/* Navigation Links */}
                <ul
                    className={`${menuOpen ? "flex" : "hidden"
                        } absolute right-0 top-full z-50 mt-3 flex-col gap-4 rounded-xl bg-green-950 p-5 shadow-xl
                    md:static md:ml-auto md:flex md:flex-1 md:flex-row md:items-center md:justify-center md:gap-8
                    md:bg-transparent md:p-0 md:shadow-none`}
                >
                    <li>
                        <Link
                            to="/"
                            onClick={() => setMenuOpen(false)}
                        >
                            Home
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/about"
                            onClick={() => setMenuOpen(false)}
                        >
                            About
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/academics"
                            onClick={() => setMenuOpen(false)}
                        >
                            Academics
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/teachers"
                            onClick={() => setMenuOpen(false)}
                        >
                            Teachers
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/contact"
                            onClick={() => setMenuOpen(false)}
                        >
                            Contact
                        </Link>
                    </li>
                </ul>

                {/* Hamburger */}
                <button
                    className="ml-auto cursor-pointer md:hidden"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    ☰
                </button>

            </div>

        </nav>
    );
}

export default PublicNavbar;