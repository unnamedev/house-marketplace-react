/**
 * @description 🍉 Loader
 * @returns {JSX.Element}
 * @constructor
 */
const Loader = ({error}) => <div
    className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-[#f4c9c1] flex flex-col items-center justify-center">
    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"/>
    <h2 className="text-center text-blue01 text-xl font-semibold">{error ? "Ohh..." : "Loading..."}</h2>
    <p className="w-2/3 text-center text-blue01">{error ? "Huston, we have a problem!" : "This may take a few seconds, please don't close this page."}</p>
</div>

export default Loader