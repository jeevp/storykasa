import STKCard from "@/components/STKCard/STKCard";
import {Books} from "@phosphor-icons/react";
import Library from "@/models/Library";
import ListenerAvatars from "@/composedComponents/ListenersAvatars/ListenersAvatars";

const avatars = [
    { src: '', alt: 'Listener 1' },
    { src: '', alt: 'Listener 3' },
    { src: '', alt: 'Listener 4' },
    { src: '', alt: 'Listener 5' },
    { src: '', alt: 'Listener 6' },
];

export default function LibraryCard({ library }: { library: Library }) {
    return (
        <STKCard>
            <div className="flex items-center flex-col p-10 w-56 h-40">
                <div>
                    <Books size={50} color="#ccc" />
                </div>
                <div className="flex items-center flex-col">
                    <label className="font-semibold text-center text-ellipsis whitespace-nowrap max-w-md">{library.libraryName}</label>
                    <div className="mt-2">
                        {!library.totalStories}
                        <label>
                            {library.totalStories ? `${library.totalStories } stories` : "Without stories"}
                        </label>
                    </div>
                </div>
                <div className="mt-6">
                    <ListenerAvatars avatars={avatars} />
                </div>
            </div>
        </STKCard>
    )
}
