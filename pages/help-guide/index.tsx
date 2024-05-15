import React, {useState} from "react";
import PageWrapper from "@/composedComponents/PageWrapper";
import withAuth from "@/HOC/withAuth";
import withProfile from "@/HOC/withProfile";
import STKTabs from "@/components/STKTabs/STKTabs";

const DISCOVER_TAB = "DISCOVER_TAB"
const MY_LIBRARY_TAB = "MY_LIBRARY_TAB"
const CREATE_STORY_TAB = "CREATE_STORY_TAB"
const COLLECTIONS_TAB = "COLLECTIONS_TAB"
const PROFILES_TAB = "PROFILES_TAB"

const tabs = [
  { label: "Discover", value: DISCOVER_TAB },
  { label: "My Library", value: MY_LIBRARY_TAB },
  { label: "Create Story", value: CREATE_STORY_TAB },
  { label: "Collections", value: COLLECTIONS_TAB},
  { label: "Profiles", value: PROFILES_TAB }
]

function HelpVideos() {
  const [selectedTab, setSelectedTab] = useState(DISCOVER_TAB)


  const generateContent = () => {
    switch(selectedTab) {
      case DISCOVER_TAB:
        return {
          videoUrl: "https://api.storykasa.com/storage/v1/object/public/storykasa-videos/Discover and My Library.mp4?t=2024-05-14T15%3A21%3A00.210Z",
          children: (
              <>
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
          )
        }
      case MY_LIBRARY_TAB:
        return {
          videoUrl: "https://api.storykasa.com/storage/v1/object/public/storykasa-videos/Discover and My Library.mp4?t=2024-05-14T15%3A21%3A00.210Z",
          children: (
              <>
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
          )
        }
      case CREATE_STORY_TAB:
        return {
          videoUrl: "https://api.storykasa.com/storage/v1/object/public/storykasa-videos/Create a Story.mp4?t=2024-05-14T15%3A20%3A41.460Z",
          children: (
              <>
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
          )
        }
      case COLLECTIONS_TAB:
        return {
          videoUrl: "https://api.storykasa.com/storage/v1/object/public/storykasa-videos/Collections.mp4",
          children: (
              <>
                <p className="mt-4">
                  Collections are an easy way to organize stories that you listen to often. A collection
                  can consist of a single story or several stories and you can choose how to organize them.
                </p>
                <p className="mt-4">
                  Your collections are private unless you want to share stories in your collections
                  with friends or family members. For example, you could create a collection
                  called “My original stories” and share it with a friend who might want to
                  listen to them as well. Or you might put together a “Bedtime stories” collection with
                  your child’s favorite stories to listen to at bedtime.
                </p>
                <p className="mt-4">
                  To share collections, simply click on “Add a listener,” enter the email of the person
                  you would like to invite to listen, and then click on “Invite.” If they have a StoryKasa
                  account they will receive a message asking them if they would like to accept your
                  invitation. If they are not on StoryKasa, they will need to set up an account to listen
                  to the stories in your shared collection.
                </p>
                <p className="mt-4">
                  If you have any other questions, please email us at support@storykasa.com and we will
                  get back to you as soon as we can.
                </p>
              </>
          )
        }

      case PROFILES_TAB:
        return {
          videoUrl: "",
          children: (
              <>
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
          )
        }
      default:
        break
    }
  }


  return (
    <PageWrapper path="library">
      <div>
        <div className="flex items-center">
          <h2 className="m-0 text-2xl">Help Guide</h2>
        </div>
        <div className="mt-8">
          <STKTabs
              tabs={tabs}
              // @ts-ignore
              value={tabs.find((tab) => tab.value === selectedTab)}
              // @ts-ignore
              onChange={(option) => setSelectedTab(option.value)} />
          <div>
          <div className="mb-10">
            {generateContent()?.children}
          </div>
            {generateContent()?.videoUrl && (
                <video key={selectedTab} width="100%" controls>
                    <source src={generateContent()?.videoUrl} type="video/mp4" />
                </video>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default withAuth(withProfile(HelpVideos));
