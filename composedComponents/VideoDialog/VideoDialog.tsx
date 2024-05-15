import STKDialog from "@/components/STKDialog/STKDialog";
import React from "react";
import ReactPlayer from "react-player";
import useDevice from "@/customHooks/useDevice";

interface VideoDialogProps {
  active: boolean;
  onClose?: () => void;
}

export default function VideoDialog({ active, onClose = () => ({}) }: VideoDialogProps) {
  const { onMobile } = useDevice();

  // Methods

  return (
    <STKDialog fullScreen={onMobile} active={active} onClose={() => onClose()}>
      <ReactPlayer
        url="https://api.storykasa.com/storage/v1/object/public/storykasa-videos/Getting Started.mp4?t=2024-05-14T15%3A21%3A20.055Z"
        width="100%"
        height="100%"
        playing={true}
      />
    </STKDialog>
  );
}
