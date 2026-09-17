import { useState } from "react";
import PageHero from "../../components/common/PageHero";
import Learning from "../../assets/writing.png";

function Academics() {
    const [selectedClass, setSelectedClass] = useState("JSS 1");
    return (
        <div className="academics-page">

            <div className="md:flex">
                <PageHero
                    className="md:w-1/2"
                    breadcrumb="Academics"
                    eyebrow="ACADEMIC EXCELLENCE"
                    title="Empowering Students Through"
                    highlight="Meaningful Learning"
                    description="At Greenfield School, our academic experience combines strong classroom learning, practical skills, and opportunities that help students develop the knowledge and confidence they need for the future."
                />

                <div className="hidden md:block md:w-1/2 md:h-[420px] lg:h-[650px] relative bg-green-950">
                    <img
                        src={Learning}
                        className="w-full h-full object-cover rounded-tl-4xl rounded-br-4xl">
                    </img>
                </div>
            </div>

            <section className="mx-auto max-w-6xl px-6 py-20">
                <p className="text-sm font-bold tracking-[0.25em] text-yellow-500">
                    OUR CURRICULUM
                </p>
                <h2 className="mt-3 text-4xl font-bold leading-tight text-green-950">
                    Building
                    <span className="text-yellow-500">
                        {" "}Knowledge, Skills, & Confidence
                    </span>
                </h2>
                <p className="mt-6 max-w-2xl leading-8 text-gray-600">
                    Our curriculum is designed to give students a strong academic foundation while developing practical skills, creativity, critical thinking, and confidence
                </p>

                <div className="mt-10">
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setSelectedClass("JSS 1")}
                            className="rounded-full border border-green-950 px-5 py-2 font-semibold text-green-950 transition hover:bg-green-950 hover:text-white"
                        >
                            JSS 1
                        </button>

                        <button
                            onClick={() => setSelectedClass("JSS 2")}
                            className="rounded-full border border-green-950 px-5 py-2 font-semibold text-green-950 transition hover:bg-green-950 hover:text-white"
                        >
                            JSS 2
                        </button>

                        <button
                            onClick={() => setSelectedClass("JSS 3")}
                            className="rounded-full border border-green-950 px-5 py-2 font-semibold text-green-950 transition hover:bg-green-950 hover:text-white"
                        >
                            JSS 3
                        </button>

                        <button
                            onClick={() => setSelectedClass("SS 1")}
                            className="rounded-full border border-green-950 px-5 py-2 font-semibold text-green-950 transition hover:bg-green-950 hover:text-white"
                        >
                            SS 1
                        </button>

                        <button
                            onClick={() => setSelectedClass("SS 2")}
                            className="rounded-full border border-green-950 px-5 py-2 font-semibold text-green-950 transition hover:bg-green-950 hover:text-white"
                        >
                            SS 2
                        </button>

                        <button
                            onClick={() => setSelectedClass("SS 3")}
                            className="rounded-full border border-green-950 px-5 py-2 font-semibold text-green-950 transition hover:bg-green-950 hover:text-white"
                        >
                            SS 3
                        </button>
                    </div>

                    <p className="mt-6 text-lg font-bold text-green-950">
                        Selected Class: {selectedClass}
                    </p>
                </div>
            </section>
        </div>
    );
}

export default Academics;