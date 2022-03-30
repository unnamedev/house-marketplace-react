import useDarkMode from "../../hooks/userDarkMode"
import {MdDarkMode, MdLightMode} from "react-icons/md"

/**
 * @description - Toggle Component
 * @returns {JSX.Element}
 * @constructor
 */
const Toggle = () => {
    const [isDark, setIsDark] = useDarkMode()

    return <label className="block cursor-pointer p-2">
        <input
            className="visually-hidden"
            type="checkbox"
            checked={isDark}
            onChange={e => setIsDark(e.target.checked)}
        />
        {isDark ? <MdDarkMode size={20}/> : <MdLightMode size={20}/>}
    </label>
}

export default Toggle
