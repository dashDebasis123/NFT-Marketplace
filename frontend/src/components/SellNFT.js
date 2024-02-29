import NavbarMain from "./NavbarMain"
import { useState } from "react"
import { uploadJSONToIPFS } from "../pinata"
// import Marketplace from "../Marketplace.json"
import { Alert } from "@material-tailwind/react"
import { auth, db } from "../firebase"
import { setDoc, serverTimestamp, doc } from "firebase/firestore"
import { useNavigate } from "react-router"
import { useEthers } from "@usedapp/core"
import { useUserAuth } from "./context/UserAuthContext"

export default function SellNFT() {
    const [formParams, updateFormParams] = useState({
        address: "",
        mandal: "",
        district: "",
        wardno: "",
        blockno: "",
        price: "",
    })
    const { user } = useUserAuth()
    const { account } = useEthers()
    const [spinner, setSpinner] = useState(false)
    const navigate = useNavigate()

    // const [fileURL, setFileURL] = useState(null)
    const [message, updateMessage] = useState("")
    // const location = useLocation()

    //This function uploads the metadata to IPFS
    async function uploadMetadataToIPFS() {
        const { address, mandal, district, wardno, blockno, price } = formParams
        //Make sure that none of the fields are empty
        if (!address || !mandal || !district || !wardno || !blockno || !price) {
            updateMessage("Please fill all the fields!")
            return -1
        }
        console.log(address, mandal, district, wardno, blockno, price)
        const nftJSON = {
            address,
            mandal,
            district,
            wardno,
            blockno,
            price,
        }

        try {
            //upload the metadata JSON to IPFS
            const response = await uploadJSONToIPFS(nftJSON)
            if (response.success === true) {
                console.log("Uploaded JSON to Pinata: ", response)
                return response.pinataURL
            }
        } catch (e) {
            console.log("error uploading JSON metadata:", e)
        }
    }

    async function sendRequest(e) {
        e.preventDefault()
        const metadataURL = await uploadMetadataToIPFS()

        console.log("email:  ", user.email)

        console.log("account: ", account)
        console.log("metadataURL:  ", metadataURL)
        await setDoc(doc(db, "requests", user.email), {
            address: account,
            status: "requested",
            time: serverTimestamp(),
            url: metadataURL,
            price: formParams.price,
        })

        navigate("/statustable")
    }

    console.log("Working", process.env)
    return (
        <div className="sellnftClass">
            <NavbarMain></NavbarMain>
            <div class=" flex-col justify-center px-6 py-14 lg:px-8">
                <div class="mx-auto max-w-2xl text-center">
                    <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Land Details
                    </h2>
                    <p class="mt-2 text-lg leading-8 text-gray-600">
                        Enter the details of the land
                    </p>
                </div>
                <form class="mx-auto mt-16 max-w-xl sm:mt-6" onSubmit={sendRequest}>
                    <div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div class="sm:col-span-2">
                            <label
                                for="address"
                                class="block text-sm font-semibold leading-6 text-gray-900"
                            >
                                Address
                            </label>
                            <div class="mt-2">
                                <input
                                    type="text"
                                    name="address"
                                    id="address"
                                    required
                                    autocomplete="organization"
                                    class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        updateFormParams({
                                            ...formParams,
                                            address: e.target.value,
                                        })
                                    }
                                    value={formParams.address}
                                ></input>
                            </div>
                        </div>
                        <div>
                            <label
                                for="mandal"
                                class="block text-sm font-semibold leading-6 text-gray-900"
                            >
                                Mandal
                            </label>
                            <div class="mt-2">
                                <input
                                    type="text"
                                    name="mandal"
                                    id="mandal"
                                    required
                                    autocomplete="given-mandal"
                                    class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        updateFormParams({ ...formParams, mandal: e.target.value })
                                    }
                                    value={formParams.mandal}
                                ></input>
                            </div>
                        </div>
                        <div>
                            <label
                                for="district"
                                class="block text-sm font-semibold leading-6 text-gray-900"
                            >
                                District
                            </label>
                            <div class="mt-2">
                                <input
                                    type="text"
                                    name="district"
                                    id="district"
                                    required
                                    autocomplete="family-name"
                                    class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        updateFormParams({
                                            ...formParams,
                                            district: e.target.value,
                                        })
                                    }
                                    value={formParams.district}
                                ></input>
                            </div>
                        </div>
                        <div>
                            <label
                                for="wardno"
                                class="block text-sm font-semibold leading-6 text-gray-900"
                            >
                                Ward No.
                            </label>
                            <div class="mt-2">
                                <input
                                    type="number"
                                    name="wardno"
                                    pattern="\d+(\.\d{1,2})?"

                                    id="wardno"
                                    required
                                    autocomplete="given-name"
                                    class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        updateFormParams({ ...formParams, wardno: e.target.value })
                                    }
                                    value={formParams.wardno}
                                ></input>
                            </div>
                        </div>
                        <div>
                            <label
                                for="blockno"
                                class="block text-sm font-semibold leading-6 text-gray-900"
                            >
                                Block No.
                            </label>
                            <div class="mt-2">
                                <input
                                    type="number"
                                    name="blockno"
                                    pattern="\d+(\.\d{1,2})?"

                                    id="blockno"
                                    required
                                    autocomplete="family-name"
                                    class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    onChange={(e) =>
                                        updateFormParams({
                                            ...formParams,
                                            blockno: e.target.value,
                                        })
                                    }
                                    value={formParams.blockno}
                                ></input>
                            </div>
                        </div>

                        <div>
                            <label
                                for="eth-price"
                                class="block text-sm font-semibold leading-6 text-gray-900"
                                htmlFor="price"
                            >
                                Price (in ETH)
                            </label>
                            <div class="mt-2">
                                <input
                                    required
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="number"
                                    placeholder="Min 0.01 ETH"
                                    pattern="\d+(\.\d{1,2})?"
                                    step="0.01"
                                    value={formParams.price}
                                    onChange={(e) =>
                                        updateFormParams({ ...formParams, price: e.target.value })
                                    }
                                ></input>
                            </div>
                        </div>
                    </div>
                  
                    <div class="mt-5">
                        <button
                            type="submit"
                            class="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Send Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
