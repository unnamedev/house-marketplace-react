import {useForm} from "react-hook-form"
import {getAuth, sendPasswordResetEmail} from "firebase/auth"
import {Link} from "react-router-dom"
import {BsArrowRightShort} from "react-icons/bs"
import {toast} from "react-hot-toast"

/**
 * @description 🍉 ForgotPassword
 * @returns {JSX.Element}
 * @constructor
 */
const ForgotPassword = () => {
    const {register, handleSubmit, formState: {errors}} = useForm({
        mode: "onSubmit",
        defaultValues: {email: ""}
    })

    // It's a callback function that will be called when the form is submitted.
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

    return <section className="grid justify-items-center max-w-lg m-auto w-full">
        <h1 className="title-1">Forgot Password</h1>

        <form
            autoComplete="off"
            className="flex flex-col items-start gap-3 mb-3 w-full"
            onSubmit={handleSubmit(onSubmit)}
        >
            <label htmlFor="email">Email</label>
            <input
                type="email"
                name="email"
                id="email"
                className="input"
                placeholder="Email"
                {...register("email", {required: true})}
            />

            {errors.email && <p className="text-red-500">Email is required</p>}

            <button className="btn btn-primary" type="submit">Send Reset Link</button>
        </form>

        <Link className="link flex items-center" to="/sign-in">
            Sign In
            <BsArrowRightShort size={25}/>
        </Link>
    </section>
}

export default ForgotPassword
