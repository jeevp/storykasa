import Image from 'next/image'
import {Divider} from "@mui/material";

export default function Navbar() {
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
            </div>
            <div className="mt-4">
                <Divider />
            </div>
        </div>
    )
}
