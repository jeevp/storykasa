import PageWrapper from "@/composedComponents/PageWrapper";
import withProfile from "@/HOC/withProfile";
import withAuth from "@/HOC/withAuth";
import React, {useEffect, useState} from "react";
import withAdmin from "@/HOC/withAdmin";
import { AnimatePresence, motion } from "framer-motion";
import STKButton from "@/components/STKButton/STKButton";
import CreatePromoCodeDialog from "@/composedComponents/CreatePromoCodeDialog/CreatePromoCodeDialog";
import {usePromoCode} from "@/contexts/promoCode/PromoCodeContext";
import STKCard from "@/components/STKCard/STKCard";
import PromoCodeHandler from "@/handlers/PromoCodeHandler";
import CopyButton from "@/composedComponents/CopyButton/CopyButton";
import STKChip from "@/components/STKChip/STKChip"


export const dynamic = "force-dynamic";

function GuestAccessLinks() {
  // Contexts
  const { promoCodes, setPromoCodes } = usePromoCode()

  // States
  const [showCreatePromoCodeDialog, setShowCreatePromoCodeDialog] = useState(false);

  // Mounted
  useEffect(() => {
    handleFetchPromoCodes()
  }, []);

  // Methods
  const handleFetchPromoCodes = async () => {
    const _promoCodes = await PromoCodeHandler.fetchPromoCodes()

    setPromoCodes(_promoCodes)
  }


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
                          <label className="font-semibold text-md">Generate promo codes</label>
                          <p className="mt-2 text-md">
                            Instantly create and share discount promo codes with clients.</p>
                        </div>

                        <div className="mt-4">
                          <STKButton
                            onClick={() => setShowCreatePromoCodeDialog(true)}
                          >
                            Create Promo Code
                          </STKButton>
                        </div>
                      </div>
                    </div>
                    <div className="mt-10">
                      {promoCodes.map((promoCode, index) => (
                          <div key={index} className="first:mt-0 mt-2">
                            <STKCard>
                              <div className={`p-4 flex items-center justify-between ${
                                  // @ts-ignore
                                promoCode.isValid ? '' : 'disabled'}`}>
                                <div className="flex items-center">
                                  <div className="w-[100px]">
                                    <label className="font-semibold">Code</label>
                                    <div className="mt-2">
                                      <label>{
                                        // @ts-ignore
                                        promoCode?.code}</label>
                                    </div>
                                  </div>
                                  <div className="ml-10">
                                    <label className="font-semibold">Usage limit</label>
                                    <div className="mt-2">
                                      <label>{
                                        // @ts-ignore
                                        promoCode?.unlimitedUsage ? 'Unlimited' : 'Once'}</label>
                                    </div>
                                  </div>
                                  <div className="ml-10">
                                    <label className="font-semibold">Recurrence</label>
                                    <div className="mt-2">
                                      <label>{
                                        // @ts-ignore
                                        promoCode?.duration}</label>
                                    </div>
                                  </div>
                                  <div className="ml-10">
                                    <label className="font-semibold">Duration</label>
                                    <div className="mt-2">
                                      <label>{
                                        // @ts-ignore
                                        promoCode?.durationInMonths || 1} months</label>
                                    </div>
                                  </div>
                                  <div className="ml-10">
                                    <label className="font-semibold">Discount %</label>
                                    <div className="mt-2">
                                      <label>{
                                        // @ts-ignore
                                        promoCode?.discountPercentage} %</label>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  {
                                    // @ts-ignore
                                    promoCode?.isValid ? (
                                      <CopyButton
                                          // @ts-ignore
                                          text={promoCode?.code} />
                                  ) : (
                                      <STKChip label="Invalid" />
                                  )}
                                </div>
                              </div>
                            </STKCard>
                          </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </PageWrapper>
      <CreatePromoCodeDialog
        open={showCreatePromoCodeDialog}
        onClose={() => setShowCreatePromoCodeDialog(false)}
      />
    </>
  );
}

export default withAuth(withProfile(withAdmin(GuestAccessLinks)));
