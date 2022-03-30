import {useState, useEffect, useRef} from 'react'
import {getAuth, onAuthStateChanged} from 'firebase/auth'
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from 'firebase/storage'
import {doc, updateDoc, getDoc, serverTimestamp} from 'firebase/firestore'
import {db} from "../../config/firebase.config"
import {v4 as uuidv4} from 'uuid'
import {toast} from "react-hot-toast"
import {Loader} from "../index"
import {useNavigate, useParams} from "react-router-dom";

const Edit = () => {
    const [geoLocEnabled, setGeoLocEnabled] = useState(false) // For search use GeoLocation or Analog
    const [loading, setLoading] = useState(false)
    const [listing, setListing] = useState(false)
    const [formData, setFormData] = useState({
        type: 'rent',
        name: '',
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: '',
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: {},
        latitude: 0,
        longitude: 0,
    })

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

    const auth = getAuth()
    const navigate = useNavigate()
    const {id} = useParams()
    const isMounted = useRef(true)

    // Redirect if listing is not user's
    useEffect(() => {
        if (listing && listing.userRef !== auth.currentUser.uid) {
            toast.error('You can not edit that listing')
            navigate('/')
        }
    })

    // Fetch listing to edit
    useEffect(() => {
        setLoading(true)
        const fetchListing = async () => {
            const docRef = doc(db, 'listings', id)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                setListing(docSnap.data())
                setFormData({...docSnap.data(), address: docSnap.data().location})
                setLoading(false)
            } else {
                navigate('/')
                toast.error('Listing does not exist')
            }
        }

        fetchListing()
    }, [id, navigate])

    // Sets userRef to logged in user
    useEffect(() => {
        if (isMounted) {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setFormData({...formData, userRef: user.uid})
                } else {
                    navigate('/sign-in')
                }
            })
        }

        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted])

    const onSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)

        if (discountedPrice >= regularPrice) {
            setLoading(false)
            toast.error('Discounted price needs to be less than regular price')
            return
        }

        if (images.length > 6) {
            setLoading(false)
            toast.error('Max 6 images')
            return
        }

        let geolocation = {}
        let location

        if (geoLocEnabled) {
        } else {
            geolocation.lat = latitude
            geolocation.lng = longitude
        }

        // Store image in firebase
        const storeImage = async (image) => {
            return new Promise((resolve, reject) => {
                const storage = getStorage()
                const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`

                const storageRef = ref(storage, 'images/' + fileName)

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
                        reject(error)
                    },
                    () => {
                        // Handle successful uploads on complete
                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL)
                        })
                    }
                )
            })
        }

        const imgUrls = await Promise.all(
            [...images].map((image) => storeImage(image))
        ).catch(() => {
            setLoading(false)
            toast.error('Images not uploaded')
            return
        })

        const formDataCopy = {
            ...formData,
            imgUrls,
            geolocation,
            timestamp: serverTimestamp(),
        }

        formDataCopy.location = address
        delete formDataCopy.images
        delete formDataCopy.address
        !formDataCopy.offer && delete formDataCopy.discountedPrice

        // Update listing
        const docRef = doc(db, 'listings', id)
        await updateDoc(docRef, formDataCopy)
        setLoading(false)
        toast.success('Listing saved')
        navigate(`/category/${formDataCopy.type}/${docRef.id}`)
    }

    const onMutate = (e) => {
        let boolean = null

        if (e.target.value === 'true') {
            boolean = true
        }
        if (e.target.value === 'false') {
            boolean = false
        }

        // Files
        if (e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files,
            }))
        }

        // Text/Booleans/Numbers
        if (!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value,
            }))
        }
    }

    if (loading) return <Loader/>


    return <section className="grid justify-items-center max-w-lg m-auto w-full">
        <h1 className="title-1">Edit Listing</h1>
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

export default Edit
