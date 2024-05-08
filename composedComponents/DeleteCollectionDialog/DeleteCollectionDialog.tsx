import React, {useState} from 'react';
import STKDialog from "@/components/STKDialog/STKDialog";
import STKButton from "@/components/STKButton/STKButton";
import {Trash} from "@phosphor-icons/react";
import useDevice from "@/customHooks/useDevice";
import {useSnackbar} from "@/contexts/snackbar/SnackbarContext";
import LibraryHandler from "@/handlers/LibraryHandler";
import {useProfile} from "@/contexts/profile/ProfileContext";
import {useLibrary} from "@/contexts/library/LibraryContext";
import Library from "@/models/Library";


interface DeleteCollectionDialogProps {
    open: boolean;
    collection: Library;
    onClose?: () => void;
    onSuccess?: () => void;
}

export default function DeleteCollectionDialog({
    open,
    collection,
    onClose = () => ({}),
    onSuccess = () => ({})
}: DeleteCollectionDialogProps) {
    const { setSnackbarBus } = useSnackbar()
    const { onMobile } = useDevice()

    // Contexts
    const { currentProfileId } = useProfile()
    const { libraries, setLibraries } = useLibrary()

    // States
    const [loading, setLoading] = useState(false)

    // Methods
    const handleDeleteCollection = async () => {
        if (collection) {
            try {
                setLoading(true)
                await LibraryHandler.deleteLibrary({
                    profileId: currentProfileId,
                    libraryId: collection?.libraryId
                })
                setSnackbarBus({
                    active: true,
                    message: "Collection deleted with success",
                    type: "success"
                })

                const _libraries = libraries.filter((_library: Library) => {
                    return _library.libraryId !== collection.libraryId
                })

                // @ts-ignore
                setLibraries(_libraries)

                onSuccess()
                onClose()
            } finally {
                setLoading(false)
            }
        }
    }


    return (
        <STKDialog title="Delete collection" active={open} onClose={() => onClose()}>
            <div>
                <p className="mt-4">
                    Are you sure you want to delete <span className="font-semibold">&ldquo;{collection?.libraryName}&rdquo;</span> ? Deleting a collection is
                    permanent and cannot be undone.
                </p>
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
                        startIcon={<Trash size={20} />}
                        loading={loading}
                        onClick={handleDeleteCollection}>
                            Yes, delete collection
                        </STKButton>
                    </div>
                </div>
            </div>
        </STKDialog>
    )
}
