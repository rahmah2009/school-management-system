import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar"
import Footer from "./Footer";

function PublicLayout() {
    return (
        <>
            <PublicNavbar />

            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}

export default PublicLayout