import React from "react";
import { useRouter } from "next/router";
import STKDialog from "@/components/STKDialog/STKDialog";
import useDevice from "@/customHooks/useDevice";
import Story from "@/models/Story";
import STKButton from "@/components/STKButton/STKButton";

interface UpgradeDialogProps {
  open: boolean;
  story: Story | null;
  onClose?: () => void;
}

export default function UpgradeDialog({
  open,
  onClose = () => ({}),
  story,
}: UpgradeDialogProps) {
  const { onMobile } = useDevice();
  const router = useRouter();

  const handleUpgradeClick = () => {
    router.push("/account-settings");
  };
  return (
    <STKDialog
      active={open}
      maxWidth="sm"
      fullScreen={onMobile}
      onClose={() => onClose()}
    >
      <form>
        <div>
          <h4 className="text-center">
            "Read While Listening" feature is exclusively available to our premium users.
            Upgrade to premium today to enjoy this feature along with many other benefits!
          </h4>
        </div>
        <div className="justify-center flex">
          <div className="inline-flex bg-[#7662c4] rounded-[8px] mt-4 flex flex-col lg:flex-row justify-between items-center">
            <STKButton
              alignStart
              // @ts-ignore
              fullWidth
              onClick={() => handleUpgradeClick()}
            >
              Upgrade now
            </STKButton>
          </div>
        </div>
      </form>
    </STKDialog>
  );
}
