import React, {useState} from "react"
import {Link, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {toast} from "react-hot-toast";
import {getAuth, createUserWithEmailAndPassword, updateProfile} from "firebase/auth"
import {serverTimestamp, doc, setDoc} from "firebase/firestore"
import {db} from "../../config/firebase.config"
import {MdOutlineVisibility} from "react-icons/md";
import {AiOutlineEyeInvisible} from "react-icons/ai";
import {BsArrowRightShort} from "react-icons/bs";
import {OAuth} from "../index";


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

    // It's a callback function that will be called when the form is submitted.
    const onSubmit = async ({name, email, password}) => {
        try {
            // It's getting the current user's authentication status.
            const auth = getAuth()
            // It's creating a new user with the given email and password.
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            // It's getting the user's authentication status.
            const user = userCredential.user
            // It's updating the user's display name.
            await updateProfile(auth.currentUser, {displayName: name})
            // It's creating a new document in the users collection with the user's uid as the document id.
            await setDoc(doc(db, "users", user.uid), {
                name, email, timestamp: serverTimestamp()
            })
            // It's redirecting the user to the home page.
            navigate("/")
        } catch (e) {
            toast.error("Something went wrong")
            console.log(e.message)
        }
    }

    //
    const onShow = () => setShowPassword(!showPassword)

    return <section className="grid justify-items-center max-w-lg m-auto w-full">
        <h1 className="title-1">Register</h1>

        <form
            autoComplete="off"
            className="flex flex-col items-start gap-3 mb-3 w-full"
            onSubmit={handleSubmit(onSubmit)}
        >
            <label htmlFor="name">Name</label>
            <input
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                className="input"
                {...register("name", {required: true})}
            />
            {errors.name && <p className="text-red-500">Name is required</p>}

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

            <button type="submit" className="btn btn-primary">Sign Up</button>
        </form>

        <div className="flex flex-col items-center gap-2">
            <Link to="/forgot-password" className="link">Forgot password?</Link>
            <OAuth/>
            <Link className="link flex items-center" to="/sign-in">
                Sign In Instead
                <BsArrowRightShort size={25}/>
            </Link>
        </div>
    </section>
}

export default SignUp
