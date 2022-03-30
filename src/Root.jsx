import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import {Toaster} from "react-hot-toast"
import {
    Category,
    Contact, Create,
    Detail, Edit,
    Explore,
    ForgotPassword,
    Navbar,
    Offers,
    PrivateRoute, Profile,
    SignIn,
    SignUp
} from "./components"

/**
 * @description - Root Component
 * @returns {JSX.Element}
 * @constructor
 */
const Root = () =>
    <Router>
        <Toaster position="top-right"/>
        <main className="main">
            <Routes>
                <Route path="/" exact element={<Explore/>}/>
                <Route path="/category/:name" exact element={<Category/>}/>
                <Route path="/category/:name/:id" exact element={<Detail/>}/>
                <Route path="/contact/:id" exact element={<Contact/>}/>
                <Route path="/offers" exact element={<Offers/>}/>
                <Route path="/profile" exact element={<PrivateRoute/>}>
                    <Route path="/profile" exact element={<Profile/>}/>
                </Route>
                <Route path="/sign-in" exact element={<SignIn/>}/>
                <Route path="/sign-up" exact element={<SignUp/>}/>
                <Route path="/forgot-password" exact element={<ForgotPassword/>}/>
                <Route path="/create-listing" exact element={<Create/>}/>
                <Route path="/edit-listing/:id" exact element={<Edit/>}/>
            </Routes>
        </main>
        <Navbar/>
    </Router>

export default Root
