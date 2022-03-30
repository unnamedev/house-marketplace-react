import PropTypes from "prop-types"
import {Link} from "react-router-dom"
import {formatPrice} from "../../utils/helpers"
import {IoBed} from "react-icons/io5"
import {FaBath} from "react-icons/fa"
import {AiFillDelete, AiFillEdit} from "react-icons/ai"

/**
 * @description 🍉 Card
 * @returns {JSX.Element}
 * @constructor
 */
const Card = ({
                  imgUrls,
                  type,
                  name,
                  offer,
                  discountedPrice,
                  regularPrice,
                  bedrooms,
                  bathrooms,
                  location,
                  id,
                  onDelete,
                  onEdit
              }) =>
    <li className="bg-white relative rounded-xl shadow-md transition-all hover:shadow-lg">
        <Link className="grid gap-2 text-sm" to={`/category/${type}/${id}`}>
            <div className="rounded-xl min-h-[150px] h-[20vw] overflow-hidden shadow-md">
                <img className="object-cover h-full w-full transition-all group-hover:scale-[1.1]" src={imgUrls[0]}
                     alt={name}/>
            </div>
            <div className="p-4 grid gap-2">
                <p>{location}</p>
                <h3 className="text-lg font-semibold transition-all group-hover:text-pink03 lg:text-lg">{name}</h3>
                <p>${offer ? formatPrice(discountedPrice) : formatPrice(regularPrice)}</p>
                <div className="flex items-center gap-3">
                    <IoBed size={25}/>
                    <p>{bedrooms > 1 ? `${bedrooms} Bedrooms` : "1 Bedroom"}</p>
                    <FaBath size={25}/>
                    <p>{bathrooms > 1 ? `${bathrooms} Bathrooms` : "1 Bathroom"}</p>
                </div>
            </div>
        </Link>

        <div className="absolute right-2 top-2 flex gap-2 p-2 bg-white rounded-lg cursor-pointer">
            {/* Delete */}
            {onDelete && <AiFillDelete className="text-red-500" size={25} onClick={() => onDelete(id, name)}/>}

            {/* Edit */}
            {onEdit && <AiFillEdit className="text-blue-500" size={25} onClick={() => onEdit(id)} />}
        </div>
    </li>

Card.propTypes = {
    imgUrls: PropTypes.array
}
export default Card
