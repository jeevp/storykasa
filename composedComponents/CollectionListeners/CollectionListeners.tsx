import React, {useState} from "react";
import Library from "@/models/Library";
import STKButton from "@/components/STKButton/STKButton";
import {Trash} from "@phosphor-icons/react";
import LibraryHandler from "@/handlers/LibraryHandler";
import {useProfile} from "@/contexts/profile/ProfileContext";
import {useLibrary} from "@/contexts/library/LibraryContext";
import {useSnackbar} from "@/contexts/snackbar/SnackbarContext";
export default function CollectionListeners({ library, onClose = () => ({}) }: { library: Library | null, onClose: () => void }) {
    // Contexts
    const { currentProfileId } = useProfile()
    const { setCurrentLibrary } = useLibrary()
    const { setSnackbarBus } = useSnackbar()

    // States
    const [loading, setLoading] = useState(false)
    const [confirmDeleteAction, setConfirmDeleteAction] = useState(false)
    const [listenerToBeDeleted, setListenerToBeDeleted] = useState(null)

    const handleShowConfirmDeleteListener = (listener: any) => {
        setConfirmDeleteAction(true)
        setListenerToBeDeleted(listener)
    }

    const handleDeleteListener = async () => {
        try {
            setLoading(true)
            await LibraryHandler.removeListener({
                profileId: currentProfileId,
                // @ts-ignore
                libraryId: library?.libraryId
            }, {
                // @ts-ignore
                listenerAccountId: listenerToBeDeleted?.accountId
            })

            const _currentLibrary = new Library({
                ...library,
                // @ts-ignore
                listeners: library?.listeners.filter((listener) => {
                    // @ts-ignore
                    return listener.accountId !== listenerToBeDeleted?.accountId
                })
            })

            setCurrentLibrary(_currentLibrary)

            setSnackbarBus({
                active: true,
                message: "Listener removed with success!",
                type: "success"
            })

            if (_currentLibrary?.listeners?.length === 0) {
                onClose()
            }
        } catch {
            setSnackbarBus({
                active: true,
                message: "Ops! Something went wrong.",
                type: "error"
            })
        } finally {
            setLoading(false)
        }
    }


    return (
        <ul className="m-0 p-0 max-h-72 overflow-auto">
            {library?.listeners?.map((listener, index) => (
                <li key={index} className="flex first:mt-0 mt-2 items-center justify-between bg-neutral-100 rounded-2xl px-4 py-2 h-10 list-none text-gray-700">
                    <div>
                        <label>
                            {
                                // @ts-ignore
                                listener?.name
                            }
                        </label>
                    </div>
                    <div>
                        {
                            // @ts-ignore
                            confirmDeleteAction && listener?.accountId === listenerToBeDeleted?.accountId ? (
                            <STKButton
                            loading={loading}
                            color="error"
                            slim
                            onClick={handleDeleteListener}>
                                Yes, remove listener
                            </STKButton>
                        ) : (
                            <STKButton iconButton onClick={() => handleShowConfirmDeleteListener(listener)}>
                                <Trash />
                            </STKButton>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    )
}
