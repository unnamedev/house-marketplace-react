import {useLocation, useNavigate} from "react-router-dom"
import {getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth"
import {doc, setDoc, getDoc, serverTimestamp} from "firebase/firestore"
import {db} from "../../config/firebase.config"
import {FcGoogle} from "react-icons/fc"

/**
 * @description 🍉 OAuth
 * @returns {JSX.Element}
 * @constructor
 */
const OAuth = () => {
    // A hook that allows us to navigate to a different route.
    const navigate = useNavigate()
    // This is a hook that allows us to access the current location.
    const {pathname} = useLocation()

    const onClick = async () => {
        try {
            // Getting the current user's authentication status.
            const auth = getAuth()
            // This is creating a new GoogleAuthProvider object.
            const provider = new GoogleAuthProvider()
            // This is a promise that will resolve to the result of the sign in.
            const result = await signInWithPopup(auth, provider)
            // This is getting the user object from the result of the sign in.
            const user = result.user
            // This is creating a reference to the document in the users collection.
            const docRef = doc(db, "users", user.uid)
            // This is getting the document from the database.
            const docSnap = await getDoc(docRef)
            // Create user if is not exists
            if (!docSnap.exists()) {
                await setDoc(doc(db, "users", user.uid), {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                })
            }
            // This is a function that allows us to navigate to a different route.
            navigate("/")
        } catch (e) {
            console.log(e.message)
        }
    }

    return <div className="flex flex-col items-center gap-2 my-5">
        <p className="font-semibold">Sign {pathname === "/sign-up" ? "Up" : "In"} with</p>
        <button className="w-[40px] h-[40px] rounded-[50%] bg-white flex items-center justify-center shadow" onClick={onClick}>
            <FcGoogle size={25}/>
        </button>
    </div>
}

export default OAuth
