import {useEffect, useState} from "react"
import {getAuth} from "firebase/auth"
import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
} from "firebase/firestore"
import {db} from "../config/firebase.config"

/**
 * useUserListings
 * @returns {{}}
 */
const useUserListings = (auth) => {
    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState(null)

    useEffect(() => {
        const fetchUserListings = async () => {
            // This is creating a reference to the listings collection in the database.
            const listingsRef = collection(db, "listings")
            //This is creating a query to the listings collection in the database.
            const q = query(
                listingsRef,
                where("userRef", "==", auth.currentUser.uid),
                orderBy("timestamp", "desc")
            )
            // This is fetching the documents from the database.
            const querySnap = await getDocs(q)
            // This is creating an empty array.
            let listings = []
            // This is creating an array of objects. Each object has an id and data property.
            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data(),
                })
            })
            // Update state
            setListings(listings)
            setLoading(false)
        }

        fetchUserListings()
    }, [auth.currentUser.uid])

    return {listings, loading, setListings}
}

export default useUserListings
