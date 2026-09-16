import { Mail, Time } from "../../components/common/Icons";
import PageHero from "../../components/common/PageHero";

function Contact() {
    return (
        <div className="contact-page">

            <PageHero
                breadcrumb="Contact Us"
                eyebrow="GET IN TOUCH"
                title="We Would Love to"
                highlight="Hear From You"
                description="Whether you have a question, want to learn more about Greenfield School, or are ready to begin your child's journey with us, our team is here to help."
            />

            <aside className="px-6 py-20">
                <div className="mx-auto grid max-w-6xl items-start gap-16 md:grid-cols-2">

                    <div className="space-y-8">
                        <div>
                            <h2 className="allura text-5xl text-green-950">
                                Get in <span className="italic font-serif">Touch</span>
                            </h2>
                            <div className="mt-2 h-1 w-10 bg-yellow-400"></div>

                            <p className="mt-4 max-w-lg text-base leading-relaxed text-gray-600">
                                Complete the form below or reach out to us directly via email or phone.
                                We look forward to connecting with you!. For Urgent Inquiries, please call us directly at <span className="font-bold text-green-900">+234 000 000 0000</span>.
                            </p>
                        </div>

                        <div className="space-y-6 pt-2">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100/60 text-emerald-900">
                                    <Mail size={16} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-emerald-950">General Enquiries</h4>
                                    <a
                                        href="mailto:info@greenfieldschool.com"
                                        className="text-sm text-emerald-800 hover:underline"
                                    >
                                        info@greenfieldschool.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100/60 text-emerald-900">
                                    <Mail size={16} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-emerald-950">Admissions</h4>
                                    <a
                                        href="mailto:admissions@greenfieldschool.com"
                                        className="text-sm text-emerald-800 hover:underline"
                                    >
                                        admissions@greenfieldschool.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100/60 text-emerald-900">
                                    <Time size={16} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-emerald-950">Office Hours</h4>
                                    <p className="text-sm text-gray-600">Monday – Friday: 8:00am – 4:00pm</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form className="w-full space-y-5 rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">                        <div>
                        <h3 className="text-2xl font-serif font-semibold text-emerald-950">
                            Send Us a Message
                        </h3>
                        <p className="mt-1 text-xs text-gray-500">
                            We'll respond within 24 hours.
                        </p>
                    </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="first_name" className="block text-[11px] font-bold tracking-wider text-emerald-950 uppercase">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="first_name"
                                    name="first_name"
                                    placeholder="First name"
                                    className="mt-1.5 block w-full rounded-lg border border-gray-200 bg-emerald-50/20 px-3.5 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-emerald-800 focus:bg-white focus:ring-1 focus:ring-emerald-800"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="last_name" className="block text-[11px] font-bold tracking-wider text-emerald-950 uppercase">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="last_name"
                                    name="last_name"
                                    placeholder="Last name"
                                    className="mt-1.5 block w-full rounded-lg border border-gray-200 bg-emerald-50/20 px-3.5 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-emerald-800 focus:bg-white focus:ring-1 focus:ring-emerald-800"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-[11px] font-bold tracking-wider text-emerald-950 uppercase">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                placeholder="+234 000 000 0000"
                                className="mt-1.5 block w-full rounded-lg border border-gray-200 bg-emerald-50/20 px-3.5 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-emerald-800 focus:bg-white focus:ring-1 focus:ring-emerald-800"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-[11px] font-bold tracking-wider text-emerald-950 uppercase">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="your@email.com"
                                className="mt-1.5 block w-full rounded-lg border border-gray-200 bg-emerald-50/20 px-3.5 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-emerald-800 focus:bg-white focus:ring-1 focus:ring-emerald-800"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="campus" className="block text-[11px] font-bold tracking-wider text-emerald-950 uppercase">
                                Campus / School <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="campus"
                                name="campus"
                                defaultValue=""
                                className="mt-1.5 block w-full rounded-lg border border-gray-200 bg-emerald-50/20 px-3.5 py-2.5 text-sm text-gray-600 outline-none focus:border-emerald-800 focus:bg-white focus:ring-1 focus:ring-emerald-800"
                                required
                            >
                                <option value="" disabled hidden>
                                    Which school are you contacting?
                                </option>
                                <option value="campus_a">Campus A</option>
                                <option value="campus_b">Campus B</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-[11px] font-bold tracking-wider text-emerald-950 uppercase">
                                Message <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows="4"
                                placeholder="How can we help you?"
                                className="mt-1.5 block w-full rounded-lg border border-gray-200 bg-emerald-50/20 px-3.5 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-emerald-800 focus:bg-white focus:ring-1 focus:ring-emerald-800"
                                required
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-[#d44829] py-3 text-xs font-semibold tracking-wider text-white uppercase transition-colors hover:bg-[#b83b1f]"
                        >
                            Send Message
                        </button>
                    </form>
                </div>

            </aside>

        </div>
    );
}

export default Contact;