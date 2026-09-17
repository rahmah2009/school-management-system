import { Link } from "react-router-dom";
import PageHero from "../../components/common/PageHero";
import WalkWay from "../../assets/walkway.png";
import Card from "../../components/common/Card";
import ValueBlock from "../../components/common/ValueBlock";
import {
    Target,
    Eye,
    TrendingUp,
    Heart,
    Lightbulb,
    Brain,
    HandHeart
} from "../../components/common/Icons";

function About() {
    return (
        <div className="about-page">

            <PageHero
                breadcrumb="About Us"
                eyebrow="ABOUT GREENFIELD"
                title="Building a Strong"
                highlight="Foundation for Every Child"
                description="Greenfield School is committed to providing a safe, supportive, and inspiring environment where students can learn, grow, and discover their potential."
            />

            <section className="px-6 py-20">
                <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">

                    <div className="h-[420px] overflow-hidden rounded-3xl">
                        <img
                            src={WalkWay}
                            alt="School Walk way"
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div>
                        <p className="text-sm font-bold tracking-[0.2em] text-yellow-500">
                            WHO WE ARE
                        </p>

                        <h2 className="mt-3 text-4xl font-bold leading-tight text-green-950">
                            More Than a School,
                            <span className="text-yellow-500">
                                {" "}A Place to Grow
                            </span>
                        </h2>

                        <p className="mt-6 leading-8 text-gray-600">
                            Greenfield School is a learning community dedicated to
                            helping every student discover their abilities, build
                            confidence, and develop the knowledge they need for the future.
                        </p>

                        <p className="mt-4 leading-8 text-gray-600">
                            We believe education goes beyond the classroom. Through
                            strong academic foundations, character development, and
                            meaningful experiences, we create an environment where
                            students can grow into responsible and confident individuals.
                        </p>
                    </div>
                </div>
            </section>

            <div className="mx-auto mt-8 grid max-w-6xl grid-cols-3 gap-4 border-t border-gray-200 px-6 pt-6">

                <div>
                    <h2 className="text-2xl font-bold text-green-950">10+</h2>
                    <p className="mt-1 text-xs text-gray-500">
                        Years of Excellence
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-green-950">500+</h2>
                    <p className="mt-1 text-xs text-gray-500">
                        Students
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-green-950">30+</h2>
                    <p className="mt-1 text-xs text-gray-500">
                        Dedicated Staff
                    </p>
                </div>

            </div>

            <section className="bg-green-50 px-6 py-20">
                <div className="mx-auto max-w-6xl">

                    <div className="grid gap-8 md:grid-cols-2">

                        <Card
                            className="bg-white"
                            title={
                                <>
                                    <Target className="mb-4 h-8 w-8 text-yellow-500" />
                                    <span className="text-sm font-bold tracking-[0.2em] text-yellow-500">
                                        OUR MISSION
                                    </span>

                                    <h2 className="mt-3 text-2xl font-bold text-green-950">
                                        Inspiring Students to Learn and Grow
                                    </h2>
                                </>
                            }
                            description="Our mission is to provide quality education in a supportive environment that encourages curiosity, character, confidence, and a lifelong love for learning."
                        />

                        <Card
                            className="bg-green-950"
                            descriptionClassName="text-green-100"
                            title={
                                <>
                                    <Eye className="mb-4 h-8 w-8 text-yellow-500" />
                                    <span className="text-sm font-bold tracking-[0.2em] text-yellow-400">
                                        OUR VISION
                                    </span>

                                    <h2 className="mt-3 text-2xl font-bold text-white">
                                        Preparing Students for a Brighter Future
                                    </h2>
                                </>
                            }
                            description="We envision a school community where every student is equipped with the knowledge, values, and confidence to make a meaningful difference in the world."
                        />

                    </div>

                </div>
            </section>

            <section className="px-6 py-20">
                <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">

                    <div>
                        <p className="text-sm font-bold tracking-[0.2em] text-yellow-500">
                            OUR APPROACH
                        </p>

                        <h2 className="mt-3 text-4xl font-bold leading-tight text-green-950">
                            Where It All
                            <span className="text-yellow-500">
                                {" "}Began
                            </span>
                        </h2>

                        <p className="mt-6 leading-8 text-gray-600">
                            Greenfield School began with a simple belief: every child
                            deserves an environment where they can learn with confidence,
                            discover their strengths, and develop a strong foundation for
                            the future.
                        </p>

                        <p className="mt-4 leading-8 text-gray-600">
                            Our approach combines strong academics with character,
                            creativity, and practical experiences. We believe that when
                            students feel supported and encouraged, they are better
                            prepared to grow both inside and outside the classroom.
                        </p>

                        <p className="mt-4 leading-8 text-gray-600">
                            Today, this philosophy continues to guide the way we teach,
                            support, and inspire every student in our school community.
                        </p>
                    </div>

                    {/* Highlight */}
                    <div className="rounded-3xl bg-green-950 p-10 text-white">
                        <p className="text-sm font-bold tracking-[0.2em] text-yellow-400">
                            OUR APPROACH
                        </p>

                        <h3 className="mt-4 text-3xl font-bold">
                            Learning Beyond the Classroom
                        </h3>

                        <p className="mt-5 leading-8 text-green-100">
                            We create meaningful learning experiences that encourage
                            students to ask questions, solve problems, work together,
                            and become confident lifelong learners.
                        </p>
                    </div>

                </div>
            </section>

            <section className="bg-green-50 px-6 py-20">
                <div className="mx-auto max-w-6xl text-center">

                    <p className="text-sm font-bold tracking-[0.25em] text-yellow-500">
                        — WHAT WE STAND FOR —
                    </p>

                    <h2 className="mt-4 text-5xl font-bold text-green-950">
                        Our <span className="allura text-6xl text-yellow-500">Core Values</span>
                    </h2>

                    <p className="mx-auto mt-6 max-w-2xl leading-8 text-gray-600">
                        At Greenfield School, our values shape the way we learn, teach,
                        grow, and build a community where every student is encouraged
                        to become their best self.
                    </p>

                    <div className="mt-12 flex items-center justify-center">

                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-950 font-bold text-white">
                            G
                        </span>

                        <span className="h-1 w-8 bg-green-800"></span>

                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-800 font-bold text-white">
                            R
                        </span>

                        <span className="h-1 w-8 bg-yellow-500"></span>

                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500 font-bold text-green-950">
                            O
                        </span>

                        <span className="h-1 w-8 bg-emerald-700"></span>

                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-700 font-bold text-white">
                            W
                        </span>

                        <span className="h-1 w-8 bg-green-950"></span>

                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-950 font-bold text-white">
                            S
                        </span>

                    </div>

                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">

                        <ValueBlock
                            className="bg-gradient-to-br from-green-700 to-green-950"
                            letter="G"
                            title="Growth"
                            description="We encourage every student to keep learning, exploring, and developing their abilities, so they can reach their full potential."
                            label="G — GROWTH"
                        >
                            <TrendingUp className="mb-4 h-6 w-6 text-yellow-500" />
                        </ValueBlock>

                        <ValueBlock
                            className="bg-gradient-to-br from-emerald-600 to-green-900"
                            letter="R"
                            title="Respect"
                            description="We foster a culture of respect, where students, teachers, and staff treat each other with kindness, empathy, and understanding."
                            label="R — RESPECT"
                        >
                            <Heart className="mb-4 h-6 w-6 text-yellow-500" />
                        </ValueBlock>

                        <ValueBlock
                            className="bg-gradient-to-br from-yellow-400 to-green-700"
                            letter="O"
                            title="Opportunity"
                            description="We provide all students with equal opportunities to succeed, regardless of their background or circumstances."
                            label="O — OPPORTUNITY"
                        >
                            <Lightbulb className="mb-4 h-6 w-6 text-white" />
                        </ValueBlock>

                        <ValueBlock
                            className="bg-gradient-to-br from-green-600 to-emerald-950"
                            letter="W"
                            title="Wisdom"
                            description="We encourage students to think critically, make thoughtful decisions, and develop a deep understanding of the world around them."
                            label="W — WISDOM"
                        >
                            <Brain className="mb-4 h-6 w-6 text-yellow-500" />
                        </ValueBlock>

                        <ValueBlock
                            className="bg-gradient-to-br from-green-800 to-yellow-600"
                            letter="S"
                            title="Service"
                            description="We encourage students to care for others, work together, and use their skills to make a positive difference in their school and wider community."
                            label="S — SERVICE"
                        >
                            <HandHeart className="mb-4 h-6 w-6 text-yellow-500" />
                        </ValueBlock>

                    </div>
                </div>
            </section>

            {/* GRACE — Character & Culture */}
            <section className="px-6 py-20">
                <div className="mx-auto max-w-6xl">

                    <div className="max-w-2xl">
                        <p className="text-sm font-bold tracking-[0.25em] text-yellow-500">
                            CHARACTER & CULTURE
                        </p>

                        <h2 className="mt-4 text-5xl font-bold text-green-950">
                            Building Character Through
                            <span className="allura ml-2 text-6xl text-yellow-500">
                                GRACE
                            </span>
                        </h2>

                        <p className="mt-6 leading-8 text-gray-600">
                            We believe education should shape not only what students know,
                            but also who they become. Our culture encourages students to
                            develop strong character, confidence, and a sense of responsibility.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">

                        <ValueBlock
                            className="bg-gradient-to-br from-green-700 to-green-950"
                            letter="G"
                            title="Growth"
                            description="We encourage students to continuously learn, improve, and develop their abilities."
                            label="G — GROWTH"
                        />

                        <ValueBlock
                            className="bg-gradient-to-br from-emerald-600 to-green-900"
                            letter="R"
                            title="Respect"
                            description="We teach students to value themselves, others, and the community around them."
                            label="R — RESPECT"
                        />

                        <ValueBlock
                            className="bg-gradient-to-br from-yellow-400 to-green-700"
                            letter="A"
                            title="Achievement"
                            description="We encourage students to set meaningful goals and take pride in their progress."
                            label="A — ACHIEVEMENT"
                        />

                        <ValueBlock
                            className="bg-gradient-to-br from-green-600 to-emerald-950"
                            letter="C"
                            title="Character"
                            description="We develop honesty, responsibility, kindness, and strong personal values."
                            label="C — CHARACTER"
                        />

                        <ValueBlock
                            className="bg-gradient-to-br from-green-800 to-yellow-600"
                            letter="E"
                            title="Excellence"
                            description="We encourage students to give their best and pursue excellence in everything they do."
                            label="E — EXCELLENCE"
                        />

                    </div>
                </div>
            </section>


            {/* LEARN — Student Development */}
            <section className="bg-green-50 px-6 py-20">
                <div className="mx-auto max-w-6xl">

                    <div className="max-w-2xl">
                        <p className="text-sm font-bold tracking-[0.25em] text-yellow-500">
                            STUDENT DEVELOPMENT
                        </p>

                        <h2 className="mt-4 text-5xl font-bold text-green-950">
                            Helping Students
                            <span className="allura ml-2 text-6xl text-yellow-500">
                                LEARN
                            </span>
                        </h2>

                        <p className="mt-6 leading-8 text-gray-600">
                            Learning at Greenfield goes beyond memorising information.
                            We encourage students to think, explore, lead, and develop
                            the skills they need for life.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">

                        <ValueBlock
                            className="bg-gradient-to-br from-green-700 to-green-950"
                            letter="L"
                            title="Leadership"
                            description="Students are encouraged to take responsibility, make decisions, and inspire others."
                            label="L — LEADERSHIP"
                        />

                        <ValueBlock
                            className="bg-gradient-to-br from-emerald-600 to-green-900"
                            letter="E"
                            title="Excellence"
                            description="We challenge students to develop their abilities and strive for meaningful achievement."
                            label="E — EXCELLENCE"
                        />

                        <ValueBlock
                            className="bg-gradient-to-br from-yellow-400 to-green-700"
                            letter="A"
                            title="Achievement"
                            description="We celebrate progress and encourage students to work toward their goals."
                            label="A — ACHIEVEMENT"
                        />

                        <ValueBlock
                            className="bg-gradient-to-br from-green-600 to-emerald-950"
                            letter="R"
                            title="Respect"
                            description="Students learn to listen, understand differences, and treat others with dignity."
                            label="R — RESPECT"
                        />

                        <ValueBlock
                            className="bg-gradient-to-br from-green-800 to-yellow-600"
                            letter="N"
                            title="Nurture"
                            description="We provide a supportive environment where students can discover and develop their potential."
                            label="N — NURTURE"
                        />

                    </div>
                </div>
            </section>


            {/* PRIDE — School Character */}
            <section className="px-6 py-20">
                <div className="mx-auto max-w-6xl">

                    <div className="max-w-2xl">
                        <p className="text-sm font-bold tracking-[0.25em] text-yellow-500">
                            SCHOOL CHARACTER
                        </p>

                        <h2 className="mt-4 text-5xl font-bold text-green-950">
                            The Principles Behind
                            <span className="allura ml-2 text-6xl text-yellow-500">
                                PRIDE
                            </span>
                        </h2>

                        <p className="mt-6 leading-8 text-gray-600">
                            Our school community is built on principles that encourage
                            responsibility, integrity, discipline, and a strong sense of purpose.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">

                        <ValueBlock
                            className="bg-gradient-to-br from-green-700 to-green-950"
                            letter="P"
                            title="Purpose"
                            description="We help students understand the importance of having goals and direction."
                            label="P — PURPOSE"
                        />

                        <ValueBlock
                            className="bg-gradient-to-br from-emerald-600 to-green-900"
                            letter="R"
                            title="Respect"
                            description="We promote kindness, understanding, and respect throughout our school community."
                            label="R — RESPECT"
                        />

                        <ValueBlock
                            className="bg-gradient-to-br from-yellow-400 to-green-700"
                            letter="I"
                            title="Integrity"
                            description="We encourage students to be honest, trustworthy, and responsible for their actions."
                            label="I — INTEGRITY"
                        />

                        <ValueBlock
                            className="bg-gradient-to-br from-green-600 to-emerald-950"
                            letter="D"
                            title="Discipline"
                            description="We help students develop self-control, responsibility, and positive habits."
                            label="D — DISCIPLINE"
                        />

                        <ValueBlock
                            className="bg-gradient-to-br from-green-800 to-yellow-600"
                            letter="E"
                            title="Excellence"
                            description="We encourage students to pursue high standards and take pride in their efforts."
                            label="E — EXCELLENCE"
                        />

                    </div>
                </div>
            </section>


            {/* SHINE — Student Journey */}
            <section className="bg-green-50 px-6 py-20">
                <div className="mx-auto max-w-6xl">

                    <div className="max-w-2xl">
                        <p className="text-sm font-bold tracking-[0.25em] text-yellow-500">
                            OUR STUDENT JOURNEY
                        </p>

                        <h2 className="mt-4 text-5xl font-bold text-green-950">
                            Helping Every Student
                            <span className="allura ml-2 text-6xl text-yellow-500">
                                SHINE
                            </span>
                        </h2>

                        <p className="mt-6 leading-8 text-gray-600">
                            Every student has unique strengths and potential. We create
                            opportunities for students to discover themselves, develop
                            confidence, and make a positive impact.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">

                        <ValueBlock
                            className="bg-gradient-to-br from-green-700 to-green-950"
                            letter="S"
                            title="Service"
                            description="Students learn to care for others and contribute positively to their community."
                            label="S — SERVICE"
                        />

                        <ValueBlock
                            className="bg-gradient-to-br from-emerald-600 to-green-900"
                            letter="H"
                            title="Honesty"
                            description="We encourage students to communicate truthfully and act with integrity."
                            label="H — HONESTY"
                        />

                        <ValueBlock
                            className="bg-gradient-to-br from-yellow-400 to-green-700"
                            letter="I"
                            title="Integrity"
                            description="Students are encouraged to make responsible choices even when no one is watching."
                            label="I — INTEGRITY"
                        />

                        <ValueBlock
                            className="bg-gradient-to-br from-green-600 to-emerald-950"
                            letter="N"
                            title="Nurture"
                            description="We support students as they discover their abilities and develop confidence."
                            label="N — NURTURE"
                        />

                        <ValueBlock
                            className="bg-gradient-to-br from-green-800 to-yellow-600"
                            letter="E"
                            title="Excellence"
                            description="We inspire students to give their best and continue improving every day."
                            label="E — EXCELLENCE"
                        />

                    </div>
                </div>
            </section>

            <section className="px-6 py-20">
                <div className="mx-auto max-w-6xl">

                    <div className="max-w-2xl">
                        <p className="text-sm font-bold tracking-[0.2em] text-yellow-500">
                            WHY GREENFIELD
                        </p>

                        <h2 className="mt-3 text-4xl font-bold leading-tight text-green-950">
                            More Than Just
                            <span className="text-yellow-500">
                                {" "}Education
                            </span>
                        </h2>

                        <p className="mt-5 leading-8 text-gray-600">
                            We create an environment where students are encouraged to learn,
                            discover their strengths, and develop the confidence they need
                            for the future.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-3">

                        <Card
                            className="bg-green-950"
                            descriptionClassName="text-green-100"
                            title={
                                <>
                                    <span className="text-sm font-bold tracking-[0.2em] text-yellow-400">
                                        01
                                    </span>

                                    <h3 className="mt-3 text-2xl font-bold text-white">
                                        Strong Academics
                                    </h3>
                                </>
                            }
                            description="We provide students with a strong academic foundation that prepares them to think critically, solve problems, and approach learning with confidence."
                        />

                        <Card
                            className="bg-white"
                            title={
                                <>
                                    <span className="text-sm font-bold tracking-[0.2em] text-yellow-500">
                                        02
                                    </span>

                                    <h3 className="mt-3 text-2xl font-bold text-green-950">
                                        Student Development
                                    </h3>
                                </>
                            }
                            description="Beyond academics, we encourage creativity, character, confidence, and practical skills that help students grow as individuals."
                        />

                        <Card
                            className="bg-green-50"
                            title={
                                <>
                                    <span className="text-sm font-bold tracking-[0.2em] text-yellow-500">
                                        03
                                    </span>

                                    <h3 className="mt-3 text-2xl font-bold text-green-950">
                                        Supportive Community
                                    </h3>
                                </>
                            }
                            description="We build a welcoming school community where students, teachers, and families work together to create a positive learning environment."
                        />

                    </div>

                </div>
            </section>

            <section className="bg-green-950 px-6 py-20 text-white">
                <div className="mx-auto max-w-5xl text-center">

                    <p className="text-sm font-bold tracking-[0.25em] text-yellow-400">
                        START THE JOURNEY
                    </p>

                    <h2 className="mt-4 text-4xl font-bold md:text-5xl">
                        Ready to Learn More About
                        <span className="text-yellow-400">
                            {" "}Greenfield School?
                        </span>
                    </h2>

                    <p className="mx-auto mt-6 max-w-2xl leading-8 text-green-100">
                        Discover our academic programs, meet our teachers, and learn more
                        about the opportunities available to our students.
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Link
                            to="/academics"
                            className="rounded-full bg-yellow-400 px-7 py-3 font-bold text-green-950 transition hover:bg-yellow-300"
                        >
                            Explore Academics
                        </Link>

                        <Link
                            to="/contact"
                            className="rounded-full border border-white/30 px-7 py-3 font-bold text-white transition hover:bg-white hover:text-green-950"
                        >
                            Contact Us
                        </Link>
                    </div>

                </div>
            </section>

        </div>
    );
}

export default About;