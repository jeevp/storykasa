import STKDialog from "@/components/STKDialog/STKDialog";
import STKTextField from "@/components/STKTextField/STKTextField";
import STKAutocomplete from "@/components/STKAutocomplete/STKAutocomplete";
import Story, {allowedAgeGroups, languages} from "@/models/Story";
import STKSelect from "@/components/STKSelect/STKSelect";
import STKButton from "@/components/STKButton/STKButton";
import STKButtonTabs from "@/components/STKButtonTabs/STKButtonTabs";
import {useEffect, useState} from "react";
import StoryHandler from "@/handlers/StoryHandler";
import STKAccordion from "@/components/STKAccordion/STKAccordion";
import useDevice from "@/customHooks/useDevice";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import {purple600} from "@/assets/colorPallet/colors";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {useSubscription} from "@/contexts/subscription/SubscriptionContext";
import {FREE_SUBSCRIPTION_PLAN} from "@/models/Subscription";
import {useRouter} from "next/router";
import STKSkeleton from "@/components/STKSkeleton/STKSkeleton";
import AccountToolsUsageHandler from "@/handlers/AccountToolsUsageHandler";


interface AIStoryGeneratorDialogProps {
    active: boolean,
    onSelect: (story: any) => void
    onClose: () => void
}

export default function AIStoryGeneratorDialog({
    active,
    onSelect = () => ({}),
    onClose = () => ({})
}: AIStoryGeneratorDialogProps) {
    const router = useRouter()
    const { onMobile } = useDevice()
    const { currentSubscription } = useSubscription()

    const [loading, setLoading] = useState(false)
    const [isFictional, setIsFictional] = useState(false)
    const [language, setLanguage] = useState("")
    const [description, setDescription] = useState("")
    const [ageGroups, setAgeGroups] = useState([])
    const [storyIdeas, setStoryIdeas] = useState([])
    const [firstStoryIdea, setFirstStoryIdea] = useState([])
    const [secondStoryIdea, setSecondStoryIdea] = useState([])
    const [thirdStoryIdea, setThirdStoryIdea] = useState([])
    const [storiesLoading, setStoriesLoading] = useState<number>(3);
    const [loadingAccountToolsUsage, setLoadingAccountToolsUsage] = useState(false)
    const [remainingStoryIdeasUsage, setRemainingStoryIdeasUsage] = useState(0)

    // Mounted
    useEffect(() => {
        checkAccountToolsUsage()
    }, []);

    // Watchers
    useEffect(() => {
        if (active) {
            setStoryIdeas([])
            setIsFictional(false)
            setLanguage("")
            setDescription("")
            setAgeGroups([])
            setLoading(false)
            setStoriesLoading(3)
        }
    }, [active]);

    // Methods
    const checkAccountToolsUsage = async () => {
        setLoadingAccountToolsUsage(true)
        const _accountToolsUsage = await AccountToolsUsageHandler.fetchAccountToolsUsage()

        const _remainingStoryIdeasUsage = 30 - _accountToolsUsage?.currentMonthTotalStoryIdeas

        setRemainingStoryIdeasUsage(_remainingStoryIdeasUsage)
        setLoadingAccountToolsUsage(false)
    }

    const handleGenerateStoryIdeas = async () => {
        if (loading) return;
        setLoading(true);

        const _ageGroups = Story.generateAgeGroupsLabel(ageGroups);

        setStoryIdeas([]);

        const generateAndSetStoryIdea = async () => {
            try {
                const storyIdea = await StoryHandler.generateStoryIdea({
                    isFictional,
                    language,
                    description,
                    ageGroups: _ageGroups
                });
                // @ts-ignore
                setStoryIdeas(prevStoryIdeas => [...prevStoryIdeas, storyIdea]);
            } finally {
                setStoriesLoading(prevCount => prevCount - 1);
            }
        }

        const storyIdeaPromises = [1, 2, 3].map(() => generateAndSetStoryIdea());

        Promise.all(storyIdeaPromises).finally(() => {
            setLoading(false)
            setRemainingStoryIdeasUsage(remainingStoryIdeasUsage - 1)
        });
    };




    const handleStoryOnSelect = (storyIdea: any) => {
        onSelect({
            title: storyIdea.title,
            description: storyIdea?.fullDescription,
            language,
            ageGroups,
            firstLine: storyIdea.firstLine
        })

        onClose()
    }

    const goToAccountSettingsPage = async () => {
        await router.push("/account-settings")
    }

    const blockFeatureAccess = (
        currentSubscription?.subscriptionPlan === FREE_SUBSCRIPTION_PLAN
        && !currentSubscription?.adminAccount
    )


    return (
        <STKDialog
        active={active}
        fullScreen={onMobile}
        title="Story Idea Generator"
        titleColor={purple600}
        maxWidth={blockFeatureAccess ? "sm" : "md"}
        aiMode
        onClose={() => onClose()}>
            <div className="mt-4">
                {storyIdeas?.length > 0 ? (
                    <div>
                        {storyIdeas?.map((storyIdea: any, index: number) => (
                            <div key={index} className="first:mt-0 mt-2">
                                <STKAccordion
                                    // @ts-ignore
                                    titlePrefix={`Idea ${index + 1}`}
                                    title={`"${storyIdea?.title}"`}
                                    titleSize="text-lg"
                                    defaultExpanded={index === 0}>
                                    <p>{storyIdea?.setting}</p>
                                    <div className="mt-4">
                                        <label className="font-semibold">Characters</label>
                                        <ul>
                                            {storyIdea?.characters.map((character: string, _index: number) => (
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
                                        <STKButton
                                        startIcon={<CheckCircleOutlineIcon />}
                                        onClick={() => handleStoryOnSelect(storyIdea)}>
                                            Use this idea
                                        </STKButton>
                                    </div>
                                </STKAccordion>
                            </div>
                        ))}

                        {Array.from({ length: storiesLoading }, (_, index) => (
                            <div key={index} className="first:mt-0 mt-2">
                                <STKSkeleton height="60px" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {blockFeatureAccess ? (
                            <div>
                                <p>
                                    This feature is only available for <span className="font-semibold">premium users</span>.
                                    Upgrade now to enjoy this and other premium features!
                                </p>
                                <div className="mt-10 flex justify-end">
                                    <div className="mr-2">
                                        <STKButton variant="default" onClick={() => onClose()}>Cancel</STKButton>
                                    </div>
                                    <STKButton color="aiMode" onClick={goToAccountSettingsPage}>Update subscription</STKButton>
                                </div>
                            </div>
                        ) : (
                          <>
                              <p>
                                  Let&quot;s help you tell your story! Respond to the prompts below to generate
                                  some ideas. Then, choose one and make it your own.
                              </p>
                              <div className="flex flex-col lg:flex-row mt-8">
                                  <div className="lg:w-1/3 w-full">
                                      <div>
                                          <div className="flex items-center font-semibold text-md">
                                              <label className="w-5">1.</label>
                                              <label>Is your story fictional?</label>
                                          </div>
                                          <div className="mt-4 ml-4">
                                              <STKButtonTabs tabs={[
                                                  { text: "Yes, it's completely made up.", value: true },
                                                  { text: "No, it's a real-life story.", value: false }
                                              ]} onChange={(option) => setIsFictional(option?.value)} />
                                          </div>
                                      </div>
                                      <div className="mt-10">
                                          <div className="flex items-center font-semibold text-md">
                                              <label className="w-5">2.</label>
                                              <label>Who is this story for?</label>
                                          </div>
                                          <div className="mt-4 ml-4">
                                              <div>
                                                  <STKSelect
                                                      fluid
                                                      color="aiMode"
                                                      placeholder="Filter by ages"
                                                      options={allowedAgeGroups}
                                                      enableSelectAll
                                                      selectAllLabel="All ages"
                                                      // @ts-ignore
                                                      optionLabel="name"
                                                      multiple
                                                      onChange={(ages: any) => setAgeGroups(ages)}/>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="lg:w-2/3 w-full mt-10 lg:mt-0 lg:pl-10 flex flex-col">
                                      <div className="flex items-center font-semibold text-md">
                                          <label className="w-5">3.</label>
                                          <label>What is your story about?</label>
                                      </div>
                                      <div className="mt-4 ml-3">
                                          <STKTextField
                                              color="aiMode"
                                              fluid
                                              minRows={8}
                                              maxRows={14}
                                              multiline
                                              value={description}
                                              onChange={(value) => setDescription(value)} />
                                          <div className="mt-2">
                                              <label className="text-sm">
                                                  In 20 words or less, describe the setting and
                                                  topic of your story. <br/>For example: &quot;A story about a magical tree&quot;
                                              </label>
                                          </div>
                                      </div>
                                      <div className="w-full lg:w-auto flex items-end flex-col mt-10">
                                          <STKButton
                                              color="aiMode"
                                              fullWidth={onMobile}
                                              loading={loading}
                                              disabled={loadingAccountToolsUsage || remainingStoryIdeasUsage <= 0}
                                              startIcon={<AutoAwesomeIcon />}
                                              onClick={handleGenerateStoryIdeas}>
                                              Generate story ideas
                                          </STKButton>
                                          <div className="mt-2">
                                              {loadingAccountToolsUsage ? (
                                                  <label className="text-sm">Checking usage...</label>
                                              ) : (
                                                  <label className="text-sm">{remainingStoryIdeasUsage || 0} uses remaining</label>
                                              )}
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </>
                        )}
                    </>
                )}
            </div>
        </STKDialog>
    )
}
