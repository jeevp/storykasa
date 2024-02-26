import Image from 'next/image'
import {Divider} from "@mui/material";
import AccountDetails from "@/composedComponents/AccountDetails/AccountDetails";
import {useRouter} from "next/router";
import {useAuth} from "@/contexts/auth/AuthContext";
import React from "react";


export default function Navbar() {
    const { currentUser } = useAuth()
    const router = useRouter()

    return (
        <div>
            <div className="flex justify-between">
                <div className="flex items-center">
                    <a href="https://storykasa.com">
                        <Image
                            src="/logo.svg"
                            width={0}
                            className="cursor-pointer h-auto"
                            height={0}
                            style={{ width: 150 }}
                            alt="StoryKasa logo"
                        />
                    </a>
                </div>
                {currentUser && <AccountDetails />}
            </div>
            <div className="mt-4">
                <Divider />
            </div>
        </div>
    )
}
