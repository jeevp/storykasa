import STKDialog from "@/components/STKDialog/STKDialog";
import React from "react";
import useDevice from "@/customHooks/useDevice";

interface VideoDialogProps {
  active: boolean;
  onClose?: () => void;
}

export default function VideoDialog({ active, onClose = () => ({}) }: VideoDialogProps) {
  const { onMobile } = useDevice();

  return (
    <STKDialog maxWidth="lg" fullScreen={onMobile} active={active} onClose={() => onClose()}>
      <div>
          <video width="100%" controls>
              <source src="https://api.storykasa.com/storage/v1/object/public/storykasa-videos/Getting Started.mp4?t=2024-05-14T15%3A21%3A20.055Z" type="video/mp4" />
          </video>
      </div>
    </STKDialog>
  );
}
