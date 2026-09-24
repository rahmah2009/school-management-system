import { useState } from "react";
import { Link } from "react-router-dom";
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
            {
                title: "Computer Basics",
                description:
                    "Students learn the basic parts of a computer and how to use them effectively.",
            },
            {
                title: "Introduction to Coding",
                description:
                    "Students are introduced to programming concepts and learn how simple code works.",
            },
            {
                title: "Communication",
                description:
                    "Students develop effective communication skills through speaking, writing, and classroom activities.",
            },
            {
                title: "Creativity & Teamwork",
                description:
                    "Students develop creativity while learning how to collaborate and solve problems together.",
            },
        ],

        "JSS 2": [
            {
                title: "Digital Skills",
                description:
                    "Students improve their ability to use computers and digital tools for learning and everyday tasks.",
            },
            {
                title: "HTML & CSS",
                description:
                    "Students learn the basics of creating and styling simple web pages using HTML and CSS.",
            },
            {
                title: "Basic Programming",
                description:
                    "Students build a stronger understanding of programming concepts through simple practical exercises.",
            },
            {
                title: "Problem-Solving",
                description:
                    "Students learn how to break down challenges and develop logical solutions.",
            },
            {
                title: "Research & Practical Projects",
                description:
                    "Students apply their knowledge through research activities and practical projects.",
            },
        ],

        "JSS 3": [
            {
                title: "Exam Preparation",
                description:
                    "Students strengthen their knowledge and prepare effectively for important examinations.",
            },
            {
                title: "Web Development Projects",
                description:
                    "Students apply their web development knowledge by creating practical projects.",
            },
            {
                title: "Leadership & Teamwork",
                description:
                    "Students develop leadership qualities and learn how to work effectively with others.",
            },
            {
                title: "Digital Skills",
                description:
                    "Students strengthen their digital abilities and learn to use technology confidently.",
            },
            {
                title: "Advanced Problem-Solving",
                description:
                    "Students tackle more challenging problems and develop stronger logical thinking skills.",
            },
        ],

        "SS 1": {
            Science: [
                {
                    title: "Programming",
                    description:
                        "Students develop programming knowledge and learn how to create simple software solutions.",
                },
                {
                    title: "Web Development",
                    description:
                        "Students learn how websites are built and develop practical web development skills.",
                },
                {
                    title: "Laboratory Practice",
                    description:
                        "Students apply scientific concepts through practical laboratory activities and experiments.",
                },
                {
                    title: "Research & Technology",
                    description:
                        "Students explore technology and develop research skills through practical learning.",
                },
            ],

            Commercial: [
                {
                    title: "Entrepreneurship",
                    description:
                        "Students learn how business ideas are developed and how entrepreneurs identify opportunities.",
                },
                {
                    title: "Accounting Practice",
                    description:
                        "Students develop practical skills in recording, organising, and understanding financial information.",
                },
                {
                    title: "Business Skills",
                    description:
                        "Students develop useful business knowledge, decision-making skills, and professional habits.",
                },
                {
                    title: "Digital Skills",
                    description:
                        "Students learn how digital tools can support business activities and productivity.",
                },
            ],

            Arts: [
                {
                    title: "Writing & Communication",
                    description:
                        "Students develop stronger writing skills and learn how to communicate ideas clearly.",
                },
                {
                    title: "Public Speaking",
                    description:
                        "Students build confidence by practising presentations and expressing their ideas clearly.",
                },
                {
                    title: "Research",
                    description:
                        "Students learn how to gather, organise, and present information effectively.",
                },
                {
                    title: "Creative Expression",
                    description:
                        "Students explore creative ways to express ideas through writing, art, and other activities.",
                },
            ],
        },

        "SS 2": {
            Science: [
                {
                    title: "Advanced Programming",
                    description:
                        "Students deepen their programming knowledge and work with more advanced programming concepts.",
                },
                {
                    title: "Web Development Projects",
                    description:
                        "Students build practical websites and apply their web development knowledge to projects.",
                },
                {
                    title: "Research & Technology",
                    description:
                        "Students explore technological ideas while developing stronger research and analytical skills.",
                },
                {
                    title: "Problem-Solving",
                    description:
                        "Students solve more complex challenges using logical and structured thinking.",
                },
            ],

            Commercial: [
                {
                    title: "Entrepreneurship",
                    description:
                        "Students explore business ideas, planning, innovation, and the skills needed to start a venture.",
                },
                {
                    title: "Business Projects",
                    description:
                        "Students apply business concepts through practical projects and real-world scenarios.",
                },
                {
                    title: "Financial Skills",
                    description:
                        "Students develop practical knowledge of financial concepts and responsible decision-making.",
                },
                {
                    title: "Digital Business Tools",
                    description:
                        "Students learn how digital technologies can improve business operations and productivity.",
                },
            ],

            Arts: [
                {
                    title: "Advanced Writing",
                    description:
                        "Students improve their writing skills through more advanced composition and communication activities.",
                },
                {
                    title: "Research & Presentation",
                    description:
                        "Students learn how to conduct research and confidently present their findings.",
                },
                {
                    title: "Public Speaking",
                    description:
                        "Students strengthen their confidence and communication skills through presentations and discussions.",
                },
                {
                    title: "Creative Projects",
                    description:
                        "Students use creativity to develop projects that demonstrate their ideas and skills.",
                },
            ],
        },

        "SS 3": {
            Science: [
                {
                    title: "Software & Web Projects",
                    description:
                        "Students apply their technical knowledge to build practical software and web-based projects.",
                },
                {
                    title: "Advanced Problem-Solving",
                    description:
                        "Students tackle challenging problems and develop strong analytical and logical thinking skills.",
                },
                {
                    title: "Research & Technology",
                    description:
                        "Students conduct research and explore how technology can be applied to solve real-world problems.",
                },
                {
                    title: "Project Development",
                    description:
                        "Students plan, develop, and present practical projects that demonstrate their knowledge.",
                },
            ],

            Commercial: [
                {
                    title: "Business Projects",
                    description:
                        "Students apply business knowledge by planning and developing practical business projects.",
                },
                {
                    title: "Entrepreneurship",
                    description:
                        "Students develop entrepreneurial thinking and learn how to turn ideas into practical opportunities.",
                },
                {
                    title: "Financial Analysis",
                    description:
                        "Students develop skills for analysing financial information and making informed business decisions.",
                },
                {
                    title: "Career Preparation",
                    description:
                        "Students develop knowledge and skills that help prepare them for future education and career opportunities.",
                },
            ],

            Arts: [
                {
                    title: "Research Projects",
                    description:
                        "Students conduct detailed research and present their findings in a clear and organised way.",
                },
                {
                    title: "Public Speaking",
                    description:
                        "Students develop confidence and strong communication skills through presentations and discussions.",
                },
                {
                    title: "Creative Expression",
                    description:
                        "Students explore different creative approaches to communicate ideas and express themselves.",
                },
                {
                    title: "Examination Preparation",
                    description:
                        "Students review important concepts and prepare systematically for their final examinations.",
                },
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

    const coCurricularActivities = [
        {
            title: "Clubs & Societies",
            description: "Students participate in clubs and societies that help them discover their interests, develop creativity, and build teamwork and leadership skills.",
        },
        {
            title: "Sports",
            description: "Students take part in sports activities that promote teamwork, discipline, confidence, and healthy development.",
        },
        {
            title: "Summer School",
            description: "Students participate in engaging summer programmes that support learning, creativity, practical skills, and personal development.",
        },
        {
            title: "School Trips",
            description: "Students take part in educational trips that provide real-world experiences, encourage exploration, and make learning more engaging.",
        },
    ];

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
                                key={focus.title}
                                title={focus.title}
                                description={focus.description}
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

            <section className="mx-auto max-w-6xl px-6 ">

                <p className="text-sm font-bold tracking-[0.25em] text-yellow-500">
                    CO-CURRICULAR ACTIVITIES
                </p>

                <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {coCurricularActivities.map((activity) => (
                        <Card
                            key={activity.title}
                            title={activity.title}
                            description={activity.description}
                        />
                    ))}
                </div>
            </section>

            {/* ACADEMIC CTA */}
            {/* ACADEMIC CTA */}
            <section className="mt-15 bg-green-50 px-6 py-20">
                <div className="mx-auto max-w-4xl text-center">

                    <p className="text-sm font-bold tracking-[0.25em] text-yellow-500">
                        START YOUR JOURNEY
                    </p>

                    <h2 className="mt-3 text-4xl font-bold text-green-950">
                        Ready to Learn,{" "} <span className="text-yellow-500">Grow & Succeed?</span>
                    </h2>

                    <p className="mx-auto mt-6 max-w-2xl leading-8 text-gray-400">
                        Discover how Greenfield School combines academic excellence,
                        practical skills, and meaningful experiences to help every
                        student reach their potential.
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">

                        <Link
                            to="/about"
                            className="rounded-full bg-green-950 px-6 py-3 font-bold text-white transition hover:bg-green-800"
                        >
                            Learn More About Us
                        </Link>

                        <Link
                            to="/teachers"
                            className="rounded-full border-2 border-green-950 px-6 py-3 font-bold text-green-950 transition hover:bg-green-950 hover:text-white"
                        >
                            Meet Our Teachers
                        </Link>

                        <Link
                            to="/contact"
                            className="rounded-full border-2 border-green-950 px-6 py-3 font-bold text-green-950 transition hover:bg-green-950 hover:text-white"
                        >
                            Contact the School
                        </Link>

                    </div>


                </div>
            </section>
        </div>
    );
}

export default Academics;
