import classesData from "../../data/classes";

function Classes() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-green-950">
                Classes
            </h1>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {classesData.map((schoolClass) => (
                    <div
                        key={schoolClass}
                        className="rounded-2xl border border-green-100 bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
                    >
                        <h2 className="text-xl font-bold text-green-950">
                            {schoolClass}
                        </h2>

                        <p className="mt-2 text-sm text-gray-600">
                            Manage students in {schoolClass}.
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Classes;