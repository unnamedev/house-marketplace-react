import {getAuth, onAuthStateChanged} from "firebase/auth"
import {useEffect, useRef, useState} from "react"

const useAuthStatus = () => {
    // assume user to be logged out
    const [loggedIn, setLoggedIn] = useState(false)
    // keep track to display a spinner while auth status is being checked
    const [checkingStatus, setCheckingStatus] = useState(true)
    const isMounted = useRef(true)

    useEffect(() => {
        if (isMounted) {
            // auth listener to keep track of user signing in and out
            const auth = getAuth()
            onAuthStateChanged(auth, (user) => {
                if (user) setLoggedIn(true)
                setCheckingStatus(false)
            })
        }
        return () => {
            isMounted.current = false
        }
    }, [isMounted])

    return {loggedIn, checkingStatus}
}

export default useAuthStatus
