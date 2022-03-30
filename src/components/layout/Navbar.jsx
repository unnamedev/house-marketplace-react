import PropTypes from "prop-types"
import {Link, useLocation} from "react-router-dom"
import {MdOutlineExplore, MdOutlineLocalOffer} from "react-icons/md"
import {BiUserCircle} from "react-icons/bi"

/**
 * @description 🍉 Navbar
 * @param menu
 * @returns {JSX.Element}
 * @constructor
 */
const Navbar = ({menu}) => {
    // It's a hook that allows us to access the current location.
    const location = useLocation()

    // It's a function that returns a boolean value. It's checking if the route that we are currently on is the same as the route that we are trying to navigate to.
    const pathMatch = (route) => route === location.pathname

    return <footer className="footer bg-white border-t py-3 px-2 sm:py-4">
        <ul className="flex justify-center w-full gap-7 m-auto sm:max-w-sm sm:w-full sm:text-lg sm:gap-10">
            {menu.map((i, idx) =>
                <li key={idx}>
                    <Link className={`flex flex-col gap-2 items-center ${pathMatch(i.href) ? "is-active" : ""}`}
                          to={i.href}>
                        {i.icon}
                        {i.label}
                    </Link>
                </li>
            )}
        </ul>
    </footer>
}


Navbar.propTypes = {
    menu: PropTypes.arrayOf(PropTypes.object)
}

// It's a way to set default values for props.
Navbar.defaultProps = {
    menu: [
        {
            href: "/",
            label: "Explore",
            icon: <MdOutlineExplore size={25}/>
        },
        {
            href: "/offers",
            label: "Offers",
            icon: <MdOutlineLocalOffer size={25}/>
        },
        {
            href: "/profile",
            label: "Profile",
            icon: <BiUserCircle size={25}/>
        }
    ]
}

export default Navbar
