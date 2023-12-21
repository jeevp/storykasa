import React, {useEffect, useState} from 'react';
import STKDialog from "@/components/STKDialog/STKDialog";
import STKButton from "@/components/STKButton/STKButton";
import useDevice from "@/customHooks/useDevice";
import STKSnackbar from "@/components/STKSnackbar/STKSnackbar";
import {useSnackbar} from "@/contexts/snackbar/SnackbarContext";
import LibraryHandler from "@/handlers/LibraryHandler";
import {useLibrary} from "@/contexts/library/LibraryContext";
import Story from "@/models/Story";
import STKSelect from "@/components/STKSelect/STKSelect";
import {useProfile} from "@/contexts/profile/ProfileContext";
import Library from "@/models/Library";


interface AddStoryToLibraryDialogProps {
    open: boolean;
    story: Story
    onClose?: () => void;
    onSuccess?: () => void;
}

export default function AddStoryToLibraryDialog({
    open,
    story,
    onClose = () => ({}),
    onSuccess = () => ({})
}: AddStoryToLibraryDialogProps) {
    const { onMobile } = useDevice()
    const { setSnackbarBus } = useSnackbar()

    const [selectedLibraryId, setSelectedLibraryId] = useState("")
    const [loading, setLoading] = useState(false)
    const [showSnackbar, setShowSnackbar] = useState(false)

    // Contexts
    const { libraries, setLibraries } = useLibrary()
    const { currentProfileId } = useProfile()

    // Mounted
    useEffect(() => {
        handleFetchLibraries()
    }, []);

    // Methods
    const handleFetchLibraries = async () => {
        await LibraryHandler.fetchLibraries(setLibraries)
    }

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
                message: "Story added to library with success",
                type: "success"
            })

            onSuccess()
            onClose()
        } finally {
            setLoading(false)
        }
    }

    const handleLibraryOnChange = (library: Library) => {
        setSelectedLibraryId(library.libraryId)
    }

    return (
        <STKDialog
        active={open}
        maxWidth="xs"
        title="Add story to library"
        fullScreen={onMobile}
        onClose={() => onClose()}>
            <div>
                <div className="mt-6">
                    <p className="mt-2">Choose the library you wish to add this story to</p>
                    <div className="mt-4">
                        <STKSelect
                        options={libraries}
                        optionLabel="libraryName"
                        optionValue="libraryName"
                        // @ts-ignore
                        value={libraries.find(library => library?.libraryId === selectedLibraryId)}
                        onChange={handleLibraryOnChange} />
                    </div>
                </div>
                <div className="mt-8 flex items-center justify-end flex-col lg:flex-row">
                    <div className="w-full lg:w-auto">
                        <STKButton fullWidth={onMobile} variant="outlined" onClick={() => onClose()}>
                            Cancel
                        </STKButton>
                    </div>
                    <div className="lg:ml-2 ml-0 mt-2 lg:mt-0 w-full lg:w-auto">
                        <STKButton
                        fullWidth={onMobile}
                        color="primary"
                        loading={loading}
                        onClick={handleSave}>
                            Save
                        </STKButton>
                    </div>
                </div>
            </div>
            <STKSnackbar
            open={showSnackbar}
            message="Story updated with success"
            onClose={() => setShowSnackbar(false)} />
        </STKDialog>
    )
}
