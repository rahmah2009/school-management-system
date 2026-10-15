import { useEffect, useState } from "react";
import {
    Menu,
    Bell,
    Mail,
    Check,
    Inbox,
    FileCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const MESSAGES_KEY = "greenfield_school_messages";
const RESULTS_KEY = "greenfield_school_results";
const STUDENTS_KEY = "greenfield_school_students";

function readStorage(key) {
    try {
        const saved = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(saved) ? saved : [];
    } catch {
        return [];
    }
}

function AdminHeader({ onMenuClick }) {
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [results, setResults] = useState([]);
    const [students, setStudents] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        function refreshNotifications() {
            setMessages(readStorage(MESSAGES_KEY));
            setResults(readStorage(RESULTS_KEY));
            setStudents(readStorage(STUDENTS_KEY));
        }

        refreshNotifications();

        window.addEventListener("focus", refreshNotifications);
        window.addEventListener("storage", refreshNotifications);
        window.addEventListener(
            "greenfield-messages-updated",
            refreshNotifications
        );
        window.addEventListener(
            "greenfield-results-updated",
            refreshNotifications
        );

        return () => {
            window.removeEventListener("focus", refreshNotifications);
            window.removeEventListener("storage", refreshNotifications);
            window.removeEventListener(
                "greenfield-messages-updated",
                refreshNotifications
            );
            window.removeEventListener(
                "greenfield-results-updated",
                refreshNotifications
            );
        };
    }, []);

    const unreadMessages = messages.filter(
        (message) => message.isRead === false
    );

    // A submitted result stays in the notification list
    // until its status changes to approved or returned.
    const submittedResults = results.filter(
        (result) =>
            String(result.status || "").toLowerCase() === "submitted"
    );

    const notifications = [
        ...unreadMessages.map((message) => ({
            ...message,
            notificationType: "message",
            notificationDate: message.createdAt,
        })),

        ...submittedResults.map((result, index) => {
            const student = students.find(
                (item) =>
                    String(item.id) === String(result.studentId)
            );

            return {
                ...result,
                notificationType: "result",
                notificationId: `result-${result.id ?? index}`,
                studentName:
                    result.studentName ||
                    result.student?.name ||
                    student?.name ||
                    "Unknown student",
                studentClass:
                    result.className ||
                    result.student?.className ||
                    student?.className ||
                    "",
                notificationDate:
                    result.submittedAt ||
                    result.updatedAt ||
                    result.createdAt ||
                    "",
            };
        }),
    ].sort((a, b) => {
        const dateA = Date.parse(a.notificationDate || "") || 0;
        const dateB = Date.parse(b.notificationDate || "") || 0;
        return dateB - dateA;
    });

    function openMessagesPage() {
        setIsOpen(false);
        navigate("/admin/messages");
    }

    function openResultsPage() {
        setIsOpen(false);
        navigate("/admin/results");
    }

    function markAsRead(messageId) {
        const updatedMessages = messages.map((message) =>
            String(message.id) === String(messageId)
                ? { ...message, isRead: true }
                : message
        );

        try {
            localStorage.setItem(
                MESSAGES_KEY,
                JSON.stringify(updatedMessages)
            );

            setMessages(updatedMessages);

            window.dispatchEvent(
                new Event("greenfield-messages-updated")
            );
        } catch (error) {
            console.error("Could not update message:", error);
        }
    }

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm md:px-8">
            {/* Left side */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="rounded-lg p-2 text-green-950 transition hover:bg-green-50 md:hidden"
                    aria-label="Open menu"
                >
                    <Menu size={24} />
                </button>

                <div>
                    <h2 className="text-lg font-bold text-green-950">
                        Admin Dashboard
                    </h2>

                    <p className="hidden text-sm text-gray-500 sm:block">
                        Manage Greenfield School
                    </p>
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
                <div className="hidden items-center sm:flex">
                    <span className="text-lg font-bold text-green-950">
                        Greenfield School
                    </span>
                </div>

                {/* Notifications */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsOpen((open) => !open)}
                        className="relative rounded-lg p-2 text-gray-600 transition hover:bg-gray-100"
                        aria-label={`Notifications, ${notifications.length} pending`}
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                    >
                        <Bell size={22} />

                        {notifications.length > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white">
                                {notifications.length > 99
                                    ? "99+"
                                    : notifications.length}
                            </span>
                        )}
                    </button>

                    {isOpen && (
                        <>
                            <button
                                type="button"
                                aria-label="Close notifications"
                                className="fixed inset-0 z-40 cursor-default"
                                onClick={() => setIsOpen(false)}
                            />

                            <div className="absolute right-0 z-50 mt-3 w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
                                    <div>
                                        <h3 className="font-bold text-green-950">
                                            Notifications
                                        </h3>

                                        <p className="mt-1 text-xs text-gray-500">
                                            {unreadMessages.length} unread message
                                            {unreadMessages.length === 1
                                                ? ""
                                                : "s"}{" "}
                                            · {submittedResults.length} result
                                            {submittedResults.length === 1
                                                ? ""
                                                : "s"}{" "}
                                            awaiting review
                                        </p>
                                    </div>

                                    <Bell
                                        size={21}
                                        className="text-green-800"
                                    />
                                </div>

                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="px-4 py-9 text-center">
                                            <Inbox
                                                size={32}
                                                className="mx-auto mb-2 text-gray-400"
                                            />

                                            <p className="font-medium text-gray-700">
                                                You're all caught up!
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                New messages and submitted
                                                results will appear here.
                                            </p>
                                        </div>
                                    ) : (
                                        notifications
                                            .slice(0, 10)
                                            .map((notification) => {
                                                const isResult =
                                                    notification.notificationType ===
                                                    "result";

                                                return (
                                                    <div
                                                        key={
                                                            isResult
                                                                ? notification.notificationId
                                                                : `message-${notification.id}`
                                                        }
                                                        className="border-b border-gray-100 p-4 transition hover:bg-green-50"
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                isResult
                                                                    ? openResultsPage
                                                                    : openMessagesPage
                                                            }
                                                            className="w-full text-left"
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <span className="rounded-lg bg-green-100 p-2 text-green-800">
                                                                    {isResult ? (
                                                                        <FileCheck
                                                                            size={19}
                                                                        />
                                                                    ) : (
                                                                        <Mail
                                                                            size={19}
                                                                        />
                                                                    )}
                                                                </span>

                                                                <div className="min-w-0 flex-1">
                                                                    <p className="text-sm font-semibold text-green-950">
                                                                        {isResult
                                                                            ? "Result submitted for review"
                                                                            : notification.name ||
                                                                              "New message"}
                                                                    </p>

                                                                    <p className="mt-1 text-sm text-gray-700">
                                                                        {isResult
                                                                            ? notification.studentName
                                                                            : notification.subject ||
                                                                              notification.message ||
                                                                              "Open to view message"}
                                                                    </p>

                                                                    {isResult && (
                                                                        <p className="mt-1 text-xs text-gray-500">
                                                                            {[
                                                                                notification.studentClass,
                                                                                notification.term,
                                                                                notification.session,
                                                                            ]
                                                                                .filter(Boolean)
                                                                                .join(" · ") ||
                                                                                "Awaiting review"}
                                                                        </p>
                                                                    )}

                                                                    {notification.notificationDate && (
                                                                        <p className="mt-1 text-xs text-gray-400">
                                                                            {new Date(
                                                                                notification.notificationDate
                                                                            ).toLocaleString()}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </button>

                                                        {!isResult && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    markAsRead(
                                                                        notification.id
                                                                    )
                                                                }
                                                                className="ml-12 mt-2 inline-flex items-center gap-1 text-xs font-semibold text-green-800 hover:text-green-950"
                                                            >
                                                                <Check size={14} />
                                                                Mark as read
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            })
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-2 border-t border-gray-100 p-3">
                                    <button
                                        type="button"
                                        onClick={openMessagesPage}
                                        className="rounded-lg border border-green-800 px-3 py-2.5 text-sm font-semibold text-green-900 transition hover:bg-green-50"
                                    >
                                        View messages
                                    </button>

                                    <button
                                        type="button"
                                        onClick={openResultsPage}
                                        className="rounded-lg bg-green-900 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-green-950"
                                    >
                                        Review results
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default AdminHeader;
