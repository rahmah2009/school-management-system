import { Link } from "react-router-dom";

function PublicNavbar() {
    return (
        <nav>
            <h2>Greenfield School</h2>

            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>

                <li>
                    <Link to="/about">About</Link>
                </li>

                <li>
                    <Link to="/academics">Academics</Link>
                </li>

                <li>
                    <Link to="teachers">Teacher</Link>
                </li>

                <li>
                    <Link to="/done
                    contact">Contact</Link>
                </li>
            </ul>
        </nav>
    );
}

export default PublicNavbar;