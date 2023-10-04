import StoryForm from '@/composedComponents/StoryForm/StoryForm'
import PageWrapper from '@/composedComponents/PageWrapper'
import withAuth from "@/HOC/withAuth"
import withProfile from "@/HOC/withProfile"

function Record() {
    return (
        <PageWrapper path="record">
            <h2 className="m-0">Add a story</h2>
            <StoryForm></StoryForm>
        </PageWrapper>
    )
}

export default withAuth(withProfile(Record))
