import {useState} from "react"
import ArrowRightIcon from "../../../assets/images/svg/keyboardArrowRightIcon.svg?component"
import visibilityIcon from "../../../assets/images/svg/visibilityIcon.svg"
import {getAuth, createUserWithEmailAndPassword, updateProfile} from "firebase/auth"
import {serverTimestamp, doc, setDoc} from "firebase/firestore"
import {db} from "../../firebase.config"
import {Link, useNavigate} from "react-router-dom"
import {useForm} from "react-hook-form"
import {toast} from "react-hot-toast";
import {OAuth} from "../index";

/**
 * @description 👋🏻 SignUp
 * @returns {JSX.Element}
 * @constructor
 */
const SignUp = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const {register, handleSubmit, formState: {errors}} = useForm({
        mode: "onSubmit",
        defaultValues: {
            name: "",
            email: "",
            password: ""
        }
    })

    const onSubmit = async ({name, email, password}) => {
        try {
            const auth = getAuth()
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user
            await updateProfile(auth.currentUser, {displayName: name})
            await setDoc(doc(db, "users", user.uid), {
                name,
                email,
                timestamp: serverTimestamp()
            }) // create table users, and set form values for new entries
            navigate("/")
        } catch (e) {
            toast.error("Something went wrong")
            console.log(e.message)
        }
    }
    return <div className="pageContainer">
        <header>
            <p className="pageHeader mb-3">Welcome Back!</p>
        </header>

        <main>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Name"
                    className="nameInput"
                    {...register("name", {required: true})}
                />

                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                    className="emailInput"
                    {...register("email", {required: true})}
                />

                <div className="passwordInputDiv">
                    <input
                        type={showPassword ? "text" : "password"}
                        className="passwordInput"
                        placeholder="Password"
                        name="password"
                        {...register("password", {required: true})}
                    />

                    <img src={visibilityIcon}
                         alt="show"
                         className="showPassword"
                         onClick={() => setShowPassword(!showPassword)}
                    />
                </div>

                <Link to="/forgot-password" className="forgotPasswordLink">Forgot password</Link>

                <div className="signUpBar">
                    <p className="signUpText">Sign Up</p>

                    <button className="signUpButton">
                        <ArrowRightIcon fill="#ffffff" width="34px" heigth="34px"/>
                    </button>
                </div>
            </form>

            <OAuth/>
            <Link to="/sign-in" className="registerLink">Sign In Instead</Link>
        </main>
    </div>
}

export default SignUp
