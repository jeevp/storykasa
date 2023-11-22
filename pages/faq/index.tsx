import PageWrapper from "@/composedComponents/PageWrapper"
import withAuth from "@/HOC/withAuth";
import withProfile from "@/HOC/withProfile";
import STKAccordion from "@/components/STKAccordion/STKAccordion";
import FAQContents from "@/contents/FAQ"

function Index() {
    return (
        <PageWrapper path="faq">
            <div>
                <h2 className="m-0 text-2xl">
                    FAQ
                </h2>
                <div className="mt-10 pb-10">
                    {FAQContents.map((FAQContent, index) => (
                        <div key={index} className="first:mt-0 mt-2">
                            <STKAccordion
                            title={FAQContent.question}
                            text={FAQContent.text}
                            list={FAQContent.list} />
                        </div>
                    ))}
                </div>
            </div>
        </PageWrapper>
    )
}


export default withAuth(withProfile((Index)))
