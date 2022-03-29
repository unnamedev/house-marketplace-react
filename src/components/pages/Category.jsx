import {collection, query, where, orderBy, limit, getDocs, startAfter} from "firebase/firestore"
import {db} from "../../firebase.config"
import {useEffect, useState} from "react"
import {useParams} from "react-router-dom"
import {toast} from "react-hot-toast"
import {ListingItem} from "../index";

/**
 * @description 👋🏻 Category
 * @returns {JSX.Element}
 * @constructor
 */
const Category = () => {
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [lastFetchedListing, setLastFetchedListing] = useState(null)

    // It's pulling the category name from the URL.
    const {categoryName} = useParams()

    useEffect(() => {
        const fetchData = async () => {
            try {
                // It's creating a reference to the listings collection in Firebase.
                const listingsRef = collection(db, "listings")
                // It's creating a query to the listings collection in Firebase.
                const q = query(
                    listingsRef,
                    where("type", "==", categoryName),
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
    }, [categoryName])

    // Pagination / Load More
    const onFetchMoreListings = async () => {
        try {
            // Get reference
            const listingsRef = collection(db, 'listings')

            // Create a query
            const q = query(
                listingsRef,
                where('type', '==', categoryName),
                orderBy('timestamp', 'desc'),
                startAfter(lastFetchedListing),
                limit(10)
            )

            // Execute query
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

    return <div className="category">
        <header>
            <p className="pageHeader">Places for {categoryName}</p>
        </header>

        {loading ?
            <h3>Loading...</h3> :
            listings && listings.length > 0 ?
                <>
                    <main>
                        <ul className="categoryListings">
                            {listings.map(doc => <ListingItem key={doc.id} id={doc.id} {...doc.data} />)}
                        </ul>
                    </main>
                    <br/>
                    {lastFetchedListing && <p className='loadMore' onClick={onFetchMoreListings}>Load More</p>}
                </>

                :
                <h3>No listings for {categoryName}</h3>
        }
    </div>
}

export default Category
