import React, { useEffect, useState } from "react";
import STKDialog from "@/components/STKDialog/STKDialog";
import STKButton from "@/components/STKButton/STKButton";
import useDevice from "@/customHooks/useDevice";
import StoryHandler from "@/handlers/StoryHandler";
import STKTextField from "@/components/STKTextField/STKTextField";
import STKSnackbar from "@/components/STKSnackbar/STKSnackbar";
import { useSnackbar } from "@/contexts/snackbar/SnackbarContext";
import { useProfile } from "@/contexts/profile/ProfileContext";
import { useStory } from "@/contexts/story/StoryContext";
import Story from "@/models/Story";
import LibraryHandler from "@/handlers/LibraryHandler";
import {useLibrary} from "@/contexts/library/LibraryContext";
import Library from "@/models/Library";

interface DeleteStoryDialogProps {
  open: boolean;
  collection: any;
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function EditCollectionDialog({
  open,
  collection,
  onClose = () => ({}),
  onSuccess = () => ({}),
}: DeleteStoryDialogProps) {
  const { onMobile } = useDevice();
  const { setSnackbarBus } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [collectionName, setCollectionName] = useState("");

  const { currentProfileId } = useProfile();
  const { libraries, setLibraries } = useLibrary()
  const { setStoryNarrators, setStoryLanguages } = useStory();

  // Watchers
  useEffect(() => {
    if (collection) {
      setCollectionName(collection?.libraryName);
    }
  }, [collection]);

  // Methods
  const handleOnChange = (key: string, value: string) => {
    if (key === "collectionName") setCollectionName(value);
  };

  const handleFetchStoryFilters = async () => {
    const { narrators, languages } = await StoryHandler.fetchStoriesFilters({
      profileId: currentProfileId,
    });

    setStoryNarrators(narrators);
    setStoryLanguages(languages);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const updatedLibrary = await LibraryHandler.updateLibrary({
        profileId: currentProfileId,
        libraryId: collection.libraryId
      }, {
        libraryName: collectionName
      })

      const _libraries = libraries.map((_library: Library) => {
         if (_library.libraryId === collection.libraryId) {
           return new Library({
             ...collection,
             libraryName: collectionName
           })
         }

         return _library
      })

      // @ts-ignore
      setLibraries(_libraries)

      setSnackbarBus({
        active: true,
        message: "Collection updated with success",
        type: "success",
      });

      onSuccess();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <STKDialog
      active={open}
      maxWidth="sm"
      title="Edit Collection"
      fullScreen={onMobile}
      onClose={() => onClose()}
    >
      <div>
        <div className="mt-6">
          <div>
            <label className="font-semibold">Collection Name</label>
            <div className="mt-2">
              <STKTextField
                fluid
                value={collectionName}
                placeholder="Collection name"
                onChange={(value: string) => handleOnChange("collectionName", value)}
              />
            </div>
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
              onClick={handleSave}
            >
              Save
            </STKButton>
          </div>
        </div>
      </div>
      <STKSnackbar
        open={showSnackbar}
        message="Collection updated with success"
        onClose={() => setShowSnackbar(false)}
      />
    </STKDialog>
  );
}
