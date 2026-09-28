function Input({
    label,
    type = "text",
    placeholder = "",
    value,
    onChange,
    className = "",
}) {
    return (
        <div className="w-full">
            {label && (
                <label className="mb-2 block text-sm font-semibold text-green-950">
                    {label}
                </label>
            )}

            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full rounded-xl border border-green-100 bg-white px-4 py-3 outline-none transition focus:border-green-950 focus:ring-2 focus:ring-green-950/10 ${className}`}
            />
        </div>
    );
}

export default Input;