import PageHero from "../../components/common/PageHero";
import WalkWay from "../../assets/walkway.png";
import Card from "../../components/common/Card";

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
                            className="bg-green-950 border-green-950"
                            title={
                                <>
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

                    {/* Text */}
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

        </div>
    );
}

export default About;