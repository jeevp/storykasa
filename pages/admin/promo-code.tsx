import PageWrapper from "@/composedComponents/PageWrapper";
import withProfile from "@/HOC/withProfile";
import withAuth from "@/HOC/withAuth";
import { useState } from "react";
import withAdmin from "@/HOC/withAdmin";
import { AnimatePresence, motion } from "framer-motion";
import STKButton from "@/components/STKButton/STKButton";
import { STORY_LISTENING_DEMO_LINK_TYPE } from "@/composedComponents/GenerateGuestAccessLinkDialog/GenerateGuestAccessLinkDialog";
import GenerateCupomCodeDialog from "@/composedComponents/GenerateCupomCodeDialog/GenerateCupomCodeDialog";

export const dynamic = "force-dynamic";

function GuestAccessLinks() {
  // States
  const [showGenerateGuestAccessLinkDialog, setShowGenerateGuestAccessLinkDialog] =
    useState(false);
  const [demoLinkType, setDemoLinkType] = useState("");

  // Methods
  const handleGuestAccessLink = (demoLink: string) => {
    setShowGenerateGuestAccessLinkDialog(true);
    setDemoLinkType(demoLink);
  };

  return (
    <>
      <PageWrapper admin path="discover">
        <div className="pb-20">
          <h2 className="m-0">Promo Codes</h2>
          <div className="mt-10">
            <div className="flex sm:w-full pb-32 lg:pb-0">
              <AnimatePresence mode="wait">
                (
                <motion.div
                  initial={{ x: 10, opacity: 0, width: "100%" }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 10, opacity: 0 }}
                >
                  <div>
                    <div className="mt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="font-semibold text-md">Cupom creation</label>
                          <p className="mt-2 text-md">
                            Please click the adjacent button to generate a discount
                            coupon.{" "}
                          </p>
                        </div>

                        <div className="mt-4">
                          <STKButton
                            onClick={() =>
                              handleGuestAccessLink(STORY_LISTENING_DEMO_LINK_TYPE)
                            }
                          >
                            Generate Promo Code
                          </STKButton>
                        </div>
                      </div>
                      <div className="w-full border-t my-4 border-t-neutral-300 border-0 border-solid" />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </PageWrapper>
      <GenerateCupomCodeDialog
        open={showGenerateGuestAccessLinkDialog}
        demoLinkType={demoLinkType}
        onClose={() => setShowGenerateGuestAccessLinkDialog(false)}
      />
    </>
  );
}

export default withAuth(withProfile(withAdmin(GuestAccessLinks)));
