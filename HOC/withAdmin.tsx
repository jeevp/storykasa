import { useRouter } from 'next/router'
import {useAuth} from "@/contexts/auth/AuthContext";

const withAdmin = (WrappedComponent: any) => {
  return (props: any) => {
    const router = useRouter()
    const {currentUserIsAdmin } = useAuth()

    if (!currentUserIsAdmin) {
      router.push("/")
    }

    return (
      <>
        <WrappedComponent {...props} />
      </>
    )
  }
}

export default withAdmin
