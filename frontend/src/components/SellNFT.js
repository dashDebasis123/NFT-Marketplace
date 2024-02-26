import NavbarMain from "./NavbarMain"
import { useState } from "react"
import { uploadJSONToIPFS } from "../pinata"
import Marketplace from "../Marketplace.json"
import { Spinner } from "@material-tailwind/react"
// import { useLocation } from "react-router"

export default function SellNFT() {
    const [formParams, updateFormParams] = useState({
        address: "",
        mandal: "",
        district: "",
        wardno: "",
        blockno: "",
        price: "",
    })

    const [spinner, setSpinner] = useState(false)

    // const [fileURL, setFileURL] = useState(null)
    const ethers = require("ethers")
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
    async function sendRequest(ipfsurl) {
        
    }
    async function listNFT(e) {
        e.preventDefault()

        //Upload data to IPFS
        try {
            const metadataURL = await uploadMetadataToIPFS()
            if (metadataURL === -1) {
                // Set the spinner state to false in case of an error
                setSpinner(false)
                return
            }
            //After adding your Hardhat network to your metamask, this code will get providers and signers
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            // disablespinner()

            setSpinner(true)
            updateMessage("Uploading NFT(takes 5 mins).. please dont click anything!")

            //Pull the deployed contract instance
            let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer)

            //message the params to be sent to the create NFT request
            const price = ethers.utils.parseUnits(formParams.price, "ether")
            let listingPrice = await contract.getListPrice()
            listingPrice = listingPrice.toString()

            //actually create the NFT
            let transaction = await contract.createToken(metadataURL, price, {
                value: listingPrice,
            })
            await transaction.wait()

            alert("Successfully listed your NFT!")
            // enablespinner()

            updateMessage("")
            updateFormParams({
                address: "",
                mandal: "",
                district: "",
                wardno: "",
                blockno: "",
                price: "",
            })
            setSpinner(false)

            window.location.replace("/marketplace")
        } catch (e) {
            alert("Upload error" + e)
            setSpinner(false)
        }
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
                        Enter the details of the land{" "}
                    </p>
                </div>
                <form class="mx-auto mt-16 max-w-xl sm:mt-6">
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
                                    type="text"
                                    name="wardno"
                                    id="wardno"
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
                                    type="text"
                                    name="blockno"
                                    id="blockno"
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
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="number"
                                    placeholder="Min 0.01 ETH"
                                    step="0.01"
                                    value={formParams.price}
                                    onChange={(e) =>
                                        updateFormParams({ ...formParams, price: e.target.value })
                                    }
                                ></input>
                            </div>
                        </div>
                    </div>

                    <div className="text-red-500 text-center">{message}</div>
                    <div class="mt-10">
                        <button
                            class="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            id="list-spinner"
                            onClick={listNFT}
                        >
                            {spinner ? <Spinner /> : "Send Request"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
