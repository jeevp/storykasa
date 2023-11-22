import PageWrapper from "@/composedComponents/PageWrapper"
import withAuth from "@/HOC/withAuth";
import withProfile from "@/HOC/withProfile";
import STKAccordion from "@/components/STKAccordion/STKAccordion";
import FAQContents from "@/contents/FAQ"

function Index() {
    return (
        <PageWrapper path="faq">
            <div className="pb-10">
                <h2 className="m-0 text-2xl">
                    FAQ
                </h2>
                <div className="mt-4">
                    <p className="text-base">Explore answers to common questions about StoryKasa and enhance your storytelling journey with us.</p>
                </div>
                <div className="mt-10">
                    {FAQContents.map((FAQContent, index) => (
                        <div key={index} className="first:mt-0 mt-2">
                            <STKAccordion
                            title={FAQContent.question}
                            text={FAQContent.text}
                            list={FAQContent.list} />
                        </div>
                    ))}
                </div>
                <div className="mt-10">
                    <p className="m-0">
                        If you have any other questions that were not addressed here, please feel free to email us
                        at <a href="mailto:help@storykasa.com">help@storykasa.com</a> and we will try to get back to you within 24 hours.
                    </p>

                </div>
            </div>
        </PageWrapper>
    )
}


export default withAuth(withProfile((Index)))
