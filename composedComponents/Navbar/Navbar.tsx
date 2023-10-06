import Image from 'next/image'
import {Divider} from "@mui/material";
import AccountDetails from "@/composedComponents/AccountDetails/AccountDetails";
import {useContext} from "react";
import AuthContext from "@/contexts/AuthContext";

export default function Navbar() {
    const { currentUser } = useContext(AuthContext)
    return (
        <div>
            <div className="flex justify-between">
                <Image
                    src="/logo.svg"
                    width={0}
                    height={0}
                    style={{ height: 'auto', width: 150 }}
                    alt="StoryKasa logo"
                />
                {currentUser &&  <AccountDetails />}

            </div>
            <div className="mt-4">
                <Divider />
            </div>
        </div>
    )
}
