import STKCard from "@/components/STKCard/STKCard";
import { Books } from "@phosphor-icons/react";
import Library from "@/models/Library";
import STKButton from "@/components/STKButton/STKButton";
import SharedLibraryInvitation from "@/models/SharedLibraryInvitation";
import SharedLibraryInvitationHandler from "@/handlers/SharedLibraryInvitationHandler";
import { useEffect, useState } from "react";
import { useLibrary } from "@/contexts/library/LibraryContext";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import { green600, neutral800 } from "@/assets/colorPallet/colors";
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";
import STKMenu from "@/components/STKMenu/STKMenu";
import DeleteCollectionDialog from "../DeleteCollectionDialog/DeleteCollectionDialog";
import EditCollectionDialog from "@/composedComponents/EditCollectionDialog/EditCollectionDialog";
import {useAuth} from "@/contexts/auth/AuthContext";
import InfoDialog from "@/composedComponents/InfoDialog/InfoDialog";
import LibraryHandler from "@/handlers/LibraryHandler";
import {useProfile} from "@/contexts/profile/ProfileContext";
import {useSnackbar} from "@/contexts/snackbar/SnackbarContext";

export default function LibraryCard({
  library,
  showMenu,
  menuOptions = [],
  sharedLibraryInvitation,
  showListeners,
  onClick = () => ({}),
}: {
  library: Library;
  showMenu?: boolean;
  menuOptions?: any[];
  sharedLibraryInvitation?: SharedLibraryInvitation;
  showListeners?: boolean;
  onClick?: () => void;
}) {
  const { setSnackbarBus } = useSnackbar()
  const { currentUser } = useAuth()
  const { currentProfileId } = useProfile()

  const [internalSharedLibraryInvitation, setInternalSharedLibraryInvitation] =
    useState<SharedLibraryInvitation | null>(null);
  const [loadingAccept, setLoadingAccept] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [showEditCollectionName, setShowEditCollectionNameDialog] = useState(false);
  const [showDeleteCollectionName, setShowDeleteCollectionDialog] = useState(false);
  const [showLeaveCollectionDialog, setShowLeaveCollectionDialog] = useState(false)
  const [loadingLeaveCollection, setLoadingLeaveCollection] = useState(false)

  const DELETE_COLLECTION = "DELETE_COLLECTION";
  const EDIT_COLLECTION_NAME = "EDIT_COLLECTION_NAME";
  const LEAVE_COLLECTION = "LEAVE_COLLECTION"

  const {
    sharedLibraries,
    setSharedLibraries,
    setSharedLibraryInvitations,
    sharedLibraryInvitations,
  } = useLibrary();

  useEffect(() => {
    if (sharedLibraryInvitation) {
      setInternalSharedLibraryInvitation(sharedLibraryInvitation);
    }
  }, [sharedLibraryInvitation]);

  const handleAcceptSharedLibraryInvitation = async () => {
    setLoadingAccept(true);

    await SharedLibraryInvitationHandler.updateSharedLibraryInvitation(
      {
        // @ts-ignore
        sharedLibraryInvitationId: sharedLibraryInvitation.id,
      },
      {
        accept: true,
      }
    );

    // @ts-ignore
    setSharedLibraries([...sharedLibraries, library]);

    setSharedLibraryInvitations(
      // @ts-ignore
      sharedLibraryInvitations.filter((invitation) => {
        // @ts-ignore
        return (
          // @ts-ignore
          invitation.sharedLibraryInvitation.id !== internalSharedLibraryInvitation?.id
        );
      })
    );

    // @ts-ignore
    setInternalSharedLibraryInvitation(
      // @ts-ignore
      new SharedLibraryInvitation({ ...internalSharedLibraryInvitation, accept: true })
    );

    setLoadingAccept(false);
  };

  const handleMenuOnChange = (menu: Object) => {
    // @ts-ignore
    switch (menu?.value) {
      case EDIT_COLLECTION_NAME:
        setShowEditCollectionNameDialog(true);
        break;

      case DELETE_COLLECTION:
        setShowDeleteCollectionDialog(true);
        break;

      case LEAVE_COLLECTION:
        setShowLeaveCollectionDialog(true)
        break

      default:
        break;
    }
  };

  const handleRejectSharedLibraryInvitation = async () => {
    setLoadingReject(true);
    await SharedLibraryInvitationHandler.updateSharedLibraryInvitation(
      {
        // @ts-ignore
        sharedLibraryInvitationId: sharedLibraryInvitation.id,
      },
      {
        accept: false,
      }
    );

    setInternalSharedLibraryInvitation(
      // @ts-ignore
      new SharedLibraryInvitation({
        ...internalSharedLibraryInvitation,
        accept: false,
      })
    );

    setLoadingReject(false);
  };


  const handleLeaveCollection = async () => {
    try {
      setLoadingLeaveCollection(true)
      await LibraryHandler.removeListener({
        profileId: currentProfileId,
        libraryId: library?.libraryId
      }, {
        listenerAccountId: currentUser?.sub
      })

      setSnackbarBus({
        active: true,
        message: "You've left collection with success.",
        type: "success"
      })

      const _sharedLibraries = sharedLibraries.filter((sharedLibrary) => {
        return sharedLibrary.libraryId !== library?.libraryId
      })

      setSharedLibraries(_sharedLibraries)
    } catch {
      setSnackbarBus({
        active: true,
        message: "Ops! Something went wrong.",
        type: "error"
      })
    } finally {
      setLoadingLeaveCollection(false)
    }
  }

  return (
    <>
      {" "}
      <div className={`cursor-pointer`}>
        <STKCard>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              className={`${
                internalSharedLibraryInvitation ? "p-4" : "px-4 py-6"
              } flex justify-center flex-col w-42`}
              onClick={() => onClick()}
            >
              <div className="flex items-center h-full">
                <div>
                  <CollectionsBookmarkOutlinedIcon
                    sx={{ color: "#ccc", width: "32px", height: "32px" }}
                  />
                </div>
                <div className="flex flex-col ml-4">
                  <div className="overflow-hidden max-w-[180px] text-ellipsis">
                    <label className="font-semibold whitespace-nowrap">
                      {library.libraryName}
                    </label>
                  </div>
                  <div className="mt-1 flex items-center">
                    <div>
                      {!library.totalStories}
                      <label>
                        {library.totalStories !== 1
                          ? `${library.totalStories || 0} stories`
                          : "1 story"}
                      </label>
                    </div>
                    <div className="ml-4">
                      <label>{Math.ceil(library?.totalDuration / 60)} min</label>
                    </div>
                  </div>
                  {showListeners && (
                    <>
                      {library?.listeners?.length > 0 ? (
                        <div className="mt-2 flex items-center">
                          <PeopleAltOutlinedIcon
                            sx={{ color: green600, width: "16px", height: "16px" }}
                          />
                          <label className="ml-2 text-sm text-[#3d996d]">
                            Shared with {library?.listeners?.length} listeners
                          </label>
                        </div>
                      ) : (
                        <div className="mt-2 flex items-center">
                          <PeopleAltOutlinedIcon
                            sx={{ color: neutral800, width: "16px", height: "16px" }}
                          />
                          <label className="ml-2 text-sm text-[#292524]">Private</label>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {internalSharedLibraryInvitation ? (
                <div className="flex items-center justify-betwee mt-8">
                  <div>
                    <STKButton
                      variant="outlined"
                      onClick={handleRejectSharedLibraryInvitation}
                      loading={loadingReject}
                    >
                      Reject
                    </STKButton>
                  </div>
                  <div className="ml-2">
                    <STKButton
                      onClick={handleAcceptSharedLibraryInvitation}
                      loading={loadingAccept}
                    >
                      Accept
                    </STKButton>
                  </div>
                </div>
              ) : null}
            </div>
            {showMenu && (
                <div className="flex flex-col justify-end h-[110px] pr-2 pb-2">
                  <STKMenu
                      options={currentUser?.sub === library?.accountId ? [
                        { label: "Edit Collection", value: EDIT_COLLECTION_NAME },
                        { label: "Delete Collection", value: DELETE_COLLECTION },
                      ] : [{ label: "Leave collection", value: LEAVE_COLLECTION }]}
                      onChange={handleMenuOnChange}
                  />
                </div>
            )}
          </div>
        </STKCard>
      </div>
      <DeleteCollectionDialog
        open={showDeleteCollectionName}
        collection={library}
        onClose={() => setShowDeleteCollectionDialog(false)}
      />
      <EditCollectionDialog
        open={showEditCollectionName}
        collection={library}
        onClose={() => setShowEditCollectionNameDialog(false)} />
      <InfoDialog
        active={showLeaveCollectionDialog}
        onAction={handleLeaveCollection}
        title="Leave collection"
        loading={loadingLeaveCollection}
        text={`Are you sure about leaving ${library?.libraryName} collection?`}
        confirmationButtonText="Yes, leave collection"
        onClose={() => setShowLeaveCollectionDialog(false)} />
    </>
  );
}
