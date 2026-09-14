function SectionHeading({ eyebrow, title, description }) {
    return (
        <div className="mx-auto mb-12 max-w-2xl text-center pt-10">

            <p className="mb-3 text-sm font-bold tracking-[0.2em] text-green-700">
                {eyebrow}
            </p>

            <h2 className="mb-4 text-3xl font-bold text-green-950 md:text-4xl">
                {title}
            </h2>

            <p className="leading-7 text-gray-600">
                {description}
            </p>

        </div>
    );
}

export default SectionHeading;