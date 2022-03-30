import React, {useState} from "react"
import {Link, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth"
import {AiOutlineEyeInvisible} from "react-icons/ai";
import {toast} from "react-hot-toast";
import {MdOutlineVisibility} from "react-icons/md";
import {BsArrowRightShort} from "react-icons/bs";
import {OAuth} from "../index";

/**
 * @description 🍉 SignIn
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
        } catch (e) {
            toast.error("Bad User Credentials")
            console.log(e.message)
        }
    }

    //
    const onShow = () => setShowPassword(!showPassword)

    return <section className="grid justify-items-center max-w-lg m-auto w-full">
        <h1 className="title-1">Welcome Back!</h1>

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
                placeholder="Email"
                className="input"
                {...register("email", {required: true})}
            />
            {errors.email && <p className="text-red-500">Email is required</p>}

            <label htmlFor="password">Password</label>
            <div className="w-full">
                <div className="relative mb-2">
                    <input
                        type={showPassword ? "text" : "password"}
                        className="input pr-[30px]"
                        placeholder="Password"
                        name="password"
                        {...register("password", {required: true})}
                    />
                    {!showPassword ?
                        <MdOutlineVisibility
                            className="absolute right-[10px] top-[50%] translate-y-[-50%] cursor-pointer z-20"
                            size={25}
                            onClick={onShow}
                        />
                        :
                        <AiOutlineEyeInvisible
                            className="absolute right-[10px] top-[50%] translate-y-[-50%] cursor-pointer z-20"
                            size={25}
                            onClick={onShow}
                        />
                    }
                </div>
                {errors.password && <p className="text-red-500">Password is required</p>}
            </div>

            <button type="submit" className="btn btn-primary">Sign In</button>
        </form>

        <div className="flex flex-col items-center gap-2">
            <Link to="/forgot-password" className="link">Forgot password?</Link>
            <OAuth/>
            <Link className="link flex items-center" to="/sign-up">
                Sign Up Instead
                <BsArrowRightShort size={25}/>
            </Link>
        </div>
    </section>
}

export default SignIn
