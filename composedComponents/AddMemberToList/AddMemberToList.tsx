import React, { useState } from 'react';
import STKTextField from '@/components/STKTextField/STKTextField';
import STKButton from "@/components/STKButton/STKButton";
import {Plus, Trash, Check} from "@phosphor-icons/react";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import {red600} from "@/assets/colorPallet/colors";

interface addMemberToListProps {
    members?: []
    collectionInvitations?: []
    onChange: (membersList: string[]) => void
}


const AddMemberToList = ({ members = [], collectionInvitations = [], onChange = () => ({}) }: addMemberToListProps) => {
    const [email, setEmail] = useState<string>('');
    const [membersList, setMembersList] = useState<string[]>([]);

    const handleEmailChange = (newEmail: string) => {
        setEmail(newEmail);
    };

    const handleAddMember = (e: any) => {
        e.preventDefault()
        // @ts-ignore
        if (members.includes(email)) {
            return
        }

        if (email && !membersList.includes(email)) {
            const _membersList = [...membersList, email]
            setMembersList(_membersList);
            setEmail('');
            onChange(_membersList)
        }
    };

    const handleDeleteMemberFromList = (memberEmail: string) => {
        const _membersList = membersList.filter((member) => member !== memberEmail)
        setMembersList(_membersList)
        onChange(_membersList)
    }

    const checkInvitationSent = (memberEmail: string) => {
        const collectionInvitation = collectionInvitations.find((_collectionInvitation) => {
            // @ts-ignore
            return _collectionInvitation?.listenerEmail === memberEmail
        })

        // @ts-ignore
        return collectionInvitation?.invited
    }

    return (
        <div>
            <form className="flex items-center" onSubmit={handleAddMember}>
                <STKTextField
                    value={email}
                    fluid
                    onChange={handleEmailChange}
                    placeholder="Enter member's email"
                    type="email"
                    // @ts-ignore
                    className="w-full border border-gray-300 rounded-md"
                />
                <div className="ml-4">
                    <STKButton iconButton type="submit" onClick={handleAddMember}>
                        <Plus size={20} />
                    </STKButton>
                </div>
            </form>
            <div className="mt-6">
                <ul className="m-0 p-0 max-h-72 overflow-auto">
                    {membersList.map((memberEmail, index) => (
                        <li key={index} className="flex first:mt-0 mt-2 items-center justify-between bg-neutral-100 rounded-2xl px-4 py-2 list-none text-gray-700">
                            {collectionInvitations.length > 0 && collectionInvitations.find((invitation: any) => invitation?.listenerEmail === memberEmail) ? (
                                <>
                                    {checkInvitationSent(memberEmail) ? (
                                        <>
                                            <label>{memberEmail}</label>
                                            <Check />
                                        </>
                                    ) : (
                                        <div className="w-full">
                                            <div className="flex justify-between items-center">
                                                <label>{memberEmail}</label>
                                                <STKButton iconButton onClick={() => handleDeleteMemberFromList(memberEmail)}><Trash size={20} /></STKButton>
                                            </div>
                                            <div className="mt-1 flex items-center">
                                                <ErrorOutlineOutlinedIcon sx={{ color: red600, width: "20px", height: "20px" }} />
                                                <label className="text-sm ml-2 text-red-600">An invitation has already been sent this email</label>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <label>{memberEmail}</label>
                                    <STKButton iconButton onClick={() => handleDeleteMemberFromList(memberEmail)}><Trash /></STKButton>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AddMemberToList;
