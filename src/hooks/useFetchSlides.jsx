import React, {useEffect, useState} from "react"
import {collection, getDocs, query, orderBy, limit} from "firebase/firestore"
import {db} from "../config/firebase.config"

const useFetchSlides = () => {
    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState(null)
    
    useEffect(() => {
        const fetchListings = async () => {
            // This is creating a reference to the listings collection in Firebase.
            const listingsRef = collection(db, "listings")
            // This is creating a query to the listings collection in Firebase.
            const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5))
            // This is fetching the documents from the Firebase Firestore.
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

        fetchListings()
    }, [])
    
    return {listings, loading}
}

export default useFetchSlides
