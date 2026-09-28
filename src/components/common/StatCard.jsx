import { Link } from "react-router-dom";

function StatCard({ title, value, icon, link }) {
    return (
        <Link
            to={link}
            className="block rounded-2xl border border-green-100 bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-gray-500">
                        {title}
                    </h3>

                    <p className="mt-3 text-3xl font-bold text-green-950">
                        {value}
                    </p>
                </div>

                <div className="text-3xl text-green-950">
                    {icon}
                </div>
            </div>
        </Link>
    );
}

export default StatCard;