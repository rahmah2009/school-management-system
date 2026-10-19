import { useEffect, useState } from "react";
import { Mail, Search, Inbox, Check } from "lucide-react";

const MESSAGES_KEY = "greenfield_school_messages";

function readMessages() {
    try {
        const saved = JSON.parse(
            localStorage.getItem(MESSAGES_KEY) || "[]"
        );

        return Array.isArray(saved) ? saved : [];
    } catch {
        return [];
    }
}

function Messages() {
    const [messages, setMessages] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        function refreshMessages() {
            setMessages(readMessages());
        }

        refreshMessages();

        window.addEventListener("focus", refreshMessages);
        window.addEventListener("storage", refreshMessages);
        window.addEventListener(
            "greenfield-messages-updated",
            refreshMessages
        );

        return () => {
            window.removeEventListener("focus", refreshMessages);
            window.removeEventListener("storage", refreshMessages);
            window.removeEventListener(
                "greenfield-messages-updated",
                refreshMessages
            );
        };
    }, []);

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

    const unreadCount = messages.filter(
        (message) => message.isRead === false
    ).length;

    const filteredMessages = messages.filter((message) => {
        const query = search.toLowerCase();

        return (
            String(message.name || "").toLowerCase().includes(query) ||
            String(message.email || "").toLowerCase().includes(query) ||
            String(message.subject || "").toLowerCase().includes(query) ||
            String(message.message || "").toLowerCase().includes(query)
        );
    });

    return (
        <section className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-green-950">
                    Messages
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    View and manage messages received by Greenfield School.
                </p>
            </div>

            {/* Message statistics */}
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Total Messages
                        </p>

                        <Mail className="text-green-800" size={22} />
                    </div>

                    <p className="mt-3 text-3xl font-bold text-green-950">
                        {messages.length}
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Unread Messages
                        </p>

                        <Inbox className="text-yellow-600" size={22} />
                    </div>

                    <p className="mt-3 text-3xl font-bold text-green-950">
                        {unreadCount}
                    </p>
                </div>
            </div>

            {/* Messages list */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                <div className="relative mb-5">
                    <Search
                        size={19}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="search"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search messages..."
                        aria-label="Search messages"
                        className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                    />
                </div>

                {filteredMessages.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 px-4 py-12 text-center">
                        <Mail
                            size={38}
                            className="mx-auto mb-3 text-green-800"
                        />

                        <h2 className="font-semibold text-gray-800">
                            {search
                                ? "No matching messages"
                                : "No messages yet"}
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            {search
                                ? "Try another search term."
                                : "Messages will appear here when someone submits the contact form."}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredMessages.map((message) => {
                            const isUnread = message.isRead === false;

                            return (
                                <article
                                    key={message.id}
                                    className={`py-4 ${
                                        isUnread ? "bg-green-50/60" : ""
                                    }`}
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-green-950">
                                                {message.name ||
                                                    "Unknown sender"}
                                            </h3>

                                            <p className="break-all text-sm text-gray-500">
                                                {message.email ||
                                                    "No email provided"}
                                            </p>
                                        </div>

                                        {isUnread && (
                                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                                                Unread
                                            </span>
                                        )}
                                    </div>

                                    <h4 className="mt-3 font-medium text-gray-800">
                                        {message.subject || "No subject"}
                                    </h4>

                                    <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-600">
                                        {message.message || ""}
                                    </p>

                                    {message.createdAt && (
                                        <p className="mt-3 text-xs text-gray-400">
                                            {new Date(
                                                message.createdAt
                                            ).toLocaleString()}
                                        </p>
                                    )}

                                    {isUnread && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                markAsRead(message.id)
                                            }
                                            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-green-800 px-3 py-2 text-sm font-semibold text-green-900 transition hover:bg-green-50"
                                        >
                                            <Check size={16} />
                                            Mark as read
                                        </button>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}

export default Messages;
