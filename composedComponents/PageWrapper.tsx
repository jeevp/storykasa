import { AnimatePresence, motion } from 'framer-motion'
import Navbar from "@/composedComponents/Navbar/Navbar";
import SideNavigation from "@/composedComponents/SideNavigation/SideNavigation";
import {usePathname, useRouter} from "next/navigation";

export default function PageWrapper({
    children,
    path,
}: {
    children: React.ReactNode
    path: string
}) {
    const pathname = usePathname()

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ x: 10, opacity: 0}}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 10, opacity: 0 }}
                key={path}
            >
                <div className="w-full flex justify-center mt-4">
                    <div className="w-full" style={{ maxWidth: "1280px" }}>
                        <Navbar />
                        <div className="mt-8 flex items-center w-full">
                            {pathname !== "/profiles" && (
                                <div className="mr-20">
                                    <SideNavigation />
                                </div>
                            )}
                            <div>
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
