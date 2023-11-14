import Image from 'next/image'
import {Divider} from "@mui/material";
import AccountDetails from "@/composedComponents/AccountDetails/AccountDetails";
import {useRouter} from "next/router";
import {useAuth} from "@/contexts/auth/AuthContext";

export default function Navbar() {
    const { currentUser } = useAuth()
    const router = useRouter()

    const goToRoot = async () => {
       await router.push("/")
    }

    return (
        <div>
            <div className="flex justify-between">
                <Image
                    src="/logo.svg"
                    width={0}
                    className="cursor-pointer h-auto"
                    height={0}
                    style={{ width: 150 }}
                    alt="StoryKasa logo"
                    onClick={goToRoot}
                />
                {currentUser &&  <AccountDetails />}

            </div>
            <div className="mt-4">
                <Divider />
            </div>
        </div>
    )
}
