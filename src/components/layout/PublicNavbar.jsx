import { Link } from "react-router-dom";
import { useState } from "react";

function PublicNavbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <nav className="bg-green-950 px-6 py-4 text-white shadow-md md:px-12">            <Link to="/" className="text-2xl font-bold text-yellow-400">
            Greenfield School
        </Link>

            <ul
                className={`${menuOpen ? "flex" : "hidden"
                    } flex-col gap-4 md:flex md:flex-row md:items-center md:gap-6`}
            >                <li>
                    <Link to="/">Home</Link>
                </li>

                <li>
                    <Link to="/about">About</Link>
                </li>

                <li>
                    <Link to="/academics">Academics</Link>
                </li>

                <li>
                    <Link to="/teachers">Teachers</Link>
                </li>

                <li>
                    <Link to="/contact">Contact</Link>
                </li>
            </ul>
            <button
                className="md:hidden"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                ☰
            </button>


        </nav>
    );
}

export default PublicNavbar; ``