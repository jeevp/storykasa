import React, { useEffect, useState } from "react";
import STKDialog from "@/components/STKDialog/STKDialog";
import STKButton from "@/components/STKButton/STKButton";
import useDevice from "@/customHooks/useDevice";
import STKAutocomplete from "@/components/STKAutocomplete/STKAutocomplete";

interface GenerateCouponCodeDialogProps {
  open: boolean;
  demoLinkType?: string;
  onClose?: () => void;
}

export default function GeneratecouponCodeDialog({
  open,
  demoLinkType,
  onClose = () => ({}),
}: GenerateCouponCodeDialogProps) {
  const { onMobile } = useDevice();

  // States
  const [loading, setLoading] = useState(false);
  const [isCouponCopied, setIsCouponCopied] = useState(false);
  const [isCouponCreated, setIsCouponCreated] = useState(false);
  const [isCreateButtonDisable, setIsCreateButtonDisable] = useState(false);
  const [disableMonths, setDisableMonths] = useState(true);
  const [promoCode, setPromoCode] = useState({
    discountPercentage: 0.0, // float
    durationInMonths: 0, // int
    duration: "", // 'once', 'forever', 'repeating'
    isValid: false, // boolean
    code: "", // string
  });
  const discountPercentages = [
    { Title: "25%", value: 25 },
    { Title: "50%", value: 50 },
    { Title: "75%", value: 75 },
    { Title: "100%", value: 100 },
  ];
  const durationMonths = [
    { Title: "1", value: 1 },
    { Title: "2", value: 2 },
    { Title: "3", value: 3 },
    { Title: "4", value: 4 },
    { Title: "5", value: 5 },
    { Title: "6", value: 6 },
    { Title: "7", value: 7 },
    { Title: "8", value: 8 },
    { Title: "9", value: 9 },
    { Title: "10", value: 10 },
    { Title: "11", value: 11 },
    { Title: "12", value: 12 },
  ];
  const durations = [
    { Title: "Once", value: "once" },
    { Title: "Forever", value: "forever" },
    { Title: "Repeating", value: "repeating" },
  ];

  // Mounted
  useEffect(() => {
    const isDisabled = !checkFields();
    setIsCreateButtonDisable(isDisabled);
  }, [promoCode]);

  useEffect(() => {
    if (!open) {
      setLoading(false);
    }
  }, [open]);

  // Methods
  const generateGuestAccessLink = () => {
    setLoading(true);
    const code = generateCouponCode();
    setPromoCode({ ...promoCode, code: code });
  };

  const checkFields = () => {
    const hasDiscountPercentage = promoCode.discountPercentage > 0;
    const hasDuration = promoCode.duration !== "";
    const hasDurationInMonths =
      promoCode.duration === "repeating" ? promoCode.durationInMonths > 0 : true;
    return hasDiscountPercentage && hasDuration && hasDurationInMonths;
  };

  const generateCouponCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    setIsCouponCreated(true);
    return result;
  };

  const handlePercentage = (percentage: any) => {
    // @ts-ignore

    setPromoCode({
      ...promoCode, // @ts-ignore
      discountPercentage: percentage.value,
    });
  };
  const handleDuration = (duration: any) => {
    setPromoCode({
      ...promoCode, // @ts-ignore
      duration: duration?.value,
    });
    // @ts-ignore
    if (duration?.value == "repeating") {
      setDisableMonths(false);
    } else {
      setDisableMonths(true);
    }
  };
  const handleMonths = (months: any) => {
    setPromoCode({
      ...promoCode, // @ts-ignore
      durationInMonths: months?.value,
    });
  };

  const copyToClipboard = async () => {
    if (!navigator.clipboard) {
      console.error("Clipboard not available");
      return;
    }

    try {
      await navigator.clipboard.writeText(promoCode.code);
      setIsCouponCopied(true);
      console.log("Text copied to clipboard");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  console.log({ isCreateButtonDisable });

  return (
    <STKDialog
      active={open}
      maxWidth="xs"
      title="Generate Promocode"
      fullScreen={onMobile}
      onClose={() => onClose()}
    >
      <div>
        {!isCouponCreated ? (
          <>
            <div className="mt-6">
              <div>
                <label className="font-semibold">Discount Percentage</label>
                <div className="mt-2">
                  <STKAutocomplete
                    fluid
                    disablePortal={false}
                    // @ts-ignore
                    options={discountPercentages}
                    optionLabel="Title"
                    onChange={handlePercentage}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="font-semibold">Duration</label>
                <div className="mt-2">
                  <STKAutocomplete
                    fluid
                    disablePortal={false}
                    // @ts-ignore
                    options={durations}
                    optionLabel="Title"
                    onChange={handleDuration}
                  />
                </div>
              </div>
              {promoCode.duration === "repeating" && (
                <div className="mt-4">
                  <label className="font-semibold">Duration in months</label>
                  <div className="mt-2">
                    <STKAutocomplete
                      fluid
                      // @ts-ignore
                      disabled={disableMonths}
                      disablePortal={false}
                      // @ts-ignore
                      options={durationMonths}
                      optionLabel="Title"
                      onChange={handleMonths}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="mt-8 flex items-center justify-end flex-col lg:flex-row">
              <div className="w-full lg:w-auto">
                <STKButton
                  fullWidth={onMobile}
                  variant="outlined"
                  onClick={() => onClose()}
                >
                  Cancel
                </STKButton>
              </div>
              <div className="lg:ml-2 ml-0 mt-2 lg:mt-0 w-full lg:w-auto">
                <STKButton
                  fullWidth={onMobile}
                  color="primary"
                  disabled={isCreateButtonDisable}
                  loading={loading}
                  onClick={generateGuestAccessLink}
                >
                  Generate promo code
                </STKButton>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mt-6">
              <label className="font-semibold">Codigo do coupon {promoCode.code}</label>
              <div className="mt-2 overflow-hidden w-[500px] text-ellipsis"></div>
              <div className="mt-8 flex justify-end">
                <STKButton onClick={copyToClipboard}>
                  {isCouponCopied ? "Copied" : "Copy Code"}
                </STKButton>
              </div>
            </div>
          </>
        )}
      </div>
    </STKDialog>
  );
}
