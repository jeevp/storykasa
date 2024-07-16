import React, { useState } from "react";
import STKDialog from "@/components/STKDialog/STKDialog";
import STKButton from "@/components/STKButton/STKButton";
import useDevice from "@/customHooks/useDevice";
import {usePromoCode} from "@/contexts/promoCode/PromoCodeContext";
import {useSnackbar} from "@/contexts/snackbar/SnackbarContext";
import STKTextField from "@/components/STKTextField/STKTextField";
import OrganizationHandler from "@/handlers/OrganizationHandler";
import {useOrganization} from "@/contexts/organizations/OrganizationContext";
import Organization from "@/service/models/Organization";

interface GenerateCouponCodeDialogProps {
  open: boolean;
  onClose?: () => void;
}

export default function CreateOrganizationDialog({
  open,
  onClose = () => ({}),
}: GenerateCouponCodeDialogProps) {
  const { onMobile } = useDevice();
  const { setSnackbarBus } = useSnackbar()

  // Contexts
  const { organizations, setOrganizations } = useOrganization()

  // States
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false);

  // Methods
  const handleOnChange = (key: string, value: any) => {
    switch(key) {
      case "name":
        setName(value)
        break

      default:
        break
    }
  }

  const handleCreateOrganization = async (e: any) => {
    e.preventDefault()

    try {
      setLoading(true)
      const organization: Organization = await OrganizationHandler.createOrganization({ name })

      if (organization) {
        const _organizations: Organization[] = [...organizations]
        _organizations.push(organization)
        setOrganizations(_organizations)
      }

      setSnackbarBus({
        active: true,
        message: "Organization created with success.",
        type: "success",
      });

      onClose()
    } catch {
      setSnackbarBus({
        active: true,
        message: "Oops! Something went wrong.",
        type: "error",
      });
    } finally {
      setLoading(false)
    }
  }


  return (
    <STKDialog
      active={open}
      maxWidth="xs"
      title="Create Organization"
      fullScreen={onMobile}
      onClose={() => onClose()}
    >
      <form onSubmit={handleCreateOrganization}>
        <div className="mt-6">
          <div>
            <label className="font-semibold">Organization name</label>
            <div className="mt-2">
              <div className="mt-2">
                <STKTextField
                  placeholder="Type organization name"
                  value={name}
                  onChange={(value) => handleOnChange("name", value)} />
              </div>
            </div>
          </div>
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
                  loading={loading}
                  type="submit"
                >
                  Save
                </STKButton>
              </div>
            </div>
      </form>
    </STKDialog>
  );
}
