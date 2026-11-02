
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutes

const ACTIVITY_EVENTS = [
    "mousemove",
    "mousedown",
    "keydown",
    "scroll",
    "touchstart",
    "click",
];

export default function useSessionTimeout() {
    const navigate = useNavigate();

    useEffect(() => {
        let timeoutId;

        function logout() {
            sessionStorage.removeItem("greenfield_admin_token");
            sessionStorage.removeItem("greenfield_admin");

            navigate("/login", {
                replace: true,
                state: { sessionExpired: true },
            });
        }

        function resetTimer() {
            window.clearTimeout(timeoutId);
            timeoutId = window.setTimeout(logout, INACTIVITY_LIMIT);
        }

        ACTIVITY_EVENTS.forEach((event) => {
            window.addEventListener(event, resetTimer);
        });

        resetTimer();

        return () => {
            window.clearTimeout(timeoutId);

            ACTIVITY_EVENTS.forEach((event) => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, [navigate]);
}
