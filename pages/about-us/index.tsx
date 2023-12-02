import PageWrapper from "@/composedComponents/PageWrapper";
import {Divider} from "@mui/material";

export default function AboutUs() {
    return (
        <PageWrapper path="/about-us">
            <div className="pb-40">
                {/* Header Section */}
                <div className="container mx-auto">
                    <h1 className="container">About Us</h1>
                </div>

                <div className="mt-20">
                    <h2 className="text-2xl font-semibold pb-4">What is StoryKasa?</h2>
                    <div className="mt-4">
                        <p className="text-lg">
                            StoryKasa is a CA benefit corporation with a free audio storytelling platform.
                            The StoryKasa platform and app provide families and schools with an easy way to
                            create and listen to stories from around the world, in multiple languages, and
                            on any device.
                        </p>
                        <p className="mt-4 text-lg">
                            StoryKasa has its roots in a group project called Anansesem, which was developed as part
                            of the London School of Economics Executive MSc in Social Business and Entrepreneurship.
                            Group members (Raquel Pais, Jeffrey Agbai, Satish Borkar, Steven Yao, and
                            Rena Brar Prayaga), supported by local community volunteers, successfully piloted
                            a phone-based storytelling platform with children and families in Ghana.
                        </p>
                        <p className="mt-4 text-lg">
                            StoryKasa has built on this foundation and vision and invested in technology to create
                            a sustainable social business with a groundbreaking product and platform. Together,
                            Raquel, Jeff, Satish, and Steven provided a deep well of knowledge and expertise and
                            they continue to champion the StoryKasa mission!
                        </p>
                        <div className="mt-8">
                            <h3 className="text-xl">The StoryKasa name</h3>
                            <p className="mt-4 text-lg">
                                Kasa has many meanings that capture our vision for the storytelling platform. Kasa
                                means “to speak or talk” in Twi, which is a widely used language in Ghana. It also
                                means “umbrella” in Japanese. And, when spelled as casa it means “home” in Spanish.
                                So, for us, the meaning of StoryKasa is something like “a home or umbrella for spoken
                                stories.”
                            </p>
                        </div>
                        <div className="mt-24">
                            <div className="flex justify-center rounded-2xl" style={{ border: "1px solid #333" }}>
                                <div className="p-8 rounded-2xl">
                                    <p className="font-bold text-[#092b1b] text-3xl text-center" style={{ maxWidth: "24em" }}>Our mission is to spread stories and change lives.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-24">
                    <h2 className="text-2xl font-semibold pb-4">Our Commitment to Stories for Good</h2>
                    <div>
                        <p className="text-lg">
                            We promise to use stories to support underserved populations and communities in
                            need. There is substantial evidence that access to words and spoken language from
                            a young age enhances literacy skills necessary for success in life. StoryKasa is
                            using an innovative approach: free audio stories, at scale, to reach and serve more
                            people and to close the “word gap.”
                        </p>
                        <p className="mt-4 text-lg">
                            We hope to increase literacy and language development, fuel imagination, and improve
                            academic achievement and lifetime opportunities. Since family members, friends, and
                            teachers can record and share stories, it also preserves social connectedness, empathy,
                            and wellbeing across generations and cultures.
                        </p>
                    </div>
                </div>
                <div className="mt-24">
                    <div className="flex justify-center rounded-2xl" style={{ border: "1px solid #333" }}>
                        <div className="p-8 rounded-2xl">
                            <p className=" text-3xl font-bold text-center text-[#092b1b]" style={{ maxWidth: "26em" }}>Our vision is to create an audio storytelling ecosystem that is easy to use and accessible to all.</p>
                        </div>
                    </div>
                </div>
                <div className="mt-16">
                    <h2 className="text-2xl font-semibold pb-4">Our team and values</h2>
                    <div>
                        <div>
                            <label><span className="font-semibold text-xl">Rena Brar Prayaga</span>, Founder & CEO</label>
                            <p className="mt-2 text-lg">
                                Rena has worked as a lawyer, a behavioral data scientist, an innovator in mobile
                                health, and an evaluator in education. She is also a social entrepreneur and is
                                passionate about using technology to empower communities and accelerate positive
                                impact. StoryKasa has launched a free audio storytelling platform for children
                                and families and also offers a premium version of its product to individuals,
                                schools, and other organizations for a small fee.
                            </p>
                            <p className="mt-2 text-lg">
                                Rena has a BA in International Relations from Pomona College, a JD from USC Gould
                                School of Law, an MA in Experimental Psychology from UC San Diego, and an Executive
                                MSc in Social Business & Entrepreneurship from the London School of Economics. LinkedIn
                            </p>
                        </div>
                        <div className="py-6">
                            <Divider />
                        </div>
                        <div>
                            <label><span className="font-semibold text-xl">Felipe Fernandes</span>, Software Engineer</label>
                            <p className="mt-2 text-lg">
                                Felipe is a software engineer, specializing in developing and building
                                innovative software solutions from the ground up. His career has spanned various
                                roles, including a key position at a leading tech company in the fitness industry
                                in Amsterdam, where he played a vital role in serving over 3 million users. He
                                has also been instrumental in the technological growth of a major digital real
                                estate agency in Brazil.
                            </p>
                            <p className="mt-2 text-lg">
                                Felipe is passionate about using technology to create effective and impactful
                                solutions. At StoryKasa, he applies his extensive experience in software
                                {/* eslint-disable-next-line react/no-unescaped-entities */}
                                engineering to enhance and innovate the platform's offerings.
                            </p>
                        </div>
                        <div className="py-6">
                            <Divider />
                        </div>
                        <div>
                            <label className="font-semibold text-lg">Others who helped StoryKasa along the way</label>
                            <div className="mt-4">
                                <div>
                                    <label className="text-lg"><span className="font-semibold">Jeev Prayaga</span> – designed and developed prototype and MVP of StoryKasa platform</label>
                                </div>
                                <div>
                                    <label className="text-lg"><span className="font-semibold">Gyan Prayaga</span> –developed the initial audio program for the Ghana Anansesem Pilot</label>
                                </div>
                                <div>
                                    <label className="font-semibold text-lg">Anansesem Project Team</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-16">
                    <h2 className="text-2xl font-semibold pb-4">Our values</h2>
                    <div className="list-disc mt-4 flex flex-wrap -ml-2">
                        <div className="text-lg p-6 font-semibold bg-[#eaf8b3] rounded-2xl m-2 flex-1" style={{ border: "1px solid #333" }}>Listen to users with empathy and respect.</div>
                        <div className="text-lg p-6 font-semibold bg-[#eaf8b3] rounded-2xl m-2 max-w-xs" style={{ border: "1px solid #333" }}>Build to create better access for people worldwide.</div>
                        <div className="text-lg p-6 font-semibold bg-[#eaf8b3] rounded-2xl m-2 max-w-xs" style={{ border: "1px solid #333" }}>Keep learning and improving what we do.</div>
                        <div className="text-lg p-6 font-semibold bg-[#eaf8b3] rounded-2xl m-2 max-w-xs" style={{ border: "1px solid #333" }}>Share and adapt content freely and with attribution.</div>
                        <div className="text-lg p-6 font-semibold bg-[#eaf8b3] rounded-2xl m-2 flex-1" style={{ border: "1px solid #333" }}>Prioritize purpose and integrity over profit.</div>
                        <div className="text-lg p-6 font-semibold bg-[#eaf8b3] rounded-2xl m-2 max-w-xs" style={{ border: "1px solid #333" }}>Be adventurous, celebrate change, and have fun.</div>
                        <div className="text-lg p-6 font-semibold bg-[#eaf8b3] rounded-2xl m-2 max-w-xs" style={{ border: "1px solid #333" }}>Be just, equitable, antiracist, and inclusive.</div>
                        <div className="text-lg p-6 font-semibold bg-[#eaf8b3] rounded-2xl m-2 max-w-xs" style={{ border: "1px solid #333" }}>Embrace regenerative practices to protect the planet.</div>
                        <div className="text-lg p-6 font-semibold bg-[#eaf8b3] rounded-2xl m-2 flex-1" style={{ border: "1px solid #333" }}>Be humble.</div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    )
}
