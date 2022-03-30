import {useParams, useSearchParams} from "react-router-dom"
import useFetchLandlord from "../../hooks/useFetchLandlord"
import {useState} from "react"
import {Loader} from "../index"

const Contact = () => {
    const {id} = useParams()
    const {landlord, loading} = useFetchLandlord(id)
    const [searchParams, setSearchParams] = useSearchParams()
    const [msg, setMsg] = useState("")

    if (loading) return <Loader/>

    return <section>
        <h1 className="title-1">Contact Landlord</h1>

        {landlord !== null &&
            <div className="grid justify-items-start gap-2">
                <p className="font-semibold xl:text-2xl">Contact {landlord?.name}</p>

                <form
                    onSubmit={e => e.preventDefault()}
                    className="flex flex-col gap-3 items-start w-full">
                    <label className="font-semibold" htmlFor="message">Message</label>
                    <textarea
                        className="bg-white resize-none w-full min-h-[300px] p-3 rounded-lg shadow"
                        name="message"
                        id="message"
                        placeholder="Enter your message..."
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                    />

                    {msg.length !== 0 &&
                        <a href={`mailto:${landlord.email}?Subject=${searchParams.get("listingName")}&body=${msg}`}>
                            <button type="button" className="btn btn-primary">Send Message</button>
                        </a>
                    }
                </form>
            </div>
        }
    </section>
}

export default Contact
