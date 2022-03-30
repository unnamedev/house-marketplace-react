import PropTypes from "prop-types"
import {Link, useNavigate} from "react-router-dom"
/* Swiper */
import SwiperCore, {Navigation, Pagination, Scrollbar, A11y} from "swiper"
import {Swiper, SwiperSlide} from "swiper/react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/scrollbar"
import useFetchSlides from "../../hooks/useFetchSlides"
import {Loader} from "../index"

/* Swiper Config */
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])

/**
 * @description 🍉 Explore
 * @param categories
 * @returns {JSX.Element}
 * @constructor
 */
const Explore = ({categories}) => <section>
    <h2 className="title-1">Explore</h2>
    <p className="text-lg font-semibold mb-3">Recommended</p>
    <Slider/>
    <p className="text-lg font-semibold mb-3 mt-3">Categories</p>
    <ul className="grid gap-4 max-w-sm m-auto sm:grid-cols-2 sm:max-w-full">
        {categories.map((i, idx) =>
            <li key={idx}>
                <Link className="grid gap-2 group" to={`/category/${i.label}`}>
                    <div className="rounded-xl min-h-[150px] h-[20vw] overflow-hidden shadow-md">
                        <img className="object-cover h-full w-full transition-all group-hover:scale-[1.1]" src={i.image}
                             alt={i.label}/>
                    </div>
                    <h3 className="text-sm font-semibold transition-all group-hover:text-pink03 lg:text-lg">Places
                        for {i.label}</h3>
                </Link>
            </li>
        )}
    </ul>
</section>

/* Check props */
Explore.propTypes = {
    categories: PropTypes.arrayOf(PropTypes.object)
}

/* Default props */
Explore.defaultProps = {
    categories: [
        {
            image: "/assets/images/image-rent.jpg",
            label: "rent"
        },
        {
            image: "/assets/images/image-sell.jpg",
            label: "sale"
        }
    ]
}

export default Explore

/**
 * @description 🍉 Slider
 * @returns {JSX.Element}
 * @constructor
 */
const Slider = () => {
    const navigate = useNavigate()
    const {listings, loading} = useFetchSlides()

    if (loading) return <Loader/>

    return <Swiper slidesPerView={1} pagination={{clickable: true}}>
        {listings.map(({data, id}) =>
            <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
                <div style={{background: `url(${data.imgUrls[0]}) center no-repeat`, backgroundSize: "cover"}}
                    className="min-h-[200px] shadow-md rounded-xl cursor-grab xl:min-h-[300px] relative overflow-hidden"
                >
                    <div className="absolute left-2 top-5 bg-white/60 max-w-fit mt-auto relative z-50 p-2 rounded-lg md:p-5">
                        <p className="font-semibold text-lg md:text-xl">{data.name}</p>
                        <p className="font-semibold">
                            ${data.discountedPrice ?? data.regularPrice}{" "}
                            {data.type === "rent" && "/ month"}
                        </p>
                    </div>
                </div>
            </SwiperSlide>
        )}
    </Swiper>
}