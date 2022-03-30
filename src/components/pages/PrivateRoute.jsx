import {Navigate, Outlet} from "react-router-dom"
import useAuthStatus from "../../hooks/useAuthStatus"
import {Loader} from "../index"

/**
 * @description 🍉 PrivateRoute
 * @returns {JSX.Element}
 * @constructor
 */
const PrivateRoute = () => {
    const {loggedIn, checkingStatus} = useAuthStatus()
    if (checkingStatus) return <Loader/>
    return loggedIn ? <Outlet/> : <Navigate to="/sign-in"/>
}

export default PrivateRoute
