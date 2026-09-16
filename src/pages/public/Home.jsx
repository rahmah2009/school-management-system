import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import SectionHeading from "../../components/common/SectionHeading";
import Card from "../../components/common/Card";
import heroImage from "../../assets/hero.png"
import heroImage2 from "../../assets/learning.png"
import heroImage3 from "../../assets/writing.png"
import heroImage4 from "../../assets/students.png"
import heroImage5 from "../../assets/girls.png"

function Home() {
    const heroImages = [heroImage, heroImage2, heroImage3, heroImage4, heroImage5];
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % heroImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);
    return (
        <div className="home-page">
            {/* HERO SECTION */}
            <section
                className="relative flex min-h-[90vh] items-center justify-center bg-cover bg-center bg-no-repeat px-6 py-20"
                style={{ backgroundImage: `url(${heroImages[currentImage]})` }}
            >
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="relative z-10 w-full max-w-5xl rounded-3xl border border-white/20 bg-white/10 p-10 text-center shadow-2xl backdrop-blur-md md:p-16">

                    <p className="mb-4 text-sm font-bold tracking-[0.3em] text-yellow-400">
                        WELCOME TO GREENFIELD SCHOOL
                    </p>

                    <h1 className="mb-6 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-6xl">                        Building Bright Minds,
                        <br />
                        <span className="text-yellow-400">
                            Shaping Great Futures
                        </span>
                    </h1>

                    <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-green-50 md:text-lg">
                        Welcome to Greenfield School, where we nurture young minds
                        and foster a love for learning. We provide a supportive
                        environment where students develop knowledge, character,
                        skills, and confidence for a brighter future.
                    </p>

                    <div className="flex flex-col justify-center gap-4 sm:flex-row">

                        <Link to="/about" className="rounded-full bg-yellow-400 px-7 py-3 font-semibold text-green-950 transition duration-300 hover:-translate-y-1 hover:bg-yellow-300 hover:shadow-lg">
                            Explore Our School
                        </Link>

                        <Link to="/contact" className="rounded-full border border-white/40 bg-white/10 px-7 py-3 font-semibold text-white backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/20">
                            Contact Us
                        </Link>

                        <Link to="/contact" className="rounded-full border border-yellow-400 px-7 py-3 font-semibold text-yellow-400 transition duration-300 hover:-translate-y-1 hover:bg-yellow-400 hover:text-green-950">
                            Apply Now
                        </Link>

                    </div>

                </div>
            </section>
            {/* HERO SECTION ENDS HERE */}

            {/* WELCOME SECTION */}

            <section className="grid items-center gap-12 px-6 py-20 md:grid-cols-2 md:px-12 lg:px-20">
                <div className="items-center flex min-h-[350px] justify-center bg-green-100 rounded-3xl shadow-lg">
                    <span className="text-lg font-semibold text-green-800">
                        School Image
                    </span>
                </div>

                <div className="max-w-xl">
                    <p className="text-green-700 mb-3 text-sm font-bold tracking-[0.2em]">ABOUT GREENFIELD SCHOOL</p>
                    <h2 className="md:text-4xl font-bold text-green-950 text-3xl mb-6">Welcome to Greenfield School</h2>

                    <p className="leading-7 text-gray-600 mb-6">
                        At Greenfield School, we are dedicated to providing a nurturing and
                        stimulating environment for our students. Our experienced faculty and
                        staff are committed to fostering a love for learning, encouraging
                        creativity, and promoting personal growth. We believe in the
                        holistic development of each student, ensuring they excel
                        academically, socially, and emotionally. Join us on this journey of
                        discovery and achievement as we prepare our students for a bright
                        future.
                    </p>

                    <p className="leading-7 text-gray-600 mb-6">
                        Our school offers a wide range of academic programs, extracurricular
                        activities, and community engagement opportunities. We strive to
                        create a supportive and inclusive environment where every student
                        can thrive. Explore our website to learn more about our programs,
                        meet our dedicated faculty, and discover the vibrant community that
                        makes Greenfield School a place of excellence in education.
                    </p>

                    <Link to="/about" className="rounded-full px-6 py-3 bg-green-800 text-white transition duration-300 hover:-translate-y-1 hover:bg-green-700 hover:shadow-lg font-semibold">
                        Learn More
                    </Link>
                </div>
            </section>

            <section className="why-choose-section">
                <SectionHeading
                    eyebrow="WHY CHOOSE US"
                    title="Why Choose Greenfield School?"
                    description="We are committed to creating an environment where students can learn, grow, and achieve their full potential."
                />

                <div className="grid gap-6 px-6 md:grid-cols-2 lg:grid-cols-4">

                    <Card
                        title="Quality Education"
                        description="We provide students with a strong academic foundation and meaningful learning experiences."
                    />

                    <Card
                        title="Experienced Teachers"
                        description="Our teachers guide and support students throughout their educational journey."
                    />

                    <Card
                        title="Character Development"
                        description="We help students develop discipline, responsibility, confidence, and good character."
                    />

                    <Card
                        title="Safe Learning Environment"
                        description="We provide a supportive environment where students can learn and express themselves confidently."
                    />

                </div>
            </section>

            <section className="academics-section">

                <SectionHeading
                    eyebrow="OUR ACADEMICS"
                    title="Explore Our Academic Programs"
                    description=" Our academic programs are designed to help students build strong foundations and prepare for their future."
                />

                <div className="grid gap-6 px-6 md:grid-cols-2">

                    <Card
                        title="Junior Secondary School"
                        description="A strong foundation that develops students' knowledge, confidence, critical thinking, and essential skills."
                    >
                        <Link to="/academics" className="mb-4 rounded-full bg-green-800 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-700">
                            Learn More
                        </Link>
                    </Card>

                    <Card
                        title="Senior Secondary School"
                        description="A focused learning environment that prepares students for higher education, careers, and responsible adulthood."
                    >
                        <Link to="/academics" className="mb-4 rounded-full bg-green-800 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-700">
                            Learn More
                        </Link>
                    </Card>

                </div>
            </section>

            <section className="grid grid-cols-2 gap-6 bg-green-900 px-6 py-16 text-center md:grid-cols-4">
                <div className="rounded-2xl bg-white/10 p-6">
                    <h2 className="text-4xl font-bold text-yellow-400">500+</h2>
                    <p className="mt-2 text-green-50">Students</p>
                </div>

                <div className="rounded-2xl bg-white/10 p-6">
                    <h2 className="text-4xl font-bold text-yellow-400">30+</h2>
                    <p className="mt-2 text-green-50">Teachers</p>
                </div>

                <div className="rounded-2xl bg-white/10 p-6">
                    <h2 className="text-4xl font-bold text-yellow-400">15+</h2>
                    <p className="mt-2 text-green-50">Classes</p>
                </div>

                <div className="rounded-2xl bg-white/10 p-6">
                    <h2 className="text-4xl font-bold text-yellow-400">10+</h2>
                    <p className="mt-2 text-green-50">Years of Excellence</p>
                </div>
            </section>

            <section className="principal-section">

                <SectionHeading
                    eyebrow="MESSAGE FROM THE PRINCIPAL"
                    title="Welcome to Greenfield School"
                    description="At Greenfield School, we believe that every student has
                        unique potential. Our responsibility is to provide the
                        guidance, knowledge, and opportunities they need to grow
                        into confident and responsible individuals."
                />
                <div className="mx-auto grid max-w-5xl items-center gap-8 px-6 md:grid-cols-2">

                    <div className="flex min-h-[300px] items-center justify-center rounded-3xl bg-green-100">
                        <span className="font-semibold text-green-800">
                            Principal Image
                        </span>
                    </div>

                    <div>
                        <h3 className="mb-2 text-2xl font-bold text-green-950">
                            Dr. Suleiman Ibroheem
                        </h3>

                        <p className="mb-4 font-medium text-green-700">
                            Principal, Greenfield School
                        </p>

                        <p className="leading-7 text-gray-600">
                            Our school is committed to helping every student discover their
                            potential, develop strong character, and prepare for a successful
                            future.
                        </p>
                    </div>

                </div>
            </section>

            <section className="facilities-section">
                <SectionHeading
                    eyebrow="OUR FACILITIES"
                    title="Learning Beyond the Classroom"
                    description="Our facilities provide students with the resources and
                        environment they need to learn, explore, and develop
                        practical skills."
                />

                <div className="grid gap-6 px-6 md:grid-cols-2 lg:grid-cols-4">

                    <Card
                        title="Science Laboratory"
                        description="A practical environment where students can explore science through experiments and hands-on learning."
                    />

                    <Card
                        title="School Library"
                        description="A quiet learning space with books and resources that encourage reading, research, and independent learning."
                    />

                    <Card
                        title="Computer Laboratory"
                        description="Students develop digital skills and explore technology in a practical and engaging environment."
                    />

                    <Card
                        title="Sports & Recreation"
                        description="Students participate in physical activities that encourage teamwork, discipline, and healthy development."
                    />

                </div>
            </section>

            <section className="school-life-section">
                <SectionHeading
                    eyebrow="LIFE AT GREENFIELD"
                    title="More Than Just the Classroom"
                    description="We encourage students to discover their interests, develop their talents, and build meaningful relationships beyond the classroom."
                />

                <div className="grid gap-6 px-6 md:grid-cols-2 lg:grid-cols-4">

                    <Card
                        title="Clubs & Activities"
                        description="Students can participate in activities that help them discover their interests and develop new skills."
                    />

                    <Card
                        title="Sports"
                        description="Sports activities encourage teamwork, discipline, confidence, and an active lifestyle."
                    />

                    <Card
                        title="Cultural Activities"
                        description="Students celebrate culture and creativity through events, performances, and special school programs."
                    />

                    <Card
                        title="Student Development"
                        description="We provide opportunities that help students build leadership, communication, and problem-solving skills."
                    />

                </div>
            </section>

            <section className="achievements-section">

                <SectionHeading
                    eyebrow="STUDENT ACHIEVEMENTS"
                    title="Celebrating Our Students"
                    description="We are proud of the dedication, creativity, and achievements of our students both inside and outside the classroom."
                />

                <div className="grid gap-6 px-6 md:grid-cols-3">

                    <Card
                        title="Academic Excellence"
                        description="Our students continue to demonstrate strong performance and dedication to their studies."
                    />

                    <Card
                        title="Competitions"
                        description="Students participate in academic, creative, and extracurricular competitions."
                    />

                    <Card
                        title="Leadership"
                        description="We encourage students to develop leadership skills through responsibility and teamwork."
                    />

                </div>

            </section>


            <section className="bg-green-900 px-6 py-20 mt-15 text-center">

                <div className="mx-auto max-w-3xl">

                    <p className="mb-3 text-sm font-bold tracking-[0.2em] text-yellow-400">
                        ADMISSIONS ARE OPEN
                    </p>

                    <h2 className="mb-6 text-3xl font-bold text-white md:text-5xl">
                        Give Your Child a Brighter Future
                    </h2>

                    <p className="mb-8 leading-7 text-green-50">
                        Join Greenfield School and give your child the opportunity
                        to learn, grow, discover their talents, and prepare for
                        a successful future.
                    </p>

                    <Link
                        to="/contact"
                        className="inline-block rounded-full bg-yellow-400 px-7 py-3 font-semibold text-green-950 transition duration-300 hover:-translate-y-1 hover:bg-yellow-300 hover:shadow-lg"
                    >
                        Contact Us
                    </Link>

                </div>

            </section>
        </div>
    )
}

export default Home