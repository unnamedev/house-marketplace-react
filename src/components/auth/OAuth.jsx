import {getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth"
import {doc, setDoc, getDoc, serverTimestamp} from "firebase/firestore"
import {db} from "../../firebase.config";
import googleIcon from "../../../assets/images/svg/googleIcon.svg"
import {useLocation, useNavigate} from "react-router-dom";

const OAuth = () => {
    const navigate = useNavigate()
    const {pathname} = useLocation()

    const onClick = async () => {
        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)

            const user = result.user
            // Check for user
            const docRef = doc(db, "users", user.uid)
            const docSnap = await getDoc(docRef)
            // Create user if is not exists
            if (!docSnap.exists()) {
                await setDoc(doc(db, "users", user.uid), {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                })
            }
            navigate("/")
        } catch (e) {
            console.log(e.message)
        }
    }
    return <div className="socialLogin">
        <p>Sign {pathname === "/sign-up" ? "Up" : "In"} with</p>
        <button className="socialIconDiv" onClick={onClick}>
            <img className="socialIconImg" src={googleIcon} alt="Google"/>
        </button>
    </div>
}

export default OAuth
