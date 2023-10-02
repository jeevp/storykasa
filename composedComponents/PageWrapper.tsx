import { AnimatePresence, motion } from 'framer-motion'
import Navbar from "@/composedComponents/Navbar/Navbar";
import SideNavigation from "@/composedComponents/SideNavigation/SideNavigation";

export default function PageWrapper({
    children,
    path,
}: {
    children: React.ReactNode
    path: string
}) {
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
                            <div>
                                <SideNavigation />
                            </div>
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
