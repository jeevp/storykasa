import StoryForm from '@/composedComponents/StoryForm/StoryForm'
import PageWrapper from '@/composedComponents/PageWrapper'
import withAuth from "@/HOC/withAuth"
import withProfile from "@/HOC/withProfile"

function Record() {
    return (
        <PageWrapper path="record" withPendoHelp>
            <div>
                <h2 className="m-0">Create a story</h2>
                <p className="mt-4 max-w-2xl">
                    Record a story of your own. Remember, only profiles on your account can view and listen to
                    your story. Feel free to enhance it with a description and illustrations or images
                </p>
            </div>
            <div className="mt-10">
                <StoryForm></StoryForm>
            </div>
        </PageWrapper>
    )
}

export default withAuth(withProfile(Record))
