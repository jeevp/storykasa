import React from "react";
import ReactPlayer from "react-player";
import PageWrapper from "@/composedComponents/PageWrapper";
import withAuth from "@/HOC/withAuth";
import withProfile from "@/HOC/withProfile";

function HelpVideos() {
  return (
    <PageWrapper path="library">
      <div>
        <div className="flex items-center">
          <h2 className="m-0 text-2xl">Help Videos</h2>
        </div>
        <div className="mt-4 flex flex-col lg:flex-row justify-between w-full items-center">
          <p className="max-w-xl">
            Explore our collection of step-by-step tutorial videos designed to help you
            maximize your experience with Storykasa. Whether you're just getting started
            or looking to dive deeper into advanced features, these videos provide clear
            guidance and practical tips to enhance your storytelling journey. Dive in and
            start creating your masterpieces today!
          </p>
        </div>
        <div
          className="mt-8 flex flex-col lg:flex-row items-center"
          style={{ marginBottom: "90px" }}
        >
          <div style={{ height: "230px", width: "420px", marginRight: "30px" }}>
            <ReactPlayer
              url="https://api.storykasa.com/storage/v1/object/public/storykasa-videos/Discover and My Library.mp4?t=2024-05-14T15%3A21%3A00.210Z"
              controls
              width="100%"
              height="100%"
            />
            <h3>Discover and My Library</h3>
          </div>
          <div style={{ height: "230px", width: "420px" }}>
            <ReactPlayer
              url="https://api.storykasa.com/storage/v1/object/public/storykasa-videos/Create a Story.mp4?t=2024-05-14T15%3A20%3A41.460Z"
              controls
              width="100%"
              height="100%"
            />
            <h3>Create Story</h3>
          </div>
        </div>
        <div style={{ marginBottom: "50px" }}>
          <div style={{ height: "230px", width: "420px" }}>
            <ReactPlayer
              url="https://api.storykasa.com/storage/v1/object/public/storykasa-videos/Collections.mp4"
              controls
              width="100%"
              height="100%"
            />
            <h3>Collections</h3>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default withAuth(withProfile(HelpVideos));
