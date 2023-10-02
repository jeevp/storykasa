import React, {useEffect} from "react";
import STKButton from "@/components/STKButton/STKButton";
import {useRouter} from "next/navigation";
import axios from "axios";


function Welcome() {
    const router = useRouter()

    const goTo = async (route: string) => {
        await router.push(route)
    }

    useEffect(() => {
        handleTry()
    }, []);

    const handleTry = async () => {
        const response = await axios.get('/api/stories')
        console.log({ data: response.data })
    }

    return (
        <div>
            <h1>Welcome to StoryKasa</h1>
            <div className="mt-4">
                <label>
                    StoryKasa is a platform where you can listen to stories or create your
                    own!
                </label>
            </div>
            <div className="flex items-center mt-14">
                <STKButton onClick={() => goTo('/signup')}>
                    Create an account
                </STKButton>
                <div className="ml-4">
                    <STKButton onClick={() => goTo("/login")}>
                        Log in
                    </STKButton>
                </div>
            </div>
        </div>
    )
}

export default Welcome
