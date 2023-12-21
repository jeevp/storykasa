import React, { useState } from 'react';
import STKTextField from '@/components/STKTextField/STKTextField';
import STKButton from "@/components/STKButton/STKButton";
import {Plus, Trash} from "@phosphor-icons/react";

interface addMemberToListProps {
    members?: []
    onChange: (membersList: string[]) => void
}


const AddMemberToList = ({ members, onChange = () => ({}) }: addMemberToListProps) => {
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
                            <label>{memberEmail}</label>
                            <STKButton iconButton onClick={() => handleDeleteMemberFromList(memberEmail)}><Trash /></STKButton>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AddMemberToList;
