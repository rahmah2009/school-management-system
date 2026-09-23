import { useState } from "react";
import PageHero from "../../components/common/PageHero";
import Card from "../../components/common/Card";
import Learning from "../../assets/writing.png";

function Academics() {
    const [selectedStream, setSelectedStream] = useState("Science");
    const [selectedClass, setSelectedClass] = useState("JSS 1");

    const activeClass =
        "rounded-full bg-green-950 px-5 py-2 font-semibold text-white";

    const inactiveClass =
        "rounded-full border border-green-950 px-5 py-2 font-semibold text-green-950 transition hover:bg-green-950 hover:text-white";

    const classFocus = {
        "JSS 1": [
            "Computer Basics",
            "Introduction to Coding",
            "Communication",
            "Creativity & Teamwork",
        ],

        "JSS 2": [
            "Digital Skills",
            "HTML & CSS",
            "Basic Programming",
            "Problem-Solving",
            "Research & Practical Projects",
        ],

        "JSS 3": [
            "Exam Preparation",
            "Web Development Projects",
            "Leadership & Teamwork",
            "Digital Skills",
            "Advanced Problem-Solving",
        ],

        "SS 1": {
            Science: [
                "Programming",
                "Web Development",
                "Laboratory Practice",
                "Research & Technology",
            ],
            Commercial: [
                "Entrepreneurship",
                "Accounting Practice",
                "Business Skills",
                "Digital Skills",
            ],
            Arts: [
                "Writing & Communication",
                "Public Speaking",
                "Research",
                "Creative Expression",
            ],
        },

        "SS 2": {
            Science: [
                "Advanced Programming",
                "Web Development Projects",
                "Research & Technology",
                "Problem-Solving",
            ],
            Commercial: [
                "Entrepreneurship",
                "Business Projects",
                "Financial Skills",
                "Digital Business Tools",
            ],
            Arts: [
                "Advanced Writing",
                "Research & Presentation",
                "Public Speaking",
                "Creative Projects",
            ],
        },

        "SS 3": {
            Science: [
                "Software & Web Projects",
                "Advanced Problem-Solving",
                "Research & Technology",
                "Project Development",
            ],
            Commercial: [
                "Business Projects",
                "Entrepreneurship",
                "Financial Analysis",
                "Career Preparation",
            ],
            Arts: [
                "Research Projects",
                "Public Speaking",
                "Creative Expression",
                "Examination Preparation",
            ],
        },
    };

    const practicalSkills = [
        {
            title: "Coding & Digital Skills",
            description:
                "Students develop programming skills, build websites, and learn how to use digital tools effectively.",
        },
        {
            title: "Creative Design",
            description:
                "Students explore creativity through design, digital projects, and creative problem-solving.",
        },
        {
            title: "Communication",
            description:
                "Students build confidence through presentations, public speaking, writing, and effective communication.",
        },
        {
            title: "Practical & Project Work",
            description:
                "Students apply what they learn through practical activities, research, and meaningful projects.",
        },
        {
            title: "Entrepreneurship",
            description:
                "Students learn how to develop ideas, understand business concepts, and think entrepreneurially.",
        },
        {
            title: "Critical Thinking & Problem-Solving",
            description:
                "Students learn to analyse challenges, think creatively, and develop practical solutions.",
        },
        {
            title: "Leadership & Teamwork",
            description:
                "Students develop leadership qualities while learning how to collaborate and contribute effectively in teams.",
        },
    ];

    const schoolCalendar = [
        {
            month: "September",
            event: "Resumption",
            description:
                "Students return to school and begin the new academic session.",
        },
        {
            month: "October",
            event: "Academic Activities",
            description:
                "Regular classes, projects, practical activities, and continuous learning take place.",
        },
        {
            month: "November",
            event: "Mid-Term Activities",
            description:
                "Students participate in academic activities and assessments as part of the term.",
        },
        {
            month: "December",
            event: "End of Term",
            description:
                "The first term concludes with examinations, reports, and the holiday break.",
        },
        {
            month: "January",
            event: "Second Term Resumption",
            description:
                "Students return from the holiday and continue their academic programme.",
        },
        {
            month: "March",
            event: "Second Term Activities",
            description:
                "Students continue academic work, practical projects, and school activities.",
        },
        {
            month: "April",
            event: "End of Second Term",
            description:
                "The second term comes to an end with assessments and preparation for the break.",
        },
        {
            month: "May",
            event: "Third Term Resumption",
            description:
                "Students resume for the final term of the academic session.",
        },
        {
            month: "July",
            event: "Final Assessments",
            description:
                "Students complete final assessments and prepare for the end of the academic session.",
        },
        {
            month: "August",
            event: "Long Vacation",
            description:
                "Students begin their long vacation while the school prepares for the next session.",
        },
    ];

    const selectedFocus = selectedClass.startsWith("SS")
        ? classFocus[selectedClass][selectedStream]
        : classFocus[selectedClass];

    return (
        <div className="academics-page">

            {/* HERO */}
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
                        alt="Students learning at Greenfield School"
                        className="w-full h-full object-cover rounded-tl-4xl rounded-br-4xl"
                    />
                </div>
            </div>

            {/* CURRICULUM */}
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
                    Our curriculum is designed to give students a strong academic
                    foundation while developing practical skills, creativity,
                    critical thinking, and confidence.
                </p>

                {/* CLASS SELECTOR */}
                <div className="mt-10">

                    <div className="flex flex-wrap gap-3">

                        <button
                            onClick={() => setSelectedClass("JSS 1")}
                            className={
                                selectedClass === "JSS 1"
                                    ? activeClass
                                    : inactiveClass
                            }
                        >
                            JSS 1
                        </button>

                        <button
                            onClick={() => setSelectedClass("JSS 2")}
                            className={
                                selectedClass === "JSS 2"
                                    ? activeClass
                                    : inactiveClass
                            }
                        >
                            JSS 2
                        </button>

                        <button
                            onClick={() => setSelectedClass("JSS 3")}
                            className={
                                selectedClass === "JSS 3"
                                    ? activeClass
                                    : inactiveClass
                            }
                        >
                            JSS 3
                        </button>

                        <button
                            onClick={() => setSelectedClass("SS 1")}
                            className={
                                selectedClass === "SS 1"
                                    ? activeClass
                                    : inactiveClass
                            }
                        >
                            SS 1
                        </button>

                        <button
                            onClick={() => setSelectedClass("SS 2")}
                            className={
                                selectedClass === "SS 2"
                                    ? activeClass
                                    : inactiveClass
                            }
                        >
                            SS 2
                        </button>

                        <button
                            onClick={() => setSelectedClass("SS 3")}
                            className={
                                selectedClass === "SS 3"
                                    ? activeClass
                                    : inactiveClass
                            }
                        >
                            SS 3
                        </button>

                        {/* STREAM SELECTOR */}
                        {selectedClass.startsWith("SS") && (
                            <select
                                value={selectedStream}
                                onChange={(e) =>
                                    setSelectedStream(e.target.value)
                                }
                                className="rounded-full border border-green-950 bg-white px-5 py-2 font-semibold text-green-950 outline-none focus:ring-2 focus:ring-yellow-400"
                            >
                                <option value="Science">Science</option>
                                <option value="Commercial">Commercial</option>
                                <option value="Arts">Arts</option>
                            </select>
                        )}

                    </div>

                    {/* SELECTED CLASS HEADING */}
                    <p className="mt-6 text-lg font-bold text-green-950">
                        {selectedClass.startsWith("SS")
                            ? `${selectedClass} — ${selectedStream} Learning Focus`
                            : `${selectedClass} Learning Focus`}
                    </p>

                    {/* LEARNING FOCUS CARDS */}
                    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                        {selectedFocus?.map((focus) => (
                            <Card
                                key={focus}
                                title={focus}
                                description="Developing knowledge and practical skills through meaningful learning experiences."
                            />
                        ))}

                    </div>

                </div>
            </section>

            {/* PRACTICAL SKILLS */}
            <section className="bg-green-50 px-6 py-20">

                <div className="mx-auto max-w-6xl">

                    <p className="text-sm font-bold tracking-[0.25em] text-yellow-500">
                        PRACTICAL SKILLS
                    </p>

                    <h2 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-green-950">
                        Skills
                        <span className="text-yellow-500">
                            {" "}Beyond the Classroom
                        </span>
                    </h2>

                    <p className="mt-6 max-w-2xl leading-8 text-gray-600">
                        We believe education should prepare students not only to
                        succeed academically, but also to create, communicate,
                        solve problems, and work confidently with others.
                    </p>

                    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                        {practicalSkills.map((skill) => (
                            <Card
                                key={skill.title}
                                title={skill.title}
                                description={skill.description}
                            />
                        ))}

                    </div>

                </div>
            </section>

            {/* SCHOOL CALENDAR */}
            <section className="mx-auto max-w-6xl px-6 py-20">

                <div className="max-w-3xl">

                    <p className="text-sm font-bold tracking-[0.25em] text-yellow-500">
                        SCHOOL CALENDAR
                    </p>

                    <h2 className="mt-3 text-4xl font-bold leading-tight text-green-950">
                        Important
                        <span className="text-yellow-500">
                            {" "}Academic Events
                        </span>
                    </h2>

                    <p className="mt-6 leading-8 text-gray-600">
                        Stay informed about important academic activities,
                        school events, assessments, and holidays throughout
                        the academic session.
                    </p>

                </div>

                {/* CALENDAR */}
                <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                    {schoolCalendar.map((item) => (
                        <Card
                            key={`${item.month}-${item.event}`}
                            title={item.event}
                            description={item.description}
                        >
                            <p className="text-sm font-bold uppercase tracking-widest text-yellow-500">
                                {item.month}
                            </p>
                        </Card>
                    ))}

                </div>

            </section>

            <section className="mx-auto max-w-6xl px-6 py-20">

                <p className="text-sm font-bold tracking-[0.25em] text-yellow-500">
                    CO-CURRICULAR ACTIVITIES
                </p>

                <h2 className="mt-3 text-4xl font-bold leading-tight text-green-950">
                    Growing
                    <span className="text-yellow-500">
                        {" "}Beyond the Classroom
                    </span>
                </h2>

                <p className="mt-6 max-w-2xl leading-8 text-gray-600">
                    Students have opportunities to discover their interests,
                    develop new skills, build confidence, and work with others.
                </p>

                <div className="mt-10 max-w-md">
                    <Card
                        title="Clubs & Societies"
                        description="Students participate in clubs and societies that help them discover their interests, develop creativity, and build teamwork and leadership skills."
                    />
                </div>

            </section>

        </div>
    );
}

export default Academics;
