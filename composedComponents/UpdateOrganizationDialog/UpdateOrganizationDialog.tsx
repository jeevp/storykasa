import React, {useEffect, useState} from "react";
import STKDialog from "@/components/STKDialog/STKDialog";
import STKButton from "@/components/STKButton/STKButton";
import useDevice from "@/customHooks/useDevice";
import {useSnackbar} from "@/contexts/snackbar/SnackbarContext";
import STKTextField from "@/components/STKTextField/STKTextField";
import OrganizationHandler from "@/handlers/OrganizationHandler";
import {useOrganization} from "@/contexts/organizations/OrganizationContext";
import Organization from "@/service/models/Organization";

interface GenerateCouponCodeDialogProps {
  open: boolean;
  organization: Organization | null
  onClose?: () => void;
}

export default function UpdateOrganizationDialog({
  open,
  organization,
  onClose = () => ({}),
}: GenerateCouponCodeDialogProps) {
  const { onMobile } = useDevice();
  const { setSnackbarBus } = useSnackbar()

  // Contexts
  const { organizations, setOrganizations } = useOrganization()

  // States
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false);

  // Watchers
  useEffect(() => {
    if (organization) {
      setName(organization?.name)
    }
  }, [organization]);

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

  const handleUpdateOrganization = async (e: any) => {
    e.preventDefault()

    try {
      setLoading(true)
      const updatedOrganization: Organization = await OrganizationHandler.updateOrganization({
        id: organization?.id
      }, { name })

      if (updatedOrganization) {
        const _organizations = organizations.map((_organization) => {
          if (_organization?.id === organization?.id) return updatedOrganization
          return _organization
        })

        setOrganizations(_organizations)
      }

      setSnackbarBus({
        active: true,
        message: "Organization updated with success.",
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
      title="Update Organization"
      fullScreen={onMobile}
      onClose={() => onClose()}
    >
      <form onSubmit={handleUpdateOrganization}>
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
