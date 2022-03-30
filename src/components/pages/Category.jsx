import React from "react"
import {useParams} from "react-router-dom"
import useFetchListings from "../../hooks/useFetchListings"
import {Card, Loader} from "../index"
import {motion, AnimatePresence} from "framer-motion"

/**
 * @description 🍉 Category
 * @returns {JSX.Element}
 * @constructor
 */
const Category = () => {
    // It`s pulling the category name from the URL.
    const {name} = useParams()
    const {listings, loading, lastFetchedListing, onFetchMoreListings} = useFetchListings("type", name)

    // It`s checking if the `loading` state is true. If it is, it"ll render the `Loader` component.
    if (loading) return <Loader/>

    return <section>
        <h2 className="title-1">Places for {name}</h2>

        {listings && listings.length > 0 ?
            <>
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {listings.map((doc, idx) =>
                        <AnimatePresence key={doc.id}>
                            <motion.div
                                initial={{opacity: 0, y: 100}}
                                animate={{opacity: 1, y: 0}}
                                transition={{
                                    delay: idx * 0.2,
                                    default: {duration: 0.6},
                                }}
                            >
                                <Card key={doc.id} id={doc.id} {...doc.data}/>
                            </motion.div>
                        </AnimatePresence>
                    )}
                </ul>

                {/* Load More */}
                {lastFetchedListing &&
                    <motion.div
                        className="flex justify-center mt-3 md:mt-8"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay:1, duration: 0.6}}
                    >
                        <button className="btn btn-primary" onClick={onFetchMoreListings}>
                            Load More
                        </button>
                    </motion.div>
                }
            </> :
            <h3 className="text-xl font-semibold text-center">No listings for {name}</h3>
        }
    </section>
}

export default Category
