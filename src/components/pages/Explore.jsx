import rentCategoryImage from "../../../assets/images/jpg/rentCategoryImage.jpg"
import sellCategoryImage from "../../../assets/images/jpg/sellCategoryImage.jpg"
import {Link} from "react-router-dom";
import {Slider} from "../index";

/**
 * @description 👋🏻 Explore
 * @returns {JSX.Element}
 * @constructor
 */
const Explore = () => {
    return <div className="explore">
        <header>
            <p className="pageHeader">Explore</p>
        </header>

        <main>
           <Slider/>

            <p className="exploreCategoryHeading mb-4">Categories</p>
            <div className="exploreCategories">
                <Link to="/category/rent">
                    <img className="exploreCategoryImg" src={rentCategoryImage} alt="rent"/>
                    <p className="exploreCategoryName">Places for rent</p>
                </Link>
                <Link to="/category/sale">
                    <img className="exploreCategoryImg" src={sellCategoryImage} alt="sale"/>
                    <p className="exploreCategoryName">Places for sale</p>
                </Link>
            </div>
        </main>
    </div>
}

export default Explore
