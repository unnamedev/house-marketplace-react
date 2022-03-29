import {useEffect, useRef, useState} from "react"
import {getAuth, onAuthStateChanged} from "firebase/auth"
import {useNavigate} from "react-router-dom";
import {toast} from "react-hot-toast";
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage"
import {db} from "../../firebase.config"
import {v4 as uuidv4} from "uuid"
import {addDoc, collection, serverTimestamp} from "firebase/firestore"

const CreateListing = () => {
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

    if (load) return <h3>Loading...</h3>

    return <div className="profile">
        <header>
            <p className="pageHeader">Create a Listing</p>
        </header>

        <main>
            <form onSubmit={onSubmit}>
                <label className="formLabel">Sell / Rent</label>
                <div className="formButtons">
                    <button
                        type="button"
                        className={type === "sale" ? "formButtonActive" : "formButton"}
                        id="type"
                        value="sale"
                        onClick={onMutate}
                    >
                        Sell
                    </button>
                    <button
                        type="button"
                        className={type === "rent" ? "formButtonActive" : "formButton"}
                        id="type"
                        value="rent"
                        onClick={onMutate}
                    >
                        Rent
                    </button>
                </div>

                <label className="formLabel">Name</label>
                <input
                    className="formInputName"
                    type="text"
                    id="name"
                    value={name}
                    onChange={onMutate}
                    maxLength="32"
                    minLength="10"
                    required
                />

                <div className="formRooms flex">
                    <div>
                        <label className="formLabel">Bedrooms</label>
                        <input
                            className="formInputSmall"
                            type="number"
                            id="bedrooms"
                            value={bedrooms}
                            onChange={onMutate}
                            min="1"
                            max="50"
                            required
                        />
                    </div>
                    <div>
                        <label className="formLabel">Bathrooms</label>
                        <input
                            className="formInputSmall"
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

                <label className="formLabel">Parking spot</label>
                <div className="formButtons">
                    <button
                        className={parking ? "formButtonActive" : "formButton"}
                        type="button"
                        id="parking"
                        value={true}
                        onClick={onMutate}
                    >
                        Yes
                    </button>
                    <button
                        className={!parking && parking !== null ? "formButtonActive" : "formButton"}
                        type="button"
                        id="parking"
                        value={false}
                        onClick={onMutate}
                    >
                        No
                    </button>
                </div>

                <label className="formLabel">Furnished</label>
                <div className="formButtons">
                    <button
                        className={furnished ? "formButtonActive" : "formButton"}
                        type="button"
                        id="furnished"
                        value={true}
                        onClick={onMutate}
                    >
                        Yes
                    </button>
                    <button
                        className={
                            !furnished && furnished !== null
                                ? "formButtonActive"
                                : "formButton"
                        }
                        type="button"
                        id="furnished"
                        value={false}
                        onClick={onMutate}
                    >
                        No
                    </button>
                </div>

                <label className="formLabel">Address</label>
                <textarea
                    className="formInputAddress"
                    type="text"
                    id="address"
                    value={address}
                    onChange={onMutate}
                    required
                />

                {!geoLocEnabled && (
                    <div className="formLatLng flex">
                        <div>
                            <label className="formLabel">Latitude</label>
                            <input
                                className="formInputSmall"
                                type="number"
                                id="latitude"
                                value={latitude}
                                onChange={onMutate}
                                required
                            />
                        </div>
                        <div>
                            <label className="formLabel">Longitude</label>
                            <input
                                className="formInputSmall"
                                type="number"
                                id="longitude"
                                value={longitude}
                                onChange={onMutate}
                                required
                            />
                        </div>
                    </div>
                )}

                <label className="formLabel">Offer</label>
                <div className="formButtons">
                    <button
                        className={offer ? "formButtonActive" : "formButton"}
                        type="button"
                        id="offer"
                        value={true}
                        onClick={onMutate}
                    >
                        Yes
                    </button>
                    <button
                        className={
                            !offer && offer !== null ? "formButtonActive" : "formButton"
                        }
                        type="button"
                        id="offer"
                        value={false}
                        onClick={onMutate}
                    >
                        No
                    </button>
                </div>

                <label className="formLabel">Regular Price</label>
                <div className="formPriceDiv">
                    <input
                        className="formInputSmall"
                        type="number"
                        id="regularPrice"
                        value={regularPrice}
                        onChange={onMutate}
                        min="50"
                        max="750000000"
                        required
                    />
                    {type === "rent" && <p className="formPriceText">$ / Month</p>}
                </div>

                {offer && (
                    <>
                        <label className="formLabel">Discounted Price</label>
                        <input
                            className="formInputSmall"
                            type="number"
                            id="discountedPrice"
                            value={discountedPrice}
                            onChange={onMutate}
                            min="50"
                            max="750000000"
                            required={offer}
                        />
                    </>
                )}

                <label className="formLabel">Images</label>
                <p className="imagesInfo">
                    The first image will be the cover (max 6).
                </p>
                <input
                    className="formInputFile"
                    type="file"
                    id="images"
                    onChange={onMutate}
                    max="6"
                    accept=".jpg,.png,.jpeg"
                    multiple
                    required
                />
                <button type="submit" className="primaryButton createListingButton">
                    Create Listing
                </button>
            </form>
        </main>
    </div>
}

export default CreateListing
