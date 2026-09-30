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
                    className={`${
                        menuOpen ? "flex" : "hidden"
                    } absolute right-0 top-full z-50 mt-3 w-56 flex-col gap-2 rounded-xl bg-green-950 p-4 shadow-xl
                    md:static md:ml-auto md:flex md:w-auto md:flex-1 md:flex-row md:items-center md:justify-center md:gap-8
                    md:bg-transparent md:p-0 md:shadow-none`}
                >
                    <li>
                        <Link
                            to="/"
                            onClick={() => setMenuOpen(false)}
                            className="block rounded-lg px-4 py-2 hover:bg-green-900 md:px-0 md:py-0 md:hover:bg-transparent"
                        >
                            Home
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/about"
                            onClick={() => setMenuOpen(false)}
                            className="block rounded-lg px-4 py-2 hover:bg-green-900 md:px-0 md:py-0 md:hover:bg-transparent"
                        >
                            About
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/academics"
                            onClick={() => setMenuOpen(false)}
                            className="block rounded-lg px-4 py-2 hover:bg-green-900 md:px-0 md:py-0 md:hover:bg-transparent"
                        >
                            Academics
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/teachers"
                            onClick={() => setMenuOpen(false)}
                            className="block rounded-lg px-4 py-2 hover:bg-green-900 md:px-0 md:py-0 md:hover:bg-transparent"
                        >
                            Teachers
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/contact"
                            onClick={() => setMenuOpen(false)}
                            className="block rounded-lg px-4 py-2 hover:bg-green-900 md:px-0 md:py-0 md:hover:bg-transparent"
                        >
                            Contact
                        </Link>
                    </li>

                    {/* Login */}
                    <li className="pt-2 md:pt-0">
                        <Link
                            to="/login"
                            onClick={() => setMenuOpen(false)}
                            className="block rounded-full bg-yellow-400 px-5 py-2 text-center font-bold text-green-950 transition hover:bg-yellow-300"
                        >
                            Login
                        </Link>
                    </li>
                </ul>

                {/* Hamburger */}
                <button
                    type="button"
                    aria-label="Toggle navigation menu"
                    aria-expanded={menuOpen}
                    className="ml-auto cursor-pointer rounded-lg px-2 py-1 text-2xl hover:bg-green-900 md:hidden"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    ☰
                </button>

            </div>
        </nav>
    );
}

export default PublicNavbar;