import StoryCard, {
  REMOVE_FROM_COLLECTION_MENU_OPTION,
  COPY_PUBLIC_LINK_MENU_OPTION
} from "@/composedComponents/StoryCard/StoryCard";
import { useEffect, useState } from "react";
import StoryDetails from "@/composedComponents/StoryDetails/StoryDetails";
import PageWrapper from "@/composedComponents/PageWrapper";
import { AnimatePresence, motion } from "framer-motion";
import { MagnifyingGlass, SmileyMeh } from "@phosphor-icons/react";
import useDevice from "@/customHooks/useDevice";
import StoryDetailsDialog from "@/composedComponents/StoryDetailsDialog/StoryDetailsDialog";
import STKTooltip from "@/composedComponents/STKTooltip/STKTooltip";
import STKTextField from "@/components/STKTextField/STKTextField";
import Link from "next/link";
import withAuth from "@/HOC/withAuth";
import withProfile from "@/HOC/withProfile";
import Story from "@/models/Story";
import STKSkeleton from "@/components/STKSkeleton/STKSkeleton";
import StoryCardSkeleton from "@/composedComponents/StoryCard/StoryCardSkeleton";
import { Divider } from "@mui/material";
import { useStory } from "@/contexts/story/StoryContext";
import StoryFiltersSummary from "@/composedComponents/StoryFilters/StoryFiltersSummary/StoryFiltersSummary";
import { neutral300 } from "@/assets/colorPallet/colors";
import { useRouter } from "next/router";
import LibraryHandler from "@/handlers/LibraryHandler";
import { useLibrary } from "@/contexts/library/LibraryContext";
import STKButton from "@/components/STKButton/STKButton";
import { ArrowBack } from "@mui/icons-material";
import AddListenerDialog from "@/composedComponents/AddListenerDialog/AddListenerDialog";
import ListenersDialog from "@/composedComponents/ListenersDialog/ListenersDialog";
import { useProfile } from "@/contexts/profile/ProfileContext";
import { useAuth } from "@/contexts/auth/AuthContext";

function Library() {
  const router = useRouter();
  // States
  const [showListenersDialog, setShowListenersDialog] = useState<boolean>(false);

  const { onMobile } = useDevice();
  const { currentProfileId } = useProfile();
  const [filterQuery, setFilterQuery] = useState("");
  const [selectedStory, setSelectedStory] = useState<Story | undefined>();
  const [loaded, setLoaded] = useState(false);
  const [showStoryDetailsDialog, setShowStoryDetailsDialog] = useState(false);
  const [stories, setStories] = useState([]);
  const [showAddListenerDialog, setShowAddListenerDialog] = useState(false);

  // Contexts
  const { storyFilters } = useStory();
  const {
    currentLibraryStories,
    setCurrentLibraryStories,
    currentLibrary,
    setCurrentLibrary,
  } = useLibrary();

  const { currentUser } = useAuth();

  // Watchers
  useEffect(() => {
    if (currentLibraryStories) {
      setStories([...currentLibraryStories]);
    }
  }, [currentLibraryStories]);

  const handleFilterQueryChange = (value: string) => {
    setFilterQuery(value);
    const filteredStories = currentLibraryStories.filter((story: Story) => {
      return story?.title?.toLowerCase()?.includes(value.toLowerCase());
    });

    setStories(filteredStories);
  };

  const loadStories = async () => {
    await LibraryHandler.fetchLibraryDetails(
      {
        profileId: currentProfileId,
        libraryId: String(router.query.libraryId),
      },
      { setCurrentLibrary }
    );

    const libraryStories: Story[] = await LibraryHandler.fetchStories({
      libraryId: String(router.query.libraryId),
    });

    // @ts-ignore
    setCurrentLibraryStories(libraryStories);
    // @ts-ignore
    setStories(libraryStories);
    setLoaded(true);
  };

  const handleStoryClick = (story: Story) => {
    setSelectedStory(story);
    if (onMobile) setShowStoryDetailsDialog(true);
  };

  const disableSearchAndFilters = () => {
    return currentLibraryStories?.length === 0 && Object.keys(storyFilters).length === 0;
  };

  useEffect(() => {
    if (router?.query?.libraryId) {
      loadStories();
    }
  }, [router]);

  const gotToLibrariesPage = async () => {
    await router.push("/collections", "", {
      shallow: true,
    });
  };

  console.log({ currentLibrary })

  return (
    <PageWrapper path="library">
      <div>
        <div className="flex justify-between">
          <div className=" flex items-center w-full lg:w-auto mt-4 lg:mt-0">
            <STKButton iconButton onClick={gotToLibrariesPage}>
              <ArrowBack />
            </STKButton>
            <h2 className="m-0 text-2xl ml-2 items-center">
              {router.query.libraryName}
              <span>
                <STKTooltip title="Stories in your library are private to your account, but can be accessed from any of your profiles."/>
              </span>
            </h2>
          </div>
          <div className="hidden lg:block">
            <STKButton
              fullWidth={onMobile}
              onClick={() => setShowAddListenerDialog(true)}
            >
              Add listener
            </STKButton>
          </div>
        </div>
        <div className="flex md:flex-row items-center mt-2 mb-4">
          {currentLibrary && (
            <>
              {
                // @ts-ignore
                currentLibrary?.profile?.profileName && (
                  <div>
                    <label className="text-sm">
                      Collection created by{" "}
                      {
                        // @ts-ignore
                        currentLibrary?.profile?.profileName
                      }
                    </label>
                  </div>
                )
              }

              {currentLibrary?.listeners?.length > 0 && (
                <>
                  <div className="px-2 md:px-4">
                    <Divider orientation="vertical" sx={{ height: "20px" }} />
                  </div>
                  {currentLibrary?.accountId === currentUser?.sub ? (
                    <STKButton
                      variant="text"
                      slim
                      onClick={() => setShowListenersDialog(true)}
                    >
                      <span className="font-semibold mr-1">
                        {currentLibrary?.listeners?.length}
                      </span>{" "}
                      listeners
                    </STKButton>
                  ) : (
                    <label className="text-sm">
                      <span className="font-semibold mr-1">
                        {currentLibrary?.listeners?.length}
                      </span>{" "}
                      listeners
                    </label>
                  )}
                </>
              )}
            </>
          )}
        </div>
        <div className="mt-4 w-full">
          {!loaded ? (
            <div className="mb-10">
              <STKSkeleton width={onMobile ? "300px" : "500px"} height="20px" />
              <div className="mt-1">
                <STKSkeleton width={onMobile ? "200px" : "300px"} height="20px" />
              </div>
            </div>
          ) : (
            <div className="flex w-full flex-col lg:flex-row justify-between">
              <div className="w-full">
                {currentLibraryStories.length ||
                (currentLibraryStories.length === 0 &&
                  Object.keys(storyFilters).length > 0) ? (
                  <p>This is the home for the stories you save or record.</p>
                ) : currentLibraryStories.length === 0 &&
                  Object.keys(storyFilters).length === 0 ? (
                  <div className="bg-[#f5efdc] box-border flex flex-col items-center p-5 rounded-lg text-center w-full">
                    <p className="text-lg text-gray-800 font-semibold text-center max-w-[240px] lg:max-w-lg">
                      {/* eslint-disable-next-line react/no-unescaped-entities */}
                      Your collection is empty!
                    </p>
                    <p className="text-md text-gray-600 my-3 max-w-[240px] lg:max-w-lg">
                      You can add stories from your library to this collection.
                    </p>
                    <div className="mt-8 flex flex-col lg:flex-row">
                      <Link href="/discover">
                        <STKButton variant="outlined" fullWidth>
                          Add story from my library
                        </STKButton>
                      </Link>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
          <div className="block lg:hidden mt-4">
            <STKButton
              fullWidth={onMobile}
              onClick={() => setShowAddListenerDialog(true)}
            >
              Add listener
            </STKButton>
          </div>
        </div>
        {currentLibraryStories.length === 0 && Object.keys(storyFilters).length === 0 ? (
          <></>
        ) : (
          <>
            <div
              className={`w-full flex flex-col lg:flex-row mb-10 mt-10 justify-between ${
                disableSearchAndFilters() ? "disabled" : ""
              }`}
            >
              <div className="w-full max-w-xl">
                <STKTextField
                  placeholder="Search in my library..."
                  value={filterQuery}
                  fluid
                  startAdornment={<MagnifyingGlass size="20" />}
                  onChange={handleFilterQueryChange}
                />
              </div>
            </div>
            {Object.keys(storyFilters).length > 0 ? (
              <div className="mb-4">
                <StoryFiltersSummary
                  privateStories
                  onChange={() => setSelectedStory(undefined)}
                />
              </div>
            ) : null}
            <Divider />
          </>
        )}
      </div>
      {loaded ? (
        <div className="flex sm:w-full mt-6 pb-32 lg:pb-0">
          <AnimatePresence mode="wait">
            (
            <motion.div
              initial={{ x: 10, opacity: 0, width: "100%" }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 10, opacity: 0 }}
              key={stories.length}
            >
              {stories.length > 0 ? (
                <div
                  className="overflow-y-scroll hide-scrollbar"
                  style={onMobile ? { maxHeight: "auto" } : { maxHeight: "58vh" }}
                >
                  {stories?.map((story: Story) => (
                    <div className="mt-2 first:mt-0" key={story.storyId}>
                      <StoryCard
                        story={story}
                        // @ts-ignore
                        selected={selectedStory?.storyId === story?.storyId}
                        enableMenuOptions
                        menuOptions={currentLibrary?.organizationId ? [
                          {
                            label: "Copy Public Link",
                            value: COPY_PUBLIC_LINK_MENU_OPTION,
                          },
                          {
                            label: "Remove from collection",
                            value: REMOVE_FROM_COLLECTION_MENU_OPTION,
                          }
                        ] : [
                          {
                            label: "Remove from collection",
                            value: REMOVE_FROM_COLLECTION_MENU_OPTION,
                          }
                        ]}
                        onClick={() => handleStoryClick(story)}
                      ></StoryCard>
                    </div>
                  ))}
                </div>
              ) : stories.length === 0 && Object.keys(storyFilters).length > 0 ? (
                <div className="flex flex-col items-center">
                  <SmileyMeh size={100} color={neutral300} />
                  <p className="mt-4 text-center max-w-lg">
                    It looks like we could not find any index matching your filters. Try
                    adjusting your filter settings to see more results.
                  </p>
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>

          {selectedStory !== undefined && (
            <div
              className="hidden lg:flex lg:ml-10 w-full overflow-y-scroll"
              style={onMobile ? { maxHeight: "auto" } : { maxHeight: "58vh" }}
            >
              <AnimatePresence mode="wait">
                (
                <motion.div
                  initial={{ x: 10, opacity: 0, width: "100%" }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 10, opacity: 0 }}
                  key={selectedStory?.storyId}
                >
                  <StoryDetails story={selectedStory} />
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full mt-4">
          <div>
            <STKSkeleton width="100%" height="56px" />
          </div>
          <div className="mt-10">
            {[1, 2, 3].map((_, index) => (
              <div className="w-full first:mt-0 mt-2" key={index}>
                <StoryCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      )}
      <StoryDetailsDialog
        open={showStoryDetailsDialog}
        story={
          selectedStory !== undefined && selectedStory !== null ? selectedStory : null
        }
        onClose={() => setShowStoryDetailsDialog(false)}
      />
      <AddListenerDialog
        // @ts-ignore
        library={currentLibrary}
        open={showAddListenerDialog}
        onClose={() => setShowAddListenerDialog(false)}
      />
      <ListenersDialog
        open={showListenersDialog}
        library={currentLibrary}
        onClose={() => setShowListenersDialog(false)}
      />
    </PageWrapper>
  );
}

export default withAuth(withProfile(Library));
