import { useState } from "react";
import PageHero from "../../components/common/PageHero"; import Card from "../../components/common/Card";
import Learning from "../../assets/writing.png";
import { Link } from "react-router-dom";

function Teachers() {
    const [selectedDepartment, setSelectedDepartment] = useState("All");
    const teachers = [
        {
            name: "Mr. Bidemi",
            subject: "Mathematics",
            department: "Science & Mathematics",
            description:
                "Helps students develop strong mathematical understanding, logical thinking, and problem-solving skills.",
        },
        {
            name: "Mrs. Ahmad",
            subject: "English Language",
            department: "Arts & Humanities",
            description:
                "Supports students in developing strong communication, writing, reading, and presentation skills.",
        },
        {
            name: "Mr. AbulRahman",
            subject: "Computer Science",
            department: "Science & Technology",
            description:
                "Guides students in developing digital skills, programming knowledge, and practical technology skills.",
        },
        {
            name: "Mr. Kamaldeen",
            subject: "Business Studies",
            department: "Commercial Studies",
            description:
                "Helps students understand business concepts while developing practical and entrepreneurial thinking.",
        },
        {
            name: "Mrs. Adeleke",
            subject: "General Studies",
            department: "Arts & Humanities",
            description:
                "Encourages students to build confidence, communicate effectively, and develop a broad understanding of important subjects.",
        },
        {
            name: "Mr. Ibrahim",
            subject: "Physics",
            department: "Science & Technology",
            description:
                "Helps students understand physical concepts through explanations, experiments, and practical activities.",
        },
        {
            name: "Mrs. Fatima",
            subject: "Chemistry",
            department: "Science & Technology",
            description:
                "Guides students through chemistry concepts and practical activities that connect theory with real-world applications.",
        },
        {
            name: "Mr. Yusuf",
            subject: "Biology",
            department: "Science & Technology",
            description:
                "Helps students explore living systems and understand important biological concepts.",
        },
        {
            name: "Mrs. Maryam",
            subject: "Literature",
            department: "Arts & Humanities",
            description:
                "Encourages students to explore literature, creativity, reading, and thoughtful interpretation.",
        },
        {
            name: "Mr. Hassan",
            subject: "Economics",
            department: "Commercial Studies",
            description:
                "Helps students understand economic concepts and how they relate to everyday life and society.",
        },
        {
            name: "Mrs. Zainab",
            subject: "Government",
            department: "Arts & Humanities",
            description:
                "Introduces students to government, civic responsibilities, and important concepts about society.",
        },
        {
            name: "Mr. Suleiman",
            subject: "Geography",
            department: "Arts & Humanities",
            description:
                "Helps students understand people, places, environments, and the relationship between communities and their surroundings.",
        },
        {
            name: "Mrs. Aisha",
            subject: "Basic Science",
            department: "Science & Technology",
            description:
                "Introduces students to scientific ideas through engaging lessons and practical classroom activities.",
        },
        {
            name: "Mr. Abdullahi",
            subject: "Basic Technology",
            department: "Science & Technology",
            description:
                "Helps students develop practical knowledge of technology, tools, design, and problem-solving.",
        },
        {
            name: "Mrs. Halima",
            subject: "Home Economics",
            department: "Arts & Humanities",
            description:
                "Guides students in developing useful practical skills related to home management, nutrition, and everyday life.",
        },
        {
            name: "Mr. Musa",
            subject: "Agricultural Science",
            department: "Science & Technology",
            description:
                "Helps students understand agriculture, farming practices, natural resources, and sustainable development.",
        },
        {
            name: "Mrs. Khadijah",
            subject: "Social Studies",
            department: "Arts & Humanities",
            description:
                "Helps students understand society, relationships, culture, and responsible participation in their communities.",
        },
        {
            name: "Mr. Ismail",
            subject: "Accounting",
            department: "Commercial Studies",
            description:
                "Guides students in understanding financial records, accounting principles, and practical financial skills.",
        },
        {
            name: "Mrs. Raheemah",
            subject: "Commerce",
            department: "Commercial Studies",
            description:
                "Introduces students to commercial activities, trade, business practices, and the world of commerce.",
        },
        {
            name: "Mr. Umar",
            subject: "Further Mathematics",
            department: "Science & Mathematics",
            description:
                "Supports students in developing advanced mathematical reasoning and problem-solving skills.",
        },
        {
            name: "Mrs. Safiya",
            subject: "French",
            department: "Arts & Humanities",
            description:
                "Helps students develop basic communication skills and cultural awareness through French language learning.",
        },
        {
            name: "Mr. Haruna",
            subject: "Physical Education",
            department: "Sports & Physical Development",
            description:
                "Encourages students to develop teamwork, discipline, coordination, and healthy physical habits.",
        },
        {
            name: "Mrs. Sadiya",
            subject: "Creative Arts",
            department: "Arts & Humanities",
            description:
                "Encourages students to express their ideas through creative activities, design, and artistic projects.",
        },
        {
            name: "Mr. Kareem",
            subject: "Computer Studies",
            department: "Science & Technology",
            description:
                "Helps students build practical computer skills and understand how technology can support learning.",
        },
        {
            name: "Mrs. Rukayat",
            subject: "Civic Education",
            department: "Arts & Humanities",
            description:
                "Helps students understand citizenship, responsibilities, values, and positive participation in society.",
        },
        {
            name: "Mr. Bashir",
            subject: "Data Processing",
            department: "Science & Technology",
            description:
                "Guides students in understanding data, computer applications, and practical digital information skills.",
        },
        {
            name: "Mrs. Hafsat",
            subject: "Islamic Religious Studies",
            department: "Religious & Moral Studies",
            description:
                "Supports students in learning about religious teachings, moral values, and responsible behaviour.",
        },
        {
            name: "Mr. Nura",
            subject: "Islamic Religious Studies",
            department: "Religious & Moral Studies",
            description:
                "Guides students in learning Islamic teachings, values, good character, and responsible conduct.",
        },
        {
            name: "Mrs. Hannan",
            subject: "Integrated Science",
            department: "Science & Technology",
            description:
                "Helps students connect different areas of science through practical and engaging learning activities.",
        },
        {
            name: "Mr. Abdullahi",
            subject: "Entrepreneurship",
            department: "Commercial Studies",
            description:
                "Encourages students to develop creative ideas, business awareness, initiative, and entrepreneurial thinking.",
        },
    ];

    const departments = [
        {
            title: "Science & Technology",
            description:
                "Students explore science, mathematics, computing, technology, and practical problem-solving.",
        },
        {
            title: "Arts & Humanities",
            description:
                "Students develop communication, creativity, critical thinking, research, and cultural understanding.",
        },
        {
            title: "Commercial Studies",
            description:
                "Students learn business concepts, financial awareness, entrepreneurship, and practical commercial skills.",
        },
        {
            name: "Mrs. Maimuna",
            subject: "Mathematics",
            department: "Science & Mathematics",
            description:
                "Helps students strengthen their mathematical reasoning, accuracy, and confidence through guided practice.",
        },
        {
            name: "Mr. Faruk",
            subject: "Statistics",
            department: "Science & Mathematics",
            description:
                "Introduces students to data, statistics, interpretation, and practical mathematical applications.",
        },
        {
            name: "Mrs. Amina",
            subject: "Information Technology",
            department: "Science & Technology",
            description:
                "Helps students develop practical technology skills and understand the role of digital tools in everyday life.",
        },
        {
            name: "Mr. Sadiq",
            subject: "Basic Technology",
            department: "Science & Technology",
            description:
                "Guides students through practical technology concepts, design, tools, and creative problem-solving.",
        },
        {
            name: "Mrs. Joy",
            subject: "History",
            department: "Arts & Humanities",
            description:
                "Helps students explore historical events, cultures, and the lessons they can learn from the past.",
        },
        {
            name: "Mr. Tunde",
            subject: "Literature",
            department: "Arts & Humanities",
            description:
                "Encourages students to appreciate literature, storytelling, creative expression, and thoughtful analysis.",
        },
        {
            name: "Mrs. Asma'u",
            subject: "Marketing",
            department: "Commercial Studies",
            description:
                "Introduces students to marketing concepts, customer awareness, communication, and business ideas.",
        },
        {
            name: "Mr. Ahmed",
            subject: "Financial Education",
            department: "Commercial Studies",
            description:
                "Helps students develop practical knowledge about money management, saving, budgeting, and financial responsibility.",
        },
        {
            name: "Mrs. Binta",
            subject: "Moral Education",
            department: "Religious & Moral Studies",
            description:
                "Encourages students to develop good character, responsibility, respect, and positive values.",
        },
        {
            name: "Mr. Lawal",
            subject: "Sports & Physical Education",
            department: "Sports & Physical Development",
            description:
                "Encourages students to participate in physical activities while developing teamwork, discipline, and sportsmanship.",
        },
    ];

    const teachingPhilosophy = [
        {
            title: "Student-Centered Learning",
            description:
                "Our teachers encourage students to participate actively, ask questions, and develop confidence in their learning.",
        },
        {
            title: "Practical Learning",
            description:
                "Students are encouraged to connect classroom knowledge with practical activities, projects, and real-world situations.",
        },
        {
            title: "Character & Leadership",
            description:
                "Teachers help students develop responsibility, teamwork, discipline, confidence, and leadership qualities.",
        },
    ];

    const filteredTeachers =
        selectedDepartment === "All"
            ? teachers
            : teachers.filter(
                (teacher) =>
                    teacher.department === selectedDepartment
            );

    return (
        <div className="teachers-page">

            {/* HERO */}
            <div className="md:flex">
                <PageHero
                    className="md:w-1/2"
                    breadcrumb="Teachers"
                    eyebrow="OUR EDUCATORS"
                    title="Meet the People Behind"
                    highlight="Our Students' Success"
                    description="At Greenfield School, our teachers are committed to creating a supportive learning environment where students can learn, ask questions, explore ideas, and develop confidence."
                />

                <div className="hidden md:block md:w-1/2 md:h-[420px] lg:h-[650px] relative bg-green-950">
                    <img
                        src={Learning}
                        alt="Students learning at Greenfield School"
                        className="w-full h-full object-cover rounded-tl-4xl rounded-br-4xl"
                    />
                </div>
            </div>

            {/* INTRODUCTION */}
            <section className="mx-auto max-w-6xl px-6 py-20">

                <div className="grid gap-12 md:grid-cols-2 md:items-center">

                    <div>
                        <p className="text-sm font-bold tracking-[0.25em] text-yellow-500">
                            DEDICATED TO EVERY STUDENT
                        </p>

                        <h2 className="mt-3 text-4xl font-bold leading-tight text-green-950">
                            Teaching With
                            <span className="text-yellow-500">
                                {" "}Purpose
                            </span>
                        </h2>

                        <p className="mt-6 leading-8 text-gray-600">
                            At Greenfield School, our teachers play an important
                            role in helping students grow academically and
                            personally. They create supportive classrooms where
                            students can develop knowledge, confidence,
                            creativity, and practical skills.
                        </p>

                        <p className="mt-4 leading-8 text-gray-600">
                            Through meaningful classroom activities,
                            collaboration, and practical learning experiences,
                            our educators help students prepare for their
                            future.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-5">

                        <div className="rounded-2xl bg-green-950 p-6 text-center">
                            <p className="text-4xl font-bold text-white">
                                30+
                            </p>
                            <p className="mt-2 font-semibold text-green-100">
                                Teachers
                            </p>
                        </div>

                        <div className="rounded-2xl bg-green-50 p-6 text-center">
                            <p className="text-4xl font-bold text-green-950">
                                10+
                            </p>
                            <p className="mt-2 font-semibold text-green-950">
                                Years
                            </p>
                        </div>

                        <div className="rounded-2xl bg-green-50 p-6 text-center">
                            <p className="text-4xl font-bold text-green-950">
                                500+
                            </p>
                            <p className="mt-2 font-semibold text-green-950">
                                Students
                            </p>
                        </div>

                        <div className="rounded-2xl bg-green-950 p-6 text-center">
                            <p className="text-4xl font-bold text-white">
                                15+
                            </p>
                            <p className="mt-2 font-semibold text-green-100">
                                Classes
                            </p>
                        </div>

                    </div>

                </div>

            </section>

            {/* TEACHER DIRECTORY */}
            <section className="bg-green-50 px-6 py-20">

                <div className="mx-auto max-w-6xl">

                    <div className="max-w-3xl">

                        <p className="text-sm font-bold tracking-[0.25em] text-yellow-500">
                            MEET OUR EDUCATORS
                        </p>

                        <h2 className="mt-3 text-4xl font-bold leading-tight text-green-950">
                            Our
                            <span className="text-yellow-500">
                                {" "}Teachers
                            </span>
                        </h2>

                        <p className="mt-6 leading-8 text-gray-600">
                            Our teaching team supports students across different
                            subjects and learning areas, helping them build the
                            knowledge and skills they need for the future.
                        </p>

                    </div>

                    <div className="mb-10 mt-10 flex flex-wrap justify-center gap-3">
                        {[
                            "All",
                            "Science & Mathematics",
                            "Science & Technology",
                            "Arts & Humanities",
                            "Commercial Studies",
                            "Sports & Physical Development",
                            "Religious & Moral Studies",
                        ].map((department) => (
                            <button
                                key={department}
                                onClick={() => setSelectedDepartment(department)}
                                className={
                                    selectedDepartment === department
                                        ? "rounded-full bg-green-950 px-5 py-2 font-semibold text-white"
                                        : "rounded-full border border-green-950 px-5 py-2 font-semibold text-green-950 hover:bg-green-950 hover:text-white"
                                }
                            >
                                {department}
                            </button>
                        ))}
                    </div>

                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredTeachers.map((teacher) => (
                            <Card
                                key={teacher.name}
                                title={teacher.name}
                                description={teacher.description}
                            >
                                <div className="mt-4 border-t border-green-100 pt-4">
                                    <p className="font-bold text-green-950">
                                        {teacher.subject}
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-gray-500">
                                        {teacher.department}
                                    </p>
                                </div>
                            </Card>
                        ))}

                    </div>

                </div>

            </section>

            {/* DEPARTMENTS */}
            <section className="mx-auto max-w-6xl px-6 py-20">

                <div className="max-w-3xl">

                    <p className="text-sm font-bold tracking-[0.25em] text-yellow-500">
                        AREAS OF EXPERTISE
                    </p>

                    <h2 className="mt-3 text-4xl font-bold leading-tight text-green-950">
                        Learning Across
                        <span className="text-yellow-500">
                            {" "}Different Areas
                        </span>
                    </h2>

                    <p className="mt-6 leading-8 text-gray-600">
                        Our academic team supports students across a variety of
                        subjects and learning areas.
                    </p>

                </div>

                <div className="mt-10 grid gap-5 md:grid-cols-3">

                    {departments.map((department) => (
                        <Card
                            key={department.title}
                            title={department.title}
                            description={department.description}
                        />
                    ))}

                </div>

            </section>

            {/* TEACHING PHILOSOPHY */}
            <section className="bg-green-50 px-6 py-20">

                <div className="mx-auto max-w-6xl">

                    <div className="max-w-3xl">

                        <p className="text-sm font-bold tracking-[0.25em] text-yellow-500">
                            OUR APPROACH
                        </p>

                        <h2 className="mt-3 text-4xl font-bold leading-tight text-green-950">
                            Teaching
                            <span className="text-yellow-500">
                                {" "}Beyond the Classroom
                            </span>
                        </h2>

                        <p className="mt-6 leading-8 text-gray-600">
                            We believe good teaching goes beyond delivering
                            lessons. Our educators help students develop the
                            confidence, skills, and character they need to
                            succeed.
                        </p>

                    </div>

                    <div className="mt-10 grid gap-5 md:grid-cols-3">

                        {teachingPhilosophy.map((item) => (
                            <Card
                                key={item.title}
                                title={item.title}
                                description={item.description}
                            />
                        ))}

                    </div>

                </div>

            </section>

            {/* CTA */}
            <section className="mt-15 px-6 py-20">

                <div className="mx-auto max-w-4xl text-center">

                    <p className="text-sm font-bold tracking-[0.25em] text-yellow-500">
                        DISCOVER GREENFIELD SCHOOL
                    </p>

                    <h2 className="mt-3 text-4xl font-bold text-green-950">
                        Learn More <span className="text-yellow-400">About Our School</span>
                    </h2>

                    <p className="mx-auto mt-6 max-w-2xl leading-8 text-gray-400">
                        Explore our academic programmes, learn more about
                        Greenfield School, or get in touch with us to discover
                        how we can support your child's educational journey.
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">

                        <Link
                            to="/academics"
                            className="rounded-full bg-green-950 px-6 py-3 font-bold text-white transition hover:bg-green-800"
                        >
                            Explore Academics
                        </Link>

                        <Link
                            to="/about"
                            className="rounded-full border-2 border-green-950 px-6 py-3 font-bold text-green-950 transition hover:bg-green-950 hover:text-white"
                        >
                            About Greenfield
                        </Link>

                        <Link
                            to="/contact"
                            className="rounded-full border-2 border-green-950 px-6 py-3 font-bold text-green-950 transition hover:bg-green-950 hover:text-white"
                        >
                            Contact Us
                        </Link>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default Teachers;