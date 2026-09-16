import PageHero from "../../components/common/PageHero";
import WalkWay from "../../assets/walkway.png"

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

                    <div className="h-[420px] rounded-3xl overflow-hidden">
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

            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-gray-200 pt-6">

                <div>
                    <h2 className="text-2xl font-bold text-green-950">10+</h2>
                    <p className="mt-1 text-xs text-gray-500">Years of Excellence</p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-green-950">500+</h2>
                    <p className="mt-1 text-xs text-gray-500">Students</p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-green-950">30+</h2>
                    <p className="mt-1 text-xs text-gray-500">Dedicated Staff</p>
                </div>

            </div>
        </div>
    );
}

export default About;