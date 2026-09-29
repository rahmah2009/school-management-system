function Button({
    children,
    type = "button",
    onClick,
    className = "",
    variant = "primary",
}) {
    const variants = {
        primary: "bg-green-950 hover:bg-green-800",
        danger: "bg-red-600 hover:bg-red-700",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`rounded-full px-6 py-3 font-bold text-white transition ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
}

export default Button;