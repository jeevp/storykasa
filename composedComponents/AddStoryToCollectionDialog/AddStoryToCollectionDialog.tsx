import React, {useEffect, useState} from 'react';
import STKDialog from "@/components/STKDialog/STKDialog";
import STKButton from "@/components/STKButton/STKButton";
import useDevice from "@/customHooks/useDevice";
import {useSnackbar} from "@/contexts/snackbar/SnackbarContext";
import LibraryHandler from "@/handlers/LibraryHandler";
import {useLibrary} from "@/contexts/library/LibraryContext";
import Story from "@/models/Story";
import STKSelect from "@/components/STKSelect/STKSelect";
import {useProfile} from "@/contexts/profile/ProfileContext";
import Library from "@/models/Library";


interface AddStoryToCollectionDialogProps {
    open: boolean;
    story: Story
    onClose?: () => void;
    onSuccess?: () => void;
}

export default function AddStoryToCollectionDialog({
    open,
    story,
    onClose = () => ({}),
    onSuccess = () => ({})
}: AddStoryToCollectionDialogProps) {
    const { onMobile } = useDevice()
    const { setSnackbarBus } = useSnackbar()

    const [error, setError] = useState("")
    const [selectedLibraryId, setSelectedLibraryId] = useState("")
    const [loading, setLoading] = useState(false)

    // Contexts
    const { libraries} = useLibrary()
    const { currentProfileId } = useProfile()

    // Mounted
    useEffect(() => {
        setSelectedLibraryId("")
        setError("")
        setLoading(false)
    }, [])


    const handleSave = async () => {
        try {
            setLoading(true)
            await LibraryHandler.addStory({
                storyId: story.storyId,
                libraryId: selectedLibraryId,
                profileId: currentProfileId
            })

            setSnackbarBus({
                active: true,
                message: "Story added to collection with success",
                type: "success"
            })

            onSuccess()
            onClose()
        } catch (error) {
            // @ts-ignore
            if (error?.request?.status === 409) {
                setError("Story already added to this collection")
            }
        } finally {
            setLoading(false)
        }
    }

    const handleLibraryOnChange = (library: Library) => {
        setError("")
        setSelectedLibraryId(library.libraryId)
    }

    const handleOnClose = (e: any) => {
        e.stopPropagation()
        onClose()
    }

    console.log({ libraries })
    return (
        <STKDialog
        active={open}
        maxWidth="xs"
        title="Add story to collection"
        fullScreen={onMobile}
        onClose={handleOnClose}>
            <div>
                <div className="mt-6">
                    <p className="mt-2">Choose the collection you wish to add this story to</p>
                    <div className="mt-4">
                        <STKSelect
                        options={libraries}
                        optionLabel="libraryName"
                        optionValue="libraryName"
                        placeholder="Select a collection"
                        fluid={onMobile}
                        // @ts-ignore
                        onChange={handleLibraryOnChange} />
                    </div>
                </div>
                {error && (
                    <div className="mt-2">
                        <label className="text-red-600 text-sm">{error}</label>
                    </div>
                )}
                <div className="mt-8 flex items-center justify-end flex-col lg:flex-row">
                    <div className="w-full lg:w-auto">
                        <STKButton fullWidth={onMobile} variant="outlined" onClick={() => onClose()}>
                            Cancel
                        </STKButton>
                    </div>
                    <div className="lg:ml-2 ml-0 mt-2 lg:mt-0 w-full lg:w-auto">
                        <STKButton
                        fullWidth={onMobile}
                        disabled={Boolean(error)}
                        color="primary"
                        loading={loading}
                        onClick={handleSave}>
                            Add story
                        </STKButton>
                    </div>
                </div>
            </div>
        </STKDialog>
    )
}
