function ValueBlock({ letter, title, description, label, className = "", children }) {
    return (
        <div className={`rounded-3xl border border-white/10 p-6 text-white transition duration-300 hover:-translate-y-2 hover:shadow-xl ${className}`}>

            <span className="block text-7xl font-bold leading-none text-white/30">
                {letter}
            </span>

            {children}

            <h3 className="mt-4 text-2xl font-bold">
                {title}
            </h3>

            <p className="mt-5 leading-7 text-green-100">
                {description}
            </p>

            <p className="mt-6 text-xs font-bold tracking-[0.2em] text-yellow-400">
                {label}
            </p>

        </div>
    );
}

export default ValueBlock;