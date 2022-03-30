import {Link, useParams} from "react-router-dom"
import {getAuth} from "firebase/auth"
import {useState} from "react"
import {Loader} from "../index"
import {FaShareAlt} from "react-icons/fa"
import useFetchListingsItem from "../../hooks/useFetchListingsItem"
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet"
/* Swiper */
import SwiperCore, {Navigation, Pagination, Scrollbar, A11y} from "swiper"
import {Swiper, SwiperSlide} from "swiper/react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/scrollbar"
import {formatPrice} from "../../utils/helpers";

/* Swiper Config */
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])

/**
 * @description 🍉 Detail
 * @returns {JSX.Element}
 * @constructor
 */
const Detail = () => {
    // This is destructuring the `useParams()` object and assigning the `id` property to the `id` variable.
    const {id} = useParams()
    // This is a function that returns the user"s authentication status.
    const auth = getAuth()
    // Store page url copy link
    const [share, setShare] = useState(false)

    const {listings, loading, mapCenter} = useFetchListingsItem(id)

    // This is a conditional statement that checks if the `loading` state is `true` or `false`.
    if (loading) return <Loader/>

    const {
        name,
        offer,
        discountedPrice,
        regularPrice,
        location,
        type,
        bedrooms,
        bathrooms,
        parking,
        furnished,
        userRef
    } = listings

    return <section>
        {/* Slider */}
        <Slider items={listings.imgUrls}/>
        {/* Share */}
        <Share share={share} setShare={setShare}/>
        {/* Content */}

        <div className="grid justify-items-start gap-2 pt-4">
            <h1 className="font-semibold text-lg sm:text-xl md:text-2xl xl:text-4xl">
                {name} - ${offer ? formatPrice(discountedPrice) : formatPrice(regularPrice)}
            </h1>
            <p>{location}</p>
            <div className="flex gap-2">
                <span
                    className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">For {type}</span>
                {offer && <span
                    className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-green-600 rounded-full">${formatPrice(Number(regularPrice) - Number(discountedPrice))} discount</span>}
            </div>
            <p>{bedrooms > 1 ? `${bedrooms} Bedrooms` : "1 Bedroom"}</p>
            <p>{bathrooms > 1 ? `${bathrooms} Bathrooms` : "1 Bathroom"}</p>
            <p>{parking && "Parking Spot"}</p>
            <p>{furnished && "Furnished"}</p>

            <h3 className="font-semibold text-lg">Location</h3>

            {mapCenter && mapCenter?.length !== 0 && <div className="min-h-[200px] w-full">
                <MapContainer
                    style={{height: "100%", width: "100%"}}
                    center={mapCenter}
                    zoom={13}
                    scrollWheelZoom={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
                    />

                    <Marker position={mapCenter}>
                        <Popup>{location}</Popup>
                    </Marker>
                </MapContainer>
            </div>}

            {auth.currentUser?.uid !== userRef &&
                <Link to={`/contact/${userRef}?listingName=${name}`} className="btn btn-primary">
                    Contact Landlord
                </Link>
            }
        </div>
    </section>
}

export default Detail

/**
 * @description 🍉 Slider
 * @param items
 * @returns {JSX.Element}
 * @constructor
 */
const Slider = ({items}) =>
    <Swiper slidesPerView={1} pagination={{clickable: true}}>
        {items.map((url, index) =>
            <SwiperSlide key={index}>
                <div
                    className="min-h-[200px] shadow-md rounded-xl cursor-grab xl:min-h-[300px]"
                    style={{background: `url(${items[index]}) center no-repeat`, backgroundSize: "cover"}}
                />
            </SwiperSlide>
        )}
    </Swiper>


/**
 * @description 🍉 Share
 * @returns {JSX.Element}
 * @constructor
 */
const Share = ({share, setShare}) => {
    // This is a function that copies the current page url to the user`s clipboard.
    const onClick = () => {
        navigator.clipboard.writeText(window.location.href)
        setShare(true)
        setTimeout(() => setShare(false), 2000)
    }

    return <div className="absolute absolute right-2 top-2 z-20 group cursor-pointer group">
        <div
            className="absolute right-0 top-0  w-[40px] h-[40px] rounded-[50%] bg-white flex items-center justify-center transition-all shadow group-hover:bg-[#ea7a66] group-hover:text-white"
            onClick={onClick}
        >
            <FaShareAlt size={20}/>
        </div>
        {share &&
            <p className="absolute right-0 top-[50px] p-2 bg-white min-w-[120px] rounded-lg text-center text-sm font-semibold">Link
                Copied!</p>}
    </div>
}