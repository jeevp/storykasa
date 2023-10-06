import STKDrawer from "@/components/STKDrawer/STKDrawer";
import STKAvatar from "@/components/STKAvatar/STKAvatar";
import STKButton from "@/components/STKButton/STKButton";
import { UserSwitch, SignOut } from '@phosphor-icons/react'

export default function AccountSideDrawer({ open, onClose = () => ({}) }) {
    return (
        <STKDrawer open={open} onClose={() => onClose()} anchor="right">
            <div className="w-72 p-10">
                <div className="flex items-center">
                    <STKAvatar name="Felipe Fernandes" />
                    <label className="ml-2">Felipe Fernandes</label>
                </div>
                <div className="mt-10">
                    <div>
                        <STKButton
                        alignStart
                        startIcon={<UserSwitch size={20} />}
                        fullWidth
                        color="info"
                        variant="outlined">
                            Change profile
                        </STKButton>
                    </div>
                    <div className="mt-4">
                        <STKButton
                        alignStart
                        color="info"
                        startIcon={<SignOut size={20} />}
                        fullWidth
                        variant="outlined">
                            Logout
                        </STKButton>
                    </div>
                </div>
            </div>
        </STKDrawer>
    )
}
