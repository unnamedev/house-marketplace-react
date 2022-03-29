import {Link, useNavigate, useParams} from "react-router-dom";
import {getDoc, doc} from "firebase/firestore"
import {getAuth} from "firebase/auth"
import {db} from "../../firebase.config"
import shareIco from "../../../assets/images/svg/shareIcon.svg"
import {useEffect, useState} from "react";
import {formatPrice} from "../../utils/helpers";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet"

import SwiperCore, {Navigation, Pagination, Scrollbar, A11y} from 'swiper'
import {Swiper, SwiperSlide} from 'swiper/react'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])

/**
 * @description 🍉 Detail
 * @returns {JSX.Element}
 * @constructor
 */
const Detail = () => {
    const {id} = useParams()
    const [detail, setDetail] = useState({})
    const [load, setLoad] = useState(true)
    const [shareLinkCopied, setShareLinkCopied] = useState(false)
    const navigate = useNavigate()
    const auth = getAuth()
    const [geo, setGeo] = useState([])

    useEffect(() => {
        try {
            const fetchData = async () => {
                const docRef = doc(db, "listings", id)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    setDetail(docSnap.data())
                    setGeo([parseFloat(docSnap.data().geoLocation.lat), parseFloat(docSnap.data().geoLocation.lng)])
                    setLoad(false)
                }
            }
            fetchData()
        } catch (e) {
            console.log(e.message)
        }
    }, [navigate, id])

    if (load) return <h3>Loading...</h3>

    return <main>
        <Swiper slidesPerView={1} pagination={{clickable: true}}>
            {detail.imgUrls.map((url, index) => (
                <SwiperSlide key={index}>
                    <div
                        style={{background: `url(${detail.imgUrls[index]}) center no-repeat`, backgroundSize: "cover",}}
                        className="swiperSlideDiv"
                    />
                </SwiperSlide>
            ))}
        </Swiper>

        <div
            className="shareIconDiv"
            onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                setShareLinkCopied(true)
                setTimeout(() => {
                    setShareLinkCopied(false)
                }, 2000)
            }}
        >
            <img src={shareIco} alt=""/>
        </div>

        {shareLinkCopied && <p className="linkCopied">Link Copied!</p>}

        {Object.keys(detail).length !== 0 && <div className="listingDetails">
            <p className="listingName">
                {detail.name} - $
                {detail.offer ? formatPrice(detail.discountedPrice) : formatPrice(detail.regularPrice)}
            </p>
            <p className="listingLocation">{detail.location}</p>
            <p className="listingType">
                For {detail.type === "rent" ? "Rent" : "Sale"}
            </p>
            {detail.offer && (
                <p className="discountPrice">
                    ${detail.regularPrice - detail.discountedPrice} discount
                </p>
            )}

            <ul className="listingDetailsList">
                <li>
                    {detail.bedrooms > 1
                        ? `${detail.bedrooms} Bedrooms`
                        : "1 Bedroom"}
                </li>
                <li>
                    {detail.bathrooms > 1
                        ? `${detail.bathrooms} Bathrooms`
                        : "1 Bathroom"}
                </li>
                <li>{detail.parking && "Parking Spot"}</li>
                <li>{detail.furnished && "Furnished"}</li>
            </ul>

            <p className="listingLocationTitle">Location</p>


            {geo.length !== 0 && <div className="leafletContainer">
                <MapContainer
                    style={{height: "100%", width: "100%"}}
                    center={geo}
                    zoom={13}
                    scrollWheelZoom={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
                    />

                    <Marker position={geo}>
                        <Popup>{detail.location}</Popup>
                    </Marker>
                </MapContainer>
            </div>
            }
            {auth.currentUser?.uid !== detail.userRef &&
                <Link to={`/contact/${detail.userRef}?listingName=${detail.name}`} className="primaryButton">
                    Contact Landlord
                </Link>
            }
        </div>}
    </main>
}

export default Detail
