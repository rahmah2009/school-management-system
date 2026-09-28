function Button({
    children,
    type = "button",
    onClick,
    className = "",
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`rounded-full bg-green-950 px-6 py-3 font-bold text-white transition hover:bg-green-800 ${className}`}
        >
            {children}
        </button>
    );
}

export default Button;