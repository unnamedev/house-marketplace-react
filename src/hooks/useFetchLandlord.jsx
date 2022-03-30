import {useEffect, useState} from "react"
import {doc, getDoc} from "firebase/firestore"
import {db} from "../config/firebase.config"
import {toast} from "react-hot-toast"

/**
 * useFetchLandlord
 * @param id
 * @returns {{landlord: unknown}}
 */
const useFetchLandlord = (id) => {
    const [landlord, setLandlord] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // It's fetching the landlord data from the database.
        const getLandlord = async () => {
            const docRef = doc(db, "users", id)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                setLandlord(docSnap.data())
                setLoading(false)
            } else {
                toast.error("Could not get landlord data")
            }
        }

        getLandlord()
    }, [id])

    return {landlord, loading}
}

export default useFetchLandlord
