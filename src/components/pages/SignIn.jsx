import {useState} from "react"
import ArrowRightIcon from "../../../assets/images/svg/keyboardArrowRightIcon.svg?component"
import visibilityIcon from "../../../assets/images/svg/visibilityIcon.svg"
import {getAuth, signInWithEmailAndPassword} from "firebase/auth"
import {Link, useNavigate} from "react-router-dom"
import {useForm} from "react-hook-form"
import {toast} from "react-hot-toast";
import {OAuth} from "../index";

/**
 * @description 👋🏻 SignIn
 * @returns {JSX.Element}
 * @constructor
 */
const SignIn = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const {register, handleSubmit, formState: {errors}} = useForm({
        mode: "onSubmit",
        defaultValues: {
            email: "",
            password: ""
        }
    })

    // It's a callback function that will be called when the form is submitted.
    const onSubmit = async ({email, password}) => {
        try {
            const auth = getAuth()
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            if (userCredential.user) navigate("/")
        }catch (e) {
            toast.error("Bad User Credentials")
            console.log(e.message)
        }
    }

    return <>
        <div className="pageContainer">
            <header><p className="pageHeader mb-3">Welcome Back!</p></header>
            <main>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email"
                        className="emailInput"
                        {...register("email", {
                            required: true
                        })}
                    />

                    <div className="passwordInputDiv">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="passwordInput"
                            placeholder="Password"
                            name="password"
                            {...register("password", {
                                required: true
                            })}
                        />

                        <img src={visibilityIcon}
                             alt="show"
                             className="showPassword"
                             onClick={() => setShowPassword(!showPassword)}
                        />
                    </div>

                    <Link to="/forgot-password" className="forgotPasswordLink">Forgot password</Link>

                    <div className="signInBar">
                        <p className="signInText">Sign In</p>

                        <button className="signInButton">
                            <ArrowRightIcon fill="#ffffff" width="34px" heigth="34px"/>
                        </button>
                    </div>
                </form>

                <OAuth/>
                <Link to="/sign-up" className="registerLink">Sign Up Instead</Link>
            </main>
        </div>
    </>
}

export default SignIn
