import PageWrapper from '@/composedComponents/PageWrapper'
import withProfile from "@/HOC/withProfile";
import withAuth from "@/HOC/withAuth";
import {useAdmin} from "@/contexts/admin/useAdmin";
import {useEffect, useState} from "react";
import StoryHandler from "@/handlers/StoryHandler";
import StoryCard from "@/composedComponents/StoryCard/StoryCard";
import PublicStoryRequestCard from "@/composedComponents/PublicStoryRequestCard/PublicStoryRequestCard";
import STKSkeleton from "@/components/STKSkeleton/STKSkeleton";
import StoryCardSkeleton from "@/composedComponents/StoryCard/StoryCardSkeleton";
import PublicStoryRequestCardSkeleton from "@/composedComponents/PublicStoryRequestCard/PublicStoryRequestCardSkeleton";

export const dynamic = 'force-dynamic'

function PublicStoryRequests() {
    // States
    const [loading, setLoading] = useState(true)

    // Contexts
    const { publicStoryRequests, setPublicStoryRequests } = useAdmin()

    // Mounted
    useEffect(() => {
        handleFetchPublicStoryRequests()
    }, []);

    // Methods
    const handleFetchPublicStoryRequests = async () => {
        setLoading(true)
        const _publicStoryRequests = await StoryHandler.fetchPublicStoryRequests()
        setPublicStoryRequests(_publicStoryRequests)
        setLoading(false)
    }


    return (
        <PageWrapper admin path="discover">
            <div className="pb-20">
                <h2 className="m-0">
                    Public stories requests
                </h2>
                <div className="mt-4 max-w-2xl">
                    <p>
                        Here you can manage the requests sent by the users to make a story available on the public library.
                    </p>
                </div>
                <div className="mt-10">
                    {loading ? (
                        <div className="w-full mt-4">
                            <div>
                                <STKSkeleton width="100%" height="56px" />
                            </div>
                            <div className="mt-10">
                                {[1,2,3].map((_, index) => (
                                    <div className="w-full first:mt-0 mt-2" key={index}>
                                        <PublicStoryRequestCardSkeleton />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>

                            {
                                // @ts-ignore
                                publicStoryRequests?.length === 0 ? (
                                <div className="bg-orange-200 rounded-2xl p-4 inline-block">
                                    <p>
                                        Currently, there are no pending requests for making stories public. Please
                                        check back later for any new submissions from users.
                                    </p>
                                </div>
                            ) : (
                              <>
                                  <div>
                                      <label>
                                          <span className="font-semibold">
                                          {
                                              // @ts-ignore
                                              publicStoryRequests.length
                                          }
                                        </span> public story requests
                                      </label>
                                  </div>
                                  <div className="mt-4">
                                      {
                                          // @ts-ignore
                                          publicStoryRequests?.map((publicStoryRequest: any, index: number) => (
                                          <div key={index} className="first:mt-0 mt-2">
                                              <PublicStoryRequestCard publicStoryRequest={publicStoryRequest} selected={false} />
                                          </div>
                                      ))}
                                  </div>
                              </>
                            )}
                        </>
                    )}

                </div>
            </div>
        </PageWrapper>
    )
}

export default withAuth(withProfile(PublicStoryRequests))
