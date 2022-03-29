import {getAuth, updateProfile} from "firebase/auth"
import {
    updateDoc,
    doc,
    collection,
    getDocs,
    query,
    where,
    orderBy,
    deleteDoc,
} from "firebase/firestore"
import {db} from "../../firebase.config"
import {useEffect, useState} from "react"
import {Link, useNavigate} from "react-router-dom"
import {toast} from "react-hot-toast";
import arrowRight from "../../../assets/images/svg/keyboardArrowRightIcon.svg"
import homeIco from "../../../assets/images/svg/homeIcon.svg"
import {ListingItem} from "../index";

const Profile = () => {
    const navigate = useNavigate()
    const auth = getAuth()
    const [changeDetails, setChangeDetails] = useState(false)
    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState(null)
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    })

    // Destructuring the formData object and assigning the values to the variables name and email.
    const {name, email} = formData

    useEffect(() => {
        const fetchUserListings = async () => {
            const listingsRef = collection(db, "listings")

            const q = query(
                listingsRef,
                where("userRef", "==", auth.currentUser.uid),
                orderBy("timestamp", "desc")
            )

            const querySnap = await getDocs(q)

            let listings = []

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data(),
                })
            })

            setListings(listings)
            setLoading(false)
        }

        fetchUserListings()
    }, [auth.currentUser.uid])

    // A function that will sign the user out of the app and redirect them to the home page.
    const onLogout = async () => {
        await auth.signOut()
        navigate("/")
    }

    // Updating the state of the formData object.
    const onChange = (e) => setFormData(prevState => ({...prevState, [e.target.name]: e.target.value}))

    const onDelete = async (listingId) => {
        if (window.confirm("Are you sure you want to delete?")) {
            await deleteDoc(doc(db, "listings", listingId))
            const updatedListings = listings.filter(
                (listing) => listing.id !== listingId
            )
            setListings(updatedListings)
            toast.success("Successfully deleted listing")
        }
    }

    const onEdit = (id) => navigate(`/edit-listing/${id}`)

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

    return <div className="profile">
        <header className="profileHeader mb-4">
            <p className="pageHeader">My Profile</p>
            <button type="button" className="logOut" onClick={onLogout}>Logout</button>
        </header>

        <main>
            <div className="profileDetailsHeader mb-4">
                <p className="profileDetailsText">Personal Details</p>
                <p
                    className="changePersonalDetails"
                    onClick={() => {
                        changeDetails && onSubmit()
                        setChangeDetails(!changeDetails)
                    }}
                >{changeDetails ? "done" : "change"}</p>
            </div>

            <div className="profileCard">
                <form>
                    <input
                        type="text"
                        name="name"
                        className={`${!changeDetails ? "profileName" : "profileNameActive"} mb-4`}
                        disabled={!changeDetails}
                        value={name}
                        onChange={onChange}
                    />
                    <input
                        type="email"
                        name="email"
                        className={`${!changeDetails ? "profileEmail" : "profileEmailActive"} mb-4`}
                        disabled={!changeDetails}
                        value={email}
                        onChange={onChange}
                    />
                </form>
            </div>

            <Link to="/create-listing" className="createListing">
                <img src={homeIco} alt=""/>
                <p>Sell or rent your home</p>
                <img src={arrowRight} alt=""/>
            </Link>

            {!loading && listings?.length > 0 && (
                <>
                    <p className="listingText">Your Listings</p>
                    <ul className="listingsList">
                        {listings.map(doc =>
                            <ListingItem
                                key={doc.id}
                                id={doc.id}
                                {...doc.data}
                                onDelete={() => onDelete(doc.id)}
                                onEdit={() => onEdit(doc.id)}/>
                        )}
                    </ul>
                </>
            )}
        </main>
    </div>
}

export default Profile
