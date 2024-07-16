import PageWrapper from "@/composedComponents/PageWrapper";
import withProfile from "@/HOC/withProfile";
import withAuth from "@/HOC/withAuth";
import React, {useEffect, useState} from "react";
import withAdmin from "@/HOC/withAdmin";
import { AnimatePresence, motion } from "framer-motion";
import STKButton from "@/components/STKButton/STKButton";
import {useOrganization} from "@/contexts/organizations/OrganizationContext";
import OrganizationHandler from "@/handlers/OrganizationHandler";
import CreateOrganizationDialog from "@/composedComponents/CreateOrganizationDialog/CreateOrganizationDialog";
import STKCard from "@/components/STKCard/STKCard";
import Organization from "@/service/models/Organization";
import STKMenu from "@/components/STKMenu/STKMenu";
import STKSkeleton from "@/components/STKSkeleton/STKSkeleton";
import InfoDialog from "@/composedComponents/InfoDialog/InfoDialog";
import UpdateOrganizationDialog from "@/composedComponents/UpdateOrganizationDialog/UpdateOrganizationDialog";
import useDevice from "@/customHooks/useDevice";


export const dynamic = "force-dynamic";

function Organizations() {
    // Hooks
    const { onMobile } = useDevice()

    // Contexts
    const { organizations, setOrganizations } = useOrganization()

    // States
    const [loadingAction, setLoadingAction] = useState(false)
    const [loading, setLoading] = useState(true)
    const [showCreateOrganizationDialog, setShowCreateOrganizationDialog] = useState(false);
    const [selectedOrganization , setSelectedOrganization] = useState<Organization | null>(null)
    const [showUpdateOrganizationDialog, setShowUpdateOrganizationDialog] = useState(false)
    const [showDeleteOrganizationDialog, setShowDeleteOrganizationDialog] = useState(false)

    // Mounted
    useEffect(() => {
        handleFetchOrganizations()
    }, []);

    // Methods
    const handleFetchOrganizations = async () => {
        const _organizations = await OrganizationHandler.fetchOrganizations()
        setOrganizations(_organizations)
        setLoading(false)
    }

    const handleOrganizationOnClick = async (organization: Organization, selectedMenu: any) => {
        setSelectedOrganization(organization)

        if (selectedMenu?.value === "update") {
            setShowUpdateOrganizationDialog(true)
        }

        if (selectedMenu?.value === "delete") {
            setShowDeleteOrganizationDialog(true)
        }
    }

    const handleDeleteOrganization = async () => {
        setLoadingAction(true)
        await OrganizationHandler.deleteOrganization({ id: selectedOrganization?.id })
        const _organizations = organizations.filter((organization) => {
            return organization.id !== selectedOrganization?.id
        })

        setOrganizations(_organizations)
        setLoadingAction(false)
        setShowDeleteOrganizationDialog(false)
    }


    return (
        <>
            <PageWrapper admin path="discover">
                <div className="pb-20">
                    {!loading && organizations?.length === 0 ? (
                        <div className="bg-[#f5efdc] box-border flex flex-col items-center p-5 rounded-lg text-center w-full">
                            <p className="text-lg text-gray-800 font-semibold text-center max-w-[240px] lg:max-w-lg">
                                No Organizations Yet!
                            </p>
                            <p className="text-md text-gray-600 my-3 max-w-[240px] lg:max-w-xl">
                                There are currently no organizations. As an admin, you have the ability to create and manage organizations.
                            </p>
                            <div className="mt-8 flex flex-col lg:flex-row items-center">
                                <STKButton
                                    fullWidth={onMobile}
                                    onClick={() => setShowCreateOrganizationDialog(true)}>
                                    Create Organization
                                </STKButton>
                            </div>
                        </div>
                    ) : (
                      <>
                          <h2 className="m-0">Organizations</h2>
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
                                                          {loading ? (
                                                              <STKSkeleton width="150px" height="30px" />
                                                          ) : (
                                                              <label>{organizations.length} organizations</label>
                                                          )}
                                                      </div>

                                                      <div className="mt-4">
                                                          <STKButton
                                                              disabled={loading}
                                                              onClick={() => setShowCreateOrganizationDialog(true)}
                                                          >
                                                              Create Organization
                                                          </STKButton>
                                                      </div>
                                                  </div>
                                              </div>
                                              <div className="mt-10">
                                                  {loading ? (
                                                      <div>
                                                          {[1,2,3].map((skeleton) => (
                                                              <div key={skeleton} className="first:mt-0 mt-2">
                                                                  <STKSkeleton height="84px" width="100%" />
                                                              </div>
                                                          ))}
                                                      </div>
                                                  ) : (
                                                      <>
                                                          {organizations.map((organization: Organization, index: number) => (
                                                              <div key={index} className="first:mt-0 mt-2">
                                                                  <STKCard>
                                                                      <div className="p-4 flex items-center justify-between">
                                                                          <div className="flex items-center">
                                                                              <div className="w-[200px]">
                                                                                  <label className="font-semibold">Organization name</label>
                                                                                  <div className="mt-2">
                                                                                      <label>{organization?.name}</label>
                                                                                  </div>
                                                                              </div>
                                                                          </div>
                                                                          <div>
                                                                              <STKMenu options={[
                                                                                  { label: "Update", value: "update" },
                                                                                  { label: "Delete", value: "delete" }
                                                                              ]}
                                                                                       onChange={(value) => handleOrganizationOnClick(organization, value)}/>
                                                                          </div>
                                                                      </div>
                                                                  </STKCard>
                                                              </div>
                                                          ))}
                                                      </>
                                                  )}
                                              </div>
                                          </div>
                                      </motion.div>
                                  </AnimatePresence>
                              </div>
                          </div>
                      </>
                    )}
                </div>
            </PageWrapper>
            <CreateOrganizationDialog
            open={showCreateOrganizationDialog}
            onClose={() => setShowCreateOrganizationDialog(false)}
            />
            <InfoDialog
            active={showDeleteOrganizationDialog}
            text={`Are you sure about deleting the organization ${selectedOrganization?.name}?`}
            title="Delete organization"
            onClose={() => setShowDeleteOrganizationDialog(false)}
            confirmationButtonText="Delete"
            loading={loadingAction}
            onAction={handleDeleteOrganization}/>
            <UpdateOrganizationDialog
            open={showUpdateOrganizationDialog}
            organization={selectedOrganization}
            onClose={() => setShowUpdateOrganizationDialog(false)}/>
        </>
    );
}

export default withAuth(withProfile(withAdmin(Organizations)));
