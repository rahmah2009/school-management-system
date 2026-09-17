import { Link } from "react-router-dom"

function PageHero({ breadcrumb, eyebrow, title, highlight, description, children }) {    return (
        <section className="bg-green-950 px-6 py-24 text-white">
            <div className="mx-auto max-w-6xl">

                {/* Breadcrumb */}
                    <ul className="mb-5 text-sm font-bold tracking-wide flex gap-4">
                    <li><Link to="/" className="text-white hover:text-yellow-400">Home</Link></li>
                    {/* <li className="text-white">Home</li> */}
                    <span>|</span>
                    <li className="text-yellow-400">{breadcrumb}</li>
                    </ul>

                {/* Eyebrow */}
                <p className="mb-4 text-sm font-bold tracking-[0.2em] text-yellow-400">
                    <span className="text-white">-----</span>
                    {eyebrow}
                    <span className="text-white">-----</span>
                </p>

                {/* Heading */}
                <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
                    {title}{" "}
                    <span className="text-yellow-400">
                        {highlight}
                    </span>
                </h1>

                {/* Description */}
                <p className="mt-6 max-w-2xl text-lg leading-8 text-green-100">
                    {description}
                </p>

            </div>
        </section>
    );
}

export default PageHero;