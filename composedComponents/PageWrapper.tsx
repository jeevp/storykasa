import { AnimatePresence, motion } from 'framer-motion'
import Navbar from "@/composedComponents/Navbar/Navbar";
import SideNavigation from "@/composedComponents/SideNavigation/SideNavigation";
import STKSnackbar from "@/components/STKSnackbar/STKSnackbar";
import {useAuth} from "@/contexts/auth/AuthContext";
import {useSnackbar} from "@/contexts/snackbar/SnackbarContext";
import {usePathname} from "next/navigation";
import {useRouter} from "next/router";
import AdminNavigation from "@/composedComponents/AdminNavigation/AdminNavigation";

interface PageWrapperProps {
    children: any
    path?: string
    admin?: boolean
    hideNavigation?: boolean
}

export default function PageWrapper({
    children,
    admin,
    path,
    hideNavigation
}: PageWrapperProps) {
    const { currentUser } = useAuth()
    const { snackbarBus } = useSnackbar()
    const router = useRouter()

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ x: 0, opacity: 0}}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 0, opacity: 0 }}
                key={path}
            >
                <div className="w-full flex justify-center mt-4">
                    <div className="w-full px-2" style={{ maxWidth: "1280px" }}>
                        <Navbar />
                        <div className="mt-8 flex w-full">
                            {!admin && currentUser && router.pathname !== "/profiles" && !hideNavigation && (
                                <div className={`hidden lg:block mr-20 w-80 absolute lg:relative ${currentUser?.isGuest ? 'disabled' : ''}`}>
                                    <SideNavigation />
                                </div>
                            )}
                            {admin && (
                                <div className="hidden lg:block mr-20 w-80 absolute lg:relative">
                                    <AdminNavigation />
                                </div>
                            )}
                            <div className="w-full ">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
                <STKSnackbar
                open={snackbarBus?.active}
                message={snackbarBus?.message}
                // @ts-ignore
                type={snackbarBus?.type}/>
            </motion.div>
        </AnimatePresence>
    )
}
