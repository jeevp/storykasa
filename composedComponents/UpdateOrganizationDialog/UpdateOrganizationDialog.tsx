import React, { useEffect, useState, SyntheticEvent } from "react";
import STKDialog from "@/components/STKDialog/STKDialog";
import STKButton from "@/components/STKButton/STKButton";
import useDevice from "@/customHooks/useDevice";
import { useSnackbar } from "@/contexts/snackbar/SnackbarContext";
import STKTextField from "@/components/STKTextField/STKTextField";
import OrganizationHandler from "@/handlers/OrganizationHandler";
import { useOrganization } from "@/contexts/organizations/OrganizationContext";
import Organization from "@/models/Organization";
import STKTabs from "@/components/STKTabs/STKTabs";
import STKAvatar from "@/components/STKAvatar/STKAvatar";
import STKCard from "@/components/STKCard/STKCard";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'


const OVERVIEW_TAB = "OVERVIEW_TAB"
const ACCOUNT_OWNER_TAB = "ACCOUNT_OWNER_TAB"

interface GenerateCouponCodeDialogProps {
  open: boolean;
  organization: Organization | null;
  onClose?: () => void;
}

export default function UpdateOrganizationDialog({
 open,
 organization,
 onClose = () => ({}),
}: GenerateCouponCodeDialogProps) {
  const { onMobile } = useDevice();
  const { setSnackbarBus } = useSnackbar();

  // Contexts
  const { organizations, setOrganizations } = useOrganization();

  // States
  const [name, setName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(OVERVIEW_TAB);
  const [showAccountOwnerForm, setShowAccountOwnerForm] = useState(false)

  // Watchers
  useEffect(() => {
    if (open) setActiveTab(OVERVIEW_TAB)
    if (organization) {
      setName(organization?.name || "");
      setShowAccountOwnerForm(!organization.accountOwner)

      setOwnerName(organization?.accountOwner?.name || "");
      setOwnerEmail(organization?.accountOwner?.email || "");
    }
  }, [organization, open]);


  useEffect(() => {
    if (showAccountOwnerForm) {
      setOwnerEmail("")
      setOwnerName("")
    }
  }, [showAccountOwnerForm]);

  // Methods
  const handleOnChange = (key: string, value: any) => {
    switch (key) {
      case "name":
        setName(value);
        break;
      case "ownerName":
        setOwnerName(value);
        break;
      case "ownerEmail":
        setOwnerEmail(value);
        break;
      default:
        break;
    }
  };

  const handleUpdateOrganization = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const payload: {name?: string, accountOwner?: any} = { name }
      if (ownerName && ownerEmail) {
        payload.accountOwner = {
          name: ownerName,
          email: ownerEmail
        }
      }
      const updatedOrganization: Organization = await OrganizationHandler.updateOrganization(
          //@ts-ignore
          { id: organization?.id },
          { ...payload }
      );

      if (updatedOrganization) {
        const _organizations = organizations.map((_organization) => {
          if (_organization?.id === organization?.id) return updatedOrganization;
          return _organization;
        });

        //@ts-ignore
        setOrganizations(_organizations);
      }

      setSnackbarBus({
        active: true,
        message: "Organization updated with success.",
        type: "success",
      });

      onClose();
    } catch {
      setSnackbarBus({
        active: true,
        message: "Oops! Something went wrong.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { label: "Overview", value: OVERVIEW_TAB },
    { label: "Account Owner", value: ACCOUNT_OWNER_TAB },
  ];


  return (
      <STKDialog
          active={open}
          maxWidth="xs"
          title="Update Organization"
          fullScreen={onMobile}
          onClose={() => onClose()}
      >
        <STKTabs
            tabs={tabs}
            value={tabs.findIndex((tab) => tab.value === activeTab)}
            // @ts-ignore
            onChange={(tab: any) => setActiveTab(tab?.value)}
        />
        <form onSubmit={handleUpdateOrganization}>
          {activeTab === OVERVIEW_TAB && (
              <div className="mt-6">
                <div>
                  <label className="font-semibold">Organization name</label>
                  <div className="mt-2">
                    <STKTextField
                        placeholder="Type organization name"
                        value={name}
                        onChange={(value) => handleOnChange("name", value)}
                    />
                  </div>
                </div>
              </div>
          )}
          {activeTab === ACCOUNT_OWNER_TAB && (
              <div className="mt-6">
                {!showAccountOwnerForm ? (
                    <STKCard>
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center">
                          <STKAvatar
                              //@ts-ignore
                              name={organization?.accountOwner?.fullName} />
                          <div className="ml-4">
                            <label className="text-neutral-800">{
                              //@ts-ignore
                              organization?.accountOwner?.fullName}</label>
                            <div>
                              <label className="text-sm">{organization?.accountOwner?.email}</label>
                            </div>
                          </div>
                        </div>
                        <div>
                          <STKButton iconButton onClick={() => setShowAccountOwnerForm(true)}>
                            <DeleteOutlineOutlinedIcon />
                          </STKButton>
                        </div>
                      </div>
                    </STKCard>
                ) : (
                    <>
                      <div>
                        <label className="font-semibold">Account Owner Name</label>
                        <div className="mt-2">
                          <STKTextField
                              placeholder="Type account owner name"
                              value={ownerName}
                              fluid
                              onChange={(value) => handleOnChange("ownerName", value)}
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="font-semibold">Account Owner Email</label>
                        <div className="mt-2">
                          <STKTextField
                              placeholder="Type account owner email"
                              value={ownerEmail}
                              fluid
                              onChange={(value) => handleOnChange("ownerEmail", value)}
                          />
                        </div>
                      </div>
                    </>
                )}
              </div>
          )}
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
            {(showAccountOwnerForm || activeTab === OVERVIEW_TAB) && (
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
            )}
          </div>
        </form>
      </STKDialog>
  );
}
