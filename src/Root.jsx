import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import {
    Category, Contact,
    CreateListing, Detail, EditListing,
    Explore,
    ForgotPassword,
    Navbar,
    Offers,
    PrivateRoute,
    Profile,
    SignIn,
    SignUp
} from "./components"
import {Toaster} from "react-hot-toast"

const Root = () => {
    return <Router>
        <Toaster position="top-right"/>
        <Routes>
            <Route path="/" exact element={<Explore/>}/>
            <Route path="/offers" exact element={<Offers/>}/>
            <Route path="/category/:categoryName" exact element={<Category/>}/>
            <Route path="/category/:categoryName/:id" exact element={<Detail/>}/>
            <Route path="/contact/:id" exact element={<Contact/>}/>
            <Route path="/profile" exact element={<PrivateRoute/>}>
                <Route path="/profile" exact element={<Profile/>}/>
            </Route>
            <Route path="/sign-in" exact element={<SignIn/>}/>
            <Route path="/sign-up" exact element={<SignUp/>}/>
            <Route path="/forgot-password" exact element={<ForgotPassword/>}/>
            <Route path="/create-listing" exact element={<CreateListing/>}/>
            <Route path="/edit-listing/:id" exact element={<EditListing/>}/>
        </Routes>
        <Navbar/>
    </Router>
}

export default Root
