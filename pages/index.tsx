import React, {useEffect} from "react";
import STKButton from "@/components/STKButton/STKButton";
import {useRouter} from "next/navigation";
import axios from "axios";
import withoutAuth from "@/HOC/withoutAuth";
import PageWrapper from "@/composedComponents/PageWrapper";


function Welcome() {
    const router = useRouter()

    const goTo = async (route: string) => {
        await router.push(route)
    }


    return (
        <PageWrapper>
            <h1 className="m-0">Welcome to StoryKasa</h1>
            <div className="mt-4">
                <h2 className="m-0 text-2xl font-normal">
                    StoryKasa is a platform where you can listen to stories or create your
                    own!
                </h2>
            </div>
            <div className="flex items-center mt-14">
                <STKButton onClick={() => goTo('/signup')}>
                    Create an account
                </STKButton>
                <div className="ml-4">
                    <STKButton variant="outlined" onClick={() => goTo("/login")}>
                        Log in
                    </STKButton>
                </div>
            </div>
        </PageWrapper>
    )
}

export default withoutAuth(Welcome)
