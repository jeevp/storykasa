// @ts-ignore
import { DateTime } from 'luxon'
import STKAccordion from "@/components/STKAccordion/STKAccordion";
import STKButton from "@/components/STKButton/STKButton";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import STKSkeleton from "@/components/STKSkeleton/STKSkeleton";
import {Baby, GlobeSimple} from "@phosphor-icons/react";
import Story from "@/models/Story";
import useDevice from "@/customHooks/useDevice";

interface AIStoryIdeaListProps {
    storyIdeas: any[],
    expandFirstItem?: boolean
    loading?: boolean
    onSelect: (storyIdea: any) => void
}

export default function AIStoryIdeaList({
    storyIdeas,
    expandFirstItem = false,
    loading,
    onSelect = () => ({})
}: AIStoryIdeaListProps) {
    const { onMobile } = useDevice()

    return (
        <div>
            {loading ? (
                <div>
                    {[1,2,3,4,5].map((skeleton, index) => (
                        <div key={index} className="w-full first:mt-0 mt-2">
                            <STKSkeleton height="52px" />
                        </div>
                    ))}
                </div>
            ) : (
              <>
                  {storyIdeas?.map((storyIdea: any, index: number) => (
                      <div key={index} className="first:mt-0 mt-2">
                          <STKAccordion
                              // @ts-ignore
                              titlePrefix={`${DateTime.fromISO(storyIdea.createdAt).toLocaleString()}`}
                              title={`"${storyIdea?.title}"`}
                              titleSize="text-lg"
                              alignContentLeft={onMobile}
                              // @ts-ignore
                              defaultExpanded={expandFirstItem ? index === 0 : null}>
                              {onMobile ? (
                                  <h2 className="text-xl mt-0 p-0 mb-4">{storyIdea?.title}</h2>
                              ) : null}
                              <p>{storyIdea?.setting}</p>
                              <div className="mt-4">
                                  <label className="font-semibold">Characters</label>
                                  <ul>
                                      {storyIdea?.characters?.map((character: string, _index: number) => (
                                          <li key={_index}>
                                        <span
                                            // @ts-ignore
                                            className="font-semibold">{character?.name}</span>: {character?.description}
                                          </li>
                                      ))}
                                  </ul>
                              </div>
                              <div className="mt-4">
                                  <label className="font-semibold">First line</label>
                                  <p className="mt-2">{storyIdea?.firstLine}</p>
                              </div>

                              <div className="mt-8">
                                  <div className="flex items-center mr-4 mb-1 lg:mb-0">
                                      <Baby size={14} weight="bold" />
                                      <label className="ml-1">
                                          {Story.generateAgeGroupsLabel(storyIdea?.ageGroups) || "All ages"}
                                      </label>
                                  </div>
                                  <div className="flex items-center mt-2">
                                      <GlobeSimple size={14} weight="bold" />
                                      <label className="ml-1">
                                          {storyIdea?.language || "English"}
                                      </label>
                                  </div>
                              </div>
                              <div className="mt-8">
                                  <STKButton
                                      startIcon={<CheckCircleOutlineIcon />}
                                      onClick={() => onSelect(storyIdea)}>
                                      Use this idea
                                  </STKButton>
                              </div>
                          </STKAccordion>
                      </div>
                  ))}
              </>
            )}
        </div>
    )
}
