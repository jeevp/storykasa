import {green800, red600} from "@/assets/colorPallet/colors";
import React from "react";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
export default function ListenersInvitationSummary({ listenersInvitations }: { listenersInvitations: any[] }) {
    const checkInvitationSent = (memberEmail: string) => {
        const collectionInvitation = listenersInvitations.find((_listenerInvitation) => {
            // @ts-ignore
            return _listenerInvitation?.listenerEmail === memberEmail
        })

        // @ts-ignore
        return collectionInvitation?.invited
    }

    return (
        <ul className="m-0 p-0 max-h-72 overflow-auto">
            {listenersInvitations.map((listenerInvitation, index) => (
                <li key={index} className="flex first:mt-0 mt-2 items-center justify-between bg-neutral-100 rounded-2xl px-4 py-2 list-none text-gray-700">
                        <>
                            {checkInvitationSent(listenerInvitation.listenerEmail) ? (
                                    <div className="w-full flex items-center">
                                        <div className="w-full">
                                            <div className="flex justify-between items-center">
                                                <label>{listenerInvitation?.listenerEmail}</label>
                                            </div>
                                            <div className="mt-1 flex items-center">
                                                <label className="text-sm text-neutral-600">Invitation sent with success</label>
                                            </div>
                                        </div>
                                        <CheckCircleOutlineOutlinedIcon sx={{ color: green800, width: "20px", height: "20px" }} />
                                    </div>
                            ) : (
                                <div className="w-full flex items-center">
                                    <div className="w-full">
                                        <div className="flex justify-between items-center">
                                            <label>{listenerInvitation?.listenerEmail}</label>
                                        </div>
                                        <div className="mt-1 flex items-center">
                                            <label className="text-sm text-red-600">An invitation has already been sent to this email</label>
                                        </div>
                                    </div>
                                    <CancelOutlinedIcon sx={{ color: red600, width: "20px", height: "20px" }} />
                                </div>
                            )}
                        </>
                </li>
            ))}
        </ul>
    )
}
