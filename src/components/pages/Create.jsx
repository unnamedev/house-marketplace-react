import {useEffect, useRef, useState} from "react"
import {getAuth, onAuthStateChanged} from "firebase/auth"
import {useNavigate} from "react-router-dom"
import {toast} from "react-hot-toast"
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage"
import {db} from "../../config/firebase.config"
import {v4 as uuidv4} from "uuid"
import {addDoc, collection, serverTimestamp} from "firebase/firestore"
import {Loader} from "../index"

/**
 * @description 🍉 Create
 * @returns {JSX.Element}
 * @constructor
 */
const Create = () => {
    const [geoLocEnabled, setGeoLocEnabled] = useState(false) // For search use GeoLocation or Analog
    const [load, setLoad] = useState(false) // For show Spinner
    const [formData, setFormData] = useState({
        type: "rent",
        name: "",
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: "",
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: {},
        latitude: 0,
        longitude: 0
    }) // Form fields
    const {
        type,
        name,
        bedrooms,
        bathrooms,
        parking,
        furnished,
        address,
        offer,
        regularPrice,
        discountedPrice,
        images,
        latitude,
        longitude,
    } = formData
    // Creating a function that will be used to get the user's authentication.
    const auth = getAuth()
    // Creating a function that will navigate to a specific path when called.
    const navigate = useNavigate()
    // The above code is a React Hook that returns a boolean value.
    const isMounted = useRef(true)

    useEffect(() => {
        if (isMounted) {
            // This is a function that will be called whenever the user signs in or out.
            // It will set the formData.userRef to the current user's uid.
            onAuthStateChanged(auth, user => {
                if (user) setFormData({...formData, userRef: user.uid})
                else navigate("/sign-in")
            })
        }
        return () => {
            isMounted.current = false
        }
    }, [isMounted])

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoad(true)

        // This is checking if the discounted price is less than the regular price. If it is, then it will set the load to
        // false and display an error message.
        if (discountedPrice >= regularPrice) {
            setLoad(false)
            toast.error("Discount price needs to be less than regular price")
            return
        }

        // This code is checking if the user has uploaded more than 6 images. If they have, it will display an error message.
        if (images.length > 6) {
            setLoad(false)
            toast.error("Max 6 images")
            return
        }

        let geoLocation = {}
        let location = null

        if (geoLocEnabled) {
        } else {
            geoLocation.lat = latitude
            geoLocation.lng = longitude
            location = address
        }

        // Uploading the image to the firebase storage.
        const storeImages = async (image) => {
            return new Promise((res, rej) => {
                const storage = getStorage()
                const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
                const storageRef = ref(storage, `/images/${fileName}`)
                const uploadTask = uploadBytesResumable(storageRef, image)

                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progress =
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        console.log('Upload is ' + progress + '% done')
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused')
                                break
                            case 'running':
                                console.log('Upload is running')
                                break
                            default:
                                break
                        }
                    },
                    (error) => {
                        rej(error)
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            res(downloadURL)
                        })
                    }
                )

            })
        }

        // The above code is using the Promise.all() method to run a for loop over the images array and store each image in the database.
        const imgUrls = await Promise.all(
            [...images].map((image) => storeImages(image))
        ).catch(() => {
            setLoad(false)
            toast.error('Images not uploaded')
            return
        })

        // Creating a new object that is a combination of the formData object and the imgUrls object.
        const resultData = {
            ...formData,
            imgUrls,
            geoLocation,
            timestamp: serverTimestamp()
        }

        resultData.location = address
        delete resultData.address
        delete resultData.images
        !resultData.offer && delete resultData.discountedPrice

        // The above code is adding a document to the listings collection in the database.
        const docRef = await addDoc(collection(db, 'listings'), resultData)
        setLoad(false)
        toast.success('Listing saved')
        //
        navigate(`/category/${resultData.type}/${docRef.id}`)
    }

    // This is the code that is handling the form submission. It is taking the form data and sending it to the API.
    const onMutate = (e) => {
        let boolean = null
        if (e.target.value === 'true') boolean = true
        if (e.target.value === 'false') boolean = false
        // Files
        if (e.target.files) setFormData((prevState) => ({...prevState, images: e.target.files,}))
        // Text/Booleans/Numbers
        if (!e.target.files) setFormData((prevState) => ({...prevState, [e.target.id]: boolean ?? e.target.value}))
    }

    if (load) return <Loader/>


    return <section className="grid justify-items-center max-w-lg m-auto w-full">
        <h1 className="title-1">Create a Listing</h1>

        <form
            autoComplete="off"
            className="flex flex-col items-start gap-3 mb-3 w-full"
            onSubmit={onSubmit}
        >
            {/* Sell / Rent */}
            <label className="font-semibold text-lg">Sell / Rent</label>
            <div className="flex gap-2 items-center">
                <button
                    type="button"
                    className={type === "sale" ? "btn btn-primary" : "btn bg-white text-black"}
                    id="type"
                    value="sale"
                    onClick={onMutate}
                >
                    Sell
                </button>
                <button
                    type="button"
                    className={type === "rent" ? "btn btn-primary" : "btn bg-white text-black"}
                    id="type"
                    value="rent"
                    onClick={onMutate}
                >
                    Rent
                </button>
            </div>

            {/* Name */}
            <label className="font-semibold text-lg">Name *</label>
            <input
                className="input"
                type="text"
                id="name"
                placeholder="Name"
                value={name}
                onChange={onMutate}
                maxLength="32"
                minLength="10"
                required
            />

            {/* Bedrooms / Bathrooms */}
            <div className="flex gap-5 items-center">
                <div className="flex flex-col">
                    <label className="font-semibold text-lg">Bedrooms</label>
                    <input
                        className="input"
                        type="number"
                        id="bedrooms"
                        value={bedrooms}
                        onChange={onMutate}
                        min="1"
                        max="50"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold text-lg">Bathrooms</label>
                    <input
                        className="input"
                        type="number"
                        id="bathrooms"
                        value={bathrooms}
                        onChange={onMutate}
                        min="1"
                        max="50"
                        required
                    />
                </div>
            </div>

            {/* Parking spot */}
            <label className="font-semibold text-lg">Parking spot</label>
            <div className="flex gap-2 items-center">
                <button
                    className={parking ? "btn btn-primary" : "btn bg-white text-black"}
                    type="button"
                    id="parking"
                    value={true}
                    onClick={onMutate}
                >
                    Yes
                </button>
                <button
                    className={!parking && parking !== null ? "btn btn-primary" : "btn bg-white text-black"}
                    type="button"
                    id="parking"
                    value={false}
                    onClick={onMutate}
                >
                    No
                </button>
            </div>

            {/* Furnished */}
            <label className="font-semibold text-lg">Furnished</label>
            <div className="flex gap-2 items-center">
                <button
                    className={furnished ? "btn btn-primary" : "btn bg-white text-black"}
                    type="button"
                    id="furnished"
                    value={true}
                    onClick={onMutate}
                >
                    Yes
                </button>
                <button
                    className={!furnished && furnished !== null ? "btn btn-primary" : "btn bg-white text-black"}
                    type="button"
                    id="furnished"
                    value={false}
                    onClick={onMutate}
                >
                    No
                </button>
            </div>

            {/* Address */}
            <label className="font-semibold text-lg">Address</label>
            <textarea
                className="input min-h-[100px]"
                type="text"
                id="address"
                placeholder="Address"
                value={address}
                onChange={onMutate}
                required
            />

            {/* If not use GEOLOCATION API */}
            {!geoLocEnabled && (
                <div className="flex gap-5 items-center">
                    <div className="flex flex-col">
                        <label className="font-semibold text-lg">Latitude</label>
                        <input
                            className="input"
                            type="number"
                            id="latitude"
                            value={latitude}
                            onChange={onMutate}
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold text-lg">Longitude</label>
                        <input
                            className="input"
                            type="number"
                            id="longitude"
                            value={longitude}
                            onChange={onMutate}
                            required
                        />
                    </div>
                </div>
            )}

            {/* Offer */}
            <label className="font-semibold text-lg">Offer</label>
            <div className="flex gap-2 items-center">
                <button
                    className={offer ? "btn btn-primary" : "btn bg-white text-black"}
                    type="button"
                    id="offer"
                    value={true}
                    onClick={onMutate}
                >
                    Yes
                </button>
                <button
                    className={!offer && offer !== null ? "btn btn-primary" : "btn bg-white text-black"}
                    type="button"
                    id="offer"
                    value={false}
                    onClick={onMutate}
                >
                    No
                </button>
            </div>

            <label className="font-semibold text-lg">Regular Price</label>
            <div className="flex items-center gap-2">
                <input
                    className="input"
                    type="number"
                    id="regularPrice"
                    value={regularPrice}
                    onChange={onMutate}
                    min="50"
                    max="750000000"
                    required
                />
                {type === "rent" && <p className="flex-shrink-0 font-semibold">$ / Month</p>}
            </div>

            {offer && <>
                <label className="font-semibold text-lg">Discounted Price</label>
                <input
                    className="input max-w-[100px]"
                    type="number"
                    id="discountedPrice"
                    value={discountedPrice}
                    onChange={onMutate}
                    min="50"
                    max="750000000"
                    required={offer}
                />
            </>}

            <label className="font-semibold text-lg">Images</label>
            <p className="bg-white w-full p-2 text-center bg-orange-200 rounded-lg">The first image will be the cover (max 6).</p>
            <input
                className="input"
                type="file"
                id="images"
                onChange={onMutate}
                max="6"
                accept=".jpg,.png,.jpeg"
                multiple
                required
            />

            <button type="submit" className="btn btn-primary">Create Listing</button>
        </form>
    </section>
}

export default Create
