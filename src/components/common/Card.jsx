function Card({ title, description, children, className = "" }) {
    return (
        <div
            className={`rounded-2xl border border-green-100 bg-white p-6 shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl ${className}`}
        >
            <h3 className="mb-3 text-xl font-bold text-green-950">
                {title}
            </h3>

            <p className="mb-4 leading-7 text-gray-600">
                {description}
            </p>

            {children}
        </div>
    );
}

export default Card;