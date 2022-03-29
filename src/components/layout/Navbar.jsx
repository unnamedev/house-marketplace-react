import OfferIcon from "../../../assets/images/svg/localOfferIcon.svg?component"
import ExploreIcon from "../../../assets/images/svg/exploreIcon.svg?component"
import PersonOutlineIcon from "../../../assets/images/svg/personOutlineIcon.svg?component"
import {useLocation, useNavigate} from "react-router-dom"

const navbarArray = [
    {
        href: "/",
        label: "Explore"
    },
    {
        href: "/offers",
        label: "Offer"
    },
    {
        href: "/profile",
        label: "Profile"
    }
]

/**
 * @description 👋🏻 Navbar
 * @returns {JSX.Element}
 * @constructor
 */
const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const pathMatch = (route) => route === location.pathname

    return <footer className="navbar">
        <div className="navbarNav">
            <ul className="navbarListItems">
                {navbarArray.map(({href, label}, idx) =>
                    <li className="navbarListItem" onClick={() => navigate(`${href}`)} key={idx}>
                        {idx === 0 && <ExploreIcon fill={pathMatch(`${href}`) ? "#2c2c2c" : "#8f8f8f"} width="36px" height="36px"/>}
                        {idx === 1 && <OfferIcon fill={pathMatch(`${href}`) ? "#2c2c2c" : "#8f8f8f"} width="36px" height="36px"/>}
                        {idx === 2 && <PersonOutlineIcon fill={pathMatch(`${href}`) ? "#2c2c2c" : "#8f8f8f"} width="36px" height="36px"/>}
                        <p className={pathMatch(`${href}`) ? "navbarListItemNameActive" : "navbarListItemName"}>
                            {label}
                        </p>
                    </li>
                )}
            </ul>
        </div>
    </footer>
}

export default Navbar
