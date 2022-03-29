import ArrowRightIcon from "../../../assets/images/svg/keyboardArrowRightIcon.svg?component"
import {useForm} from "react-hook-form";
import {Link} from "react-router-dom";
import {getAuth, sendPasswordResetEmail} from "firebase/auth";
import {toast} from "react-hot-toast";


const ForgotPassword = () => {
    const {register, handleSubmit, formState: {errors}} = useForm({
        mode: "onSubmit",
        defaultValues: {
            email: "",
        }
    })

    const onSubmit = async ({email}) => {
        try {
            const auth = getAuth()
            await sendPasswordResetEmail(auth, email)
            toast.success("Email was sent")
        } catch (e) {
            toast.error("Could not send reset email")
            console.log(e.message)
        }
    }
    return <div className="pageContainer">
        <header>
            <p className="pageHeader">Forgot Password</p>
        </header>

        <main>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="email"
                    name="email"
                    className="emailInput"
                    placeholder="Email"
                    {...register("email", {
                        required: true
                    })}
                />
                <Link className="forgotPasswordLink" to="/sign-in">Sign In</Link>
                <div className="signInBar">
                    <div className="signInText">Send Reset Link</div>

                    <button className="signUpButton">
                        <ArrowRightIcon fill="#ffffff" width="34px" heigth="34px"/>
                    </button>
                </div>
            </form>

        </main>
    </div>
}

export default ForgotPassword
