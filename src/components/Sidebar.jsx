function Sidebar(props) {
    return (
        <div className="sidebar">
            <h3>🏫{props.schoolName}</h3>
            <ul>
                <li
                    className={props.activePage === "Dashboard" ? "active" : ""}
                    onClick={() => props.setActivePage("Dashboard")}>Dashboard
                </li>

                <li
                    className={props.activePage === "Students" ? "active" : ""}
                    onClick={() => props.setActivePage("Students")}>Students
                </li>

                <li
                    className={props.activePage === "Add Student" ? "active" : ""}
                    onClick={() => props.setActivePage("Add Student")}>Add Student
                </li>

                <li
                    className={props.activePage === "Teachers" ? "active" : ""}
                    onClick={() => props.setActivePage("Teachers")}>Teachers
                </li>

                <li
                    className={props.activePage === "Classes" ? "active" : ""}
                    onClick={() => props.setActivePage("Classes")}>Classes
                </li>

                <li
                    className={props.activePage === "Results" ? "active" : ""}
                    onClick={() => props.setActivePage("Results")}>Results
                </li>

                <li
                    className={props.activePage === "Sessions" ? "active" : ""}
                    onClick={() => props.setActivePage("Sessions")}>Sessions
                </li>

                <li
                    className={props.activePage === "Settings" ? "active" : ""}
                    onClick={() => props.setActivePage("Settings")}>Settings
                </li>
            </ul>
        </div>
    )
}

export default Sidebar