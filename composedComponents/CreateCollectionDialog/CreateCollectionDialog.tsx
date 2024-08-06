import React, {useState} from 'react';
import STKDialog from "@/components/STKDialog/STKDialog";
import STKButton from "@/components/STKButton/STKButton";
import useDevice from "@/customHooks/useDevice";
import STKTextField from "@/components/STKTextField/STKTextField";
import STKSnackbar from "@/components/STKSnackbar/STKSnackbar";
import {useSnackbar} from "@/contexts/snackbar/SnackbarContext";
import LibraryHandler from "@/handlers/LibraryHandler";
import {useLibrary} from "@/contexts/library/LibraryContext";
import {useProfile} from "@/contexts/profile/ProfileContext";
import STKSelect from "@/components/STKSelect/STKSelect";
import {useOrganization} from "@/contexts/organizations/OrganizationContext";
import Organization from "@/service/models/Organization";


interface CreateSharedLibraryDialogProps {
    open: boolean;
    onClose?: () => void;
    onSuccess?: () => void;
}

export default function CreateCollectionDialog({
    open,
    onClose = () => ({}),
    onSuccess = () => ({})
}: CreateSharedLibraryDialogProps) {
    const { onMobile } = useDevice()
    const { setSnackbarBus } = useSnackbar()
    const { userOrganizations } = useOrganization()

    const [loading, setLoading] = useState(false)
    const [showSnackbar, setShowSnackbar] = useState(false)
    const [libraryName, setLibraryName] = useState("")
    const [organization, setOrganization] = useState<Organization | null>(null)

    // Contexts
    const { libraries, setLibraries } = useLibrary()
    const { currentProfileId } = useProfile()

    // Methods
    const handleOrganizationOnSelect = (selectedOrganization: Organization) => {
            setOrganization(selectedOrganization)
    }

    const handleSave = async () => {
        try {
            setLoading(true)

            const library = await LibraryHandler.createLibrary({
                libraryName,
                listenersEmails: [],
                organizationId: organization ? organization.id : null,
                profileId: currentProfileId
            })

            // @ts-ignore
            setLibraries([...libraries, library])

            setSnackbarBus({
                active: true,
                message: "Collection created with success",
                type: "success"
            })

            onSuccess()
            onClose()
        } finally {
            setLoading(false)
        }
    }


    return (
        <STKDialog
        active={open}
        maxWidth="xs"
        title="Create collection"
        fullScreen={onMobile}
        onClose={() => onClose()}>
            <div>
                <div className="mt-6">
                    <div>
                        <label className="font-semibold">Title</label>
                        <div className="mt-2">
                            <STKTextField
                            fluid
                            value={libraryName}
                            placeholder="Type the collection title"
                            onChange={(value: string) => setLibraryName(value)}/>
                        </div>
                    </div>
                    {userOrganizations.length > 0 && (
                        <div className="mt-4">
                            <label className="font-semibold">Organization <span className="font-normal text-sm">(optional)</span></label>
                            <p className="text-sm mt-1">You can assign this collection to an organization by selecting one bellow:</p>
                            <div className="mt-2">
                                <STKSelect
                                value={userOrganizations.find((org) => org.id === organization?.id)}
                                clearable
                                options={userOrganizations}
                                optionLabel="name"
                                optionValue="name"
                                fluid
                                onClear={() => setOrganization(null)}
                                onChange={handleOrganizationOnSelect}/>
                            </div>
                        </div>
                    )}
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
                        disabled={!libraryName}
                        onClick={handleSave}>
                            Create collection
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
