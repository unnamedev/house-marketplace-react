import {Link} from "react-router-dom";
import {formatPrice} from "../../utils/helpers";
import {IoBed} from "react-icons/io5";
import {FaBath} from "react-icons/fa";
import DeleteIcon from '/assets/images/svg/deleteIcon.svg?component'
import EditIcon from '/assets/images/svg/editIcon.svg?component'
/**
 * @description 👋🏻 ListingItem
 * @returns {JSX.Element}
 * @constructor
 */

const ListingItem = ({
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
                     }) => {
    return <li className="categoryListing">
        <Link className="categoryListingLink" to={`/category/${type}/${id}`}>
            <img className="categoryListingImg" src={imgUrls[0]} alt={name}/>
            <div className="categoryListingDetails">
                <p className="categoryListingLocation">{location}</p>
                <p className="categoryListingName">{name}</p>
                <p className="categoryListingPrice">${offer ? formatPrice(discountedPrice) : formatPrice(regularPrice)}</p>
                <div className="categoryListingInfoDiv">
                    <IoBed size={25}/>
                    <p className="categoryListingInfoText">{bedrooms > 1 ? `${bedrooms} Bedrooms` : "1 Bedroom"}</p>
                    <FaBath size={25}/>
                    <p className="categoryListingInfoText">{bathrooms > 1 ? `${bathrooms} Bathrooms` : "1 Bathroom"}</p>
                </div>
            </div>
        </Link>

        {onDelete && (
            <DeleteIcon
                className='removeIcon'
                fill='rgb(231, 76,60)'
                onClick={() => onDelete(id, name)}
            />
        )}

        {onEdit && <EditIcon className='editIcon' onClick={() => onEdit(id)} />}
    </li>
}

export default ListingItem
