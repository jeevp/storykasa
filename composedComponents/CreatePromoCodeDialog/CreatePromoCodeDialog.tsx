import React, { useEffect, useState } from "react";
import STKDialog from "@/components/STKDialog/STKDialog";
import STKButton from "@/components/STKButton/STKButton";
import useDevice from "@/customHooks/useDevice";
import STKAutocomplete from "@/components/STKAutocomplete/STKAutocomplete";
import PromoCodeHandler from "@/handlers/PromoCodeHandler";
import {usePromoCode} from "@/contexts/promoCode/PromoCodeContext";
import {useSnackbar} from "@/contexts/snackbar/SnackbarContext";
import CopyButton from "@/composedComponents/CopyButton/CopyButton";
import STKSelect from "@/components/STKSelect/STKSelect";

interface GenerateCouponCodeDialogProps {
  open: boolean;
  onClose?: () => void;
}

export default function CreatePromoCodeDialog({
  open,
  onClose = () => ({}),
}: GenerateCouponCodeDialogProps) {
  const { onMobile } = useDevice();
  const { promoCodes, setPromoCodes } = usePromoCode()
  const { setSnackbarBus } = useSnackbar()

  // States
  const [loading, setLoading] = useState(false);
  const [isCreateButtonDisable, setIsCreateButtonDisable] = useState(false);
  const [disableMonths, setDisableMonths] = useState(true);
  const [promoCode, setPromoCode] = useState({
    discountPercentage: 0.0, // float
    durationInMonths: 0, // int
    duration: "", // 'once', 'forever', 'repeating',
    code: "",
    unlimitedUsage: false
  });
  const discountPercentages = [
    { Title: "25%", value: 25 },
    { Title: "50%", value: 50 },
    { Title: "75%", value: 75 },
    { Title: "100%", value: 100 },
  ];
  const durationMonths = [
    { Title: "1 month", value: 1 },
    { Title: "2 months", value: 2 },
    { Title: "3 months", value: 3 },
    { Title: "4 months", value: 4 },
    { Title: "5 months", value: 5 },
    { Title: "6 months", value: 6 },
    { Title: "7 months", value: 7 },
    { Title: "8 months", value: 8 },
    { Title: "9 months", value: 9 },
    { Title: "10 months", value: 10 },
    { Title: "11 months", value: 11 },
    { Title: "12 months", value: 12 },
  ];
  const durations = [
    { Title: "Once", value: "once" },
    { Title: "Forever", value: "forever" },
    { Title: "Repeating", value: "repeating" },
  ];

  const usageLimitOptions = [
    { label: "Can be used only once", value: false },
    { label: "Can be used multiple times", value: true }
  ]

  // Mounted
  useEffect(() => {
    const isDisabled = !checkFields();
    setIsCreateButtonDisable(isDisabled);
  }, [promoCode]);

  useEffect(() => {
    if (open) {
      setLoading(false);
      setPromoCode({
        discountPercentage: 0.0,
        durationInMonths: 0,
        duration: "",
        code: "",
        unlimitedUsage: false
      })
    }
  }, [open]);

  // Methods
  const createCoupon = async () => {
    try {
      setLoading(true);
      const _promoCode = await PromoCodeHandler.createPromoCode({
        discountPercentage: promoCode.discountPercentage,
        // @ts-ignore
        duration: promoCode.duration,
        durationInMonths: promoCode.durationInMonths,
        unlimitedUsage: promoCode.unlimitedUsage
      })

      // @ts-ignore
      setPromoCodes([...promoCodes, _promoCode])
      setPromoCode({ ...promoCode, code: _promoCode?.code })
    } catch {
      setSnackbarBus({
        active: true,
        message: "Ops! Something went wrong.",
        type: "error"
      });
    } finally {
      setLoading(false);
      setSnackbarBus({
        active: true,
        message: "Promo code generated with success.",
        type: "success"
      });
    }
  };

  const checkFields = () => {
    const hasDiscountPercentage = promoCode.discountPercentage > 0;
    const hasDuration = promoCode.duration !== "";
    const hasDurationInMonths =
      promoCode.duration === "repeating" ? promoCode.durationInMonths > 0 : true;
    return hasDiscountPercentage && hasDuration && hasDurationInMonths;
  };

  const handlePercentage = (percentage: any) => {
    // @ts-ignore

    setPromoCode({
      ...promoCode, // @ts-ignore
      discountPercentage: percentage.value,
    });
  };

  const handleUsageLimit = (usageLimit: any) => {
    setPromoCode({
      ...promoCode,
      unlimitedUsage: usageLimit.value
    })
  }

  const handleDuration = (duration: any) => {
    setPromoCode({
      ...promoCode, // @ts-ignore
      duration: duration?.value,
    });
    // @ts-ignore
    if (duration.value == "repeating") {
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


  return (
    <STKDialog
      active={open}
      maxWidth="xs"
      title="Create Promo Code"
      fullScreen={onMobile}
      onClose={() => onClose()}
    >
      <div>
        {!promoCode?.code ? (
          <>
            <div className="mt-6">
              <div>
                <label className="font-semibold">Usage limit</label>
                <div className="mt-2">
                  <div className="mt-2">
                    <
                      // @ts-ignore
                      STKAutocomplete
                        fluid
                        disablePortal={false}
                        // @ts-ignore
                        options={usageLimitOptions}
                        onChange={handleUsageLimit}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4">
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
                <label className="font-semibold">Recurrence</label>
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
                  <label className="font-semibold">Duration</label>
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
                  onClick={createCoupon}
                >
                  Generate promo code
                </STKButton>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mt-6">
              <div>
                <label className="font-semibold">Promo code</label>
                <div className="mt-2">
                  <label>{promoCode?.code}</label>
                </div>
              </div>
              <div className="mt-2 overflow-hidden w-[500px] text-ellipsis"></div>
              <div className="mt-8 flex justify-end">
                <CopyButton text={promoCode?.code} />
              </div>
            </div>
          </>
        )}
      </div>
    </STKDialog>
  );
}
