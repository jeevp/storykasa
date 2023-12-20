import React from 'react';
import STKAvatar from "@/components/STKAvatar/STKAvatar";

type ListenerAvatarsProps = {
    avatars: Array<{ src?: string; alt?: string }>
};

const ListenerAvatars: React.FC<ListenerAvatarsProps> = ({ avatars = [] }) => (
    <div className="flex items-center">
        <div className="flex -space-x-2">
            {avatars?.slice(0, 4).map((avatar, index) => (
                <div className={`z-10 ${index === avatars.length ? 'opacity-5' : ''}`} style={{ zIndex: avatars.length - index }} key={index}>
                    <STKAvatar src={avatar.src} size={25} />
                </div>
            ))}
        </div>

        <span className="ml-4 text-sm font-medium">{avatars?.length === 1 ? '1 listener' : `${avatars.length} listeners`}</span>
    </div>
);

export default ListenerAvatars;
