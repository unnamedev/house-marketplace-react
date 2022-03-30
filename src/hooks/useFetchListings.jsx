import {useEffect, useState} from "react";
import {collection, query, where, orderBy, limit, getDocs, startAfter} from "firebase/firestore"
import {db} from "../config/firebase.config"
import {toast} from "react-hot-toast"

const useFetchListings = (type, name) => {
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [lastFetchedListing, setLastFetchedListing] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // It's creating a reference to the listings collection in Firebase.
                const listingsRef = collection(db, "listings")
                // It's creating a query to the listings collection in Firebase.
                const q = query(
                    listingsRef,
                    where(type, "==", name),
                    orderBy("timestamp", "desc"),
                    limit(10)
                )
                // It's fetching the data from Firebase.
                const querySnap = await getDocs(q)

                // It's getting the last document in the query.
                const lastVisible = querySnap.docs[querySnap.docs.length - 1]

                // It's setting the last fetched listing to the last visible document in the query.
                setLastFetchedListing(lastVisible)

                // It's creating an empty array.
                let listings = []

                // It's pushing the data from Firebase into the array.
                querySnap.forEach(doc => listings.push({
                    id: doc.id,
                    data: doc.data()
                }))

                // It's setting the `listings` state to the `listings` array.
                setListings(listings)
                // It's setting the loading state to false.
                setLoading(false)
            } catch (e) {
                toast.error("Could not fetch listings")
                console.log(e.message)
            }
        }
        // It's fetching the data from Firebase.
        fetchData()
    }, [name !== "offer" && name])

    // Pagination / Load More
    const onFetchMoreListings = async () => {
        try {
            // It's creating a reference to the listings collection in Firebase.
            const listingsRef = collection(db, "listings")

            // It's creating a query to the listings collection in Firebase.
            const q = query(
                listingsRef,
                where(type, "==", name),
                orderBy("timestamp", "desc"),
                startAfter(lastFetchedListing),
                limit(10)
            )

            // It's fetching the data from Firebase.
            const querySnap = await getDocs(q)

            const lastVisible = querySnap.docs[querySnap.docs.length - 1]
            setLastFetchedListing(lastVisible)

            const listings = []

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data(),
                })
            })

            setListings((prevState) => [...prevState, ...listings])
            setLoading(false)
        } catch (error) {
            toast.error('Could not fetch listings')
        }
    }
    return {listings, loading, lastFetchedListing, onFetchMoreListings}
}

export default useFetchListings
