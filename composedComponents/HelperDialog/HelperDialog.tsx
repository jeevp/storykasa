import STKDialog from "@/components/STKDialog/STKDialog";
import {useRouter} from "next/router";
import STKButton from "@/components/STKButton/STKButton";
import useDevice from "@/customHooks/useDevice";

interface HelperDialogProps {
    active: boolean
    onClose?: () => void
}

export default function HelperDialog({ active, onClose = () => ({}) }: HelperDialogProps) {
    const router = useRouter()

    const { onMobile} = useDevice()

    return (
        <STKDialog
        fullScreen={onMobile}
        maxWidth="xs"
        active={active}
        onClose={() => onClose()}>
            <h2 className="uppercase text-xs text-neutral-600 m-0">Helper Tooltip</h2>
            <div>
                {router.pathname === "/discover" && (
                    <>
                        <h3 className="text-2xl m-0">Discover</h3>
                        <p className="mt-4">
                            This is the place where you can find new stories.  Each story card displays the story length
                            in minutes, age group for the story, and the language. When you click on a story you get
                            a short summary and details about the author and narrator. All stories are in the public
                            domain or have a Creative Commons 4.0 license which means we can share them here without
                            any copyright issues.
                        </p>
                        <p className="mt-4">
                            You can also search for a story by using the search bar. Or use the filters to find stories
                            by  narrator, story length, in a particular language, or for a specific age group.
                        </p>
                        <p className="mt-4">
                            If you have any other questions, please email us at support@storykasa.com and we will get
                            back to you as soon as we can.
                        </p>
                    </>
                )}

                {router.pathname === "/library" && (
                    <>
                        <h3 className="text-2xl m-0">My Library</h3>
                        <p className="mt-4">
                            Each user has a private library or story collection. Your library will be empty when you
                            first visit StoryKasa. You can save your favorite stories from Discover and they will be
                            stored here. This is also where you can view any stories that you recorded. Your library
                            can only be viewed by members in your family or household.
                        </p>
                        <p className="mt-4">
                            We will be adding a new capability soon to allow you to share your recorded stories with
                            anyone you choose (even if they are not in your StoryKasa account).
                        </p>
                        <p className="mt-4">
                            If you have any other questions, please email us at support@storykasa.com and we will get
                            back to you as soon as we can.
                        </p>
                    </>
                )}

                {router.pathname === "/record" && (
                    <>
                        <h3 className="text-2xl m-0">Create a story</h3>
                        <p className="mt-4">
                            A few pointers before you record your story. It might be helpful to write it out or create
                            an outline of the main points. We recommend that you keep it short, and try to limit it
                            to about 5-10 minutes (with a maximum of 20 minutes). We will be adding a “how to create
                            a story” guide with a few ideas for story topics to help you get started
                        </p>
                        <p className="mt-4">
                            Start with a 15-20 second test recording to get comfortable with the process and play
                            it back to make sure the volume and sound quality are fine. Also try to be in a quiet
                            place and use a microphone if you have one.
                        </p>
                        <p className="mt-4">
                            If you have the story recorded already, you can simply upload it here but it needs
                            to be in mp3 format. You will notice that you can include illustrations as well. This
                            is a way for you and other members of your family to personalize your story and add
                            some color. Just complete your artwork, take a photo, and upload the image.
                        </p>
                        <p className="mt-4">
                            Don’t forget to save your story when you’re done. To view and listen to your new
                            story, click on My Library.
                        </p>
                        <p className="mt-4">
                            If you had trouble recording, uploading or saving your story, or have any other
                            questions, please email us at support@storykasa.com and we will get back to you as
                            soon as we can.
                        </p>
                    </>
                )}

                {router.pathname === "/profiles" && (
                    <>
                        <h3 className="text-2xl m-0">Profiles</h3>
                        <p className="mt-4">
                            We used your account name for your primary profile but you can edit this if you would
                            like a different profile name. You can add other family or household members to the
                            account, each with their own profile. You will be able to view each other’s stories
                            since you are all members of the same account. You are limited to 3 profiles in an
                            account.
                        </p>
                        <p className="mt-4">
                            If you have any other questions, please email us at support@storykasa.com and we
                            will get back to you as soon as we can.
                        </p>
                    </>
                )}
            </div>
            <div className="mt-6 flex justify-end">
                <STKButton onClick={() => onClose()}>Close</STKButton>
            </div>
        </STKDialog>
    )
}
