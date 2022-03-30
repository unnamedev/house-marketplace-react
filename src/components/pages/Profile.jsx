import React, {useState} from "react"
import {getAuth, updateProfile} from "firebase/auth"
import {updateDoc, doc, deleteDoc} from "firebase/firestore"
import {db} from "../../config/firebase.config"
import {Link, useNavigate} from "react-router-dom"
import {toast} from "react-hot-toast"
import useUserListings from "../../hooks/useUserListings"
import {BsArrowRightShort} from "react-icons/bs"
import {Card, Loader} from "../index";
import {AnimatePresence, motion} from "framer-motion";

const Profile = () => {
    // This is a hook that allows us to use the `useNavigate()` function from the react-router-dom package.
    const navigate = useNavigate()
    // Getting the current user's auth object.
    const auth = getAuth()
    const [changeDetails, setChangeDetails] = useState(false)
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    })

    // Destructuring the formData object and assigning the values to the variables name and email.
    const {name, email} = formData

    const {listings, loading, setListings} = useUserListings(auth)

    // A function that will sign the user out of the app and redirect them to the home page.
    const onLogout = async () => {
        await auth.signOut()
        navigate("/")
    }

    // This is a function that will delete a listing from the database.
    const onDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete?")) {
            await deleteDoc(doc(db, "listings", id))
            const updatedListings = listings.filter(listing => listing.id !== id)
            setListings(updatedListings)
            toast.success("Successfully deleted listing")
        }
    }

    // This is a function that will navigate to the edit-listing page and pass the id of the listing as a parameter.
    const onEdit = (id) => navigate(`/edit-listing/${id}`)

    // This is a function that will update the user's profile information.
    const onSubmit = async () => {
        try {
            if (auth.currentUser.displayName !== name) {
                // Update display name in firebase
                await updateProfile(auth.currentUser, {displayName: name})
                // Update in firestore
                const userRef = doc(db, "users", auth.currentUser.uid)
                await updateDoc(userRef, {name})
                toast.success("Profile info successfully updated")
            }
        } catch (e) {
            toast.error("Could not update user profile")
            console.log(e.message)
        }
    }

    // Updating the state of the formData object.
    const onChange = (e) => setFormData(prevState => ({...prevState, [e.target.name]: e.target.value}))

    if (loading) return <Loader/>

    return <section>
        <div className="flex flex-col items-start gap-2 mb-5 sm:flex-row sm:justify-between">
            <p className="title-1">My Profile</p>
            <button type="button" className="btn btn-primary" onClick={onLogout}>Logout</button>
        </div>

        <div className="grid gap-3 items-start lg:grid-cols-2 lg:gap-10 xl:grid-cols-3">
            {/* Left Side */}
            <div className="grid gap-2 xl:col-span-1">
                <div className="flex items-center justify-between">
                    <p className="font-semibold">Personal Details</p>
                    <p
                        className="link"
                        onClick={() => {
                            changeDetails && onSubmit()
                            setChangeDetails(!changeDetails)
                        }}
                    >{changeDetails ? "done" : "change"}</p>
                </div>

                <form className="flex flex-col">
                    <input
                        type="text"
                        name="name"
                        className={`${!changeDetails ? "input bg-slate-300" : "input"} mb-4`}
                        disabled={!changeDetails}
                        value={name}
                        onChange={onChange}
                    />
                    <input
                        type="email"
                        name="email"
                        className={`${!changeDetails ? "input bg-slate-300" : "input bg-slate-300"} mb-4`}
                        disabled={!changeDetails}
                        value={email}
                        onChange={onChange}
                    />
                </form>

                <Link className="link flex items-center" to="/create-listing">
                    Sell or rent your home
                    <BsArrowRightShort size={25}/>
                </Link>
            </div>

            {/* Right Side */}
            {!loading && listings?.length > 0 &&
                <div className="grid gap-2 xl:col-span-2">
                    <p className="font-semibold">Your Listings</p>
                    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3">
                        {listings.map((doc, idx) =>
                            <AnimatePresence key={doc.id}>
                                <motion.div
                                    initial={{opacity: 0, y: 100}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{
                                        delay: idx * 0.2,
                                        default: {duration: 0.6},
                                    }}
                                >
                                    <Card
                                        key={doc.id}
                                        id={doc.id}
                                        {...doc.data}
                                        onDelete={() => onDelete(doc.id)}
                                        onEdit={() => onEdit(doc.id)}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        )}
                    </ul>
                </div>
            }
        </div>
    </section>
}

export default Profile
