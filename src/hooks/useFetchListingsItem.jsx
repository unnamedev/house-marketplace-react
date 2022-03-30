import {getDoc, doc} from "firebase/firestore"
import {getAuth} from "firebase/auth"
import {db} from "../config/firebase.config"
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

const useFetchListingsItem = (id) => {
    // This is a hook that allows us to navigate to a different page.
    const navigate = useNavigate()

    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [mapCenter, setMapCenter] = useState(null)

    useEffect(() => {
        try {
            const fetchData = async () => {
                // This is a function that returns a reference to the document in the database.
                const docRef = doc(db, "listings", id)
                // This is a function that returns a reference to the document in the database.
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    // This is setting the state of the component to the data that is returned from the database.
                    setListings(docSnap.data())

                    // This is checking if the document has a geoLocation property. If it does, it will set the mapCenter to the lat and lng of the document.
                    if (docSnap.data().geoLocation) {
                        const {lat, lng} = docSnap.data().geoLocation
                        setMapCenter([parseFloat(lat), parseFloat(lng)])
                    }

                    // This is setting the state of the component to false. This is so that the component will render the listings data.
                    setLoading(false)
                }
            }
            fetchData()
        } catch (e) {
            console.log(e.message)
        }
    }, [navigate, id])

    return {listings, loading, mapCenter}
}

export default useFetchListingsItem
