import Navbar from "./Navbar"
import { useState } from "react"
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata"
import Marketplace from "../Marketplace.json"
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

    // const [fileURL, setFileURL] = useState(null)
    const ethers = require("ethers")
    const [message, updateMessage] = useState("")
    // const location = useLocation()

    async function disableButton() {
        const listButton = document.getElementById("list-button")
        listButton.disabled = true
        listButton.style.backgroundColor = "grey"
        listButton.style.opacity = 0.3
    }

    async function enableButton() {
        const listButton = document.getElementById("list-button")
        listButton.disabled = false
        listButton.style.backgroundColor = "#A500FF"
        listButton.style.opacity = 1
    }

    //This function uploads the NFT image to IPFS
    // async function OnChangeFile(e) {
    //     var file = e.target.files[0]
    //     //check for file extension
    //     try {
    //         //upload the file to IPFS
    //         disableButton()
    //         updateMessage("Uploading image.. please dont click anything!")
    //         const response = await uploadFileToIPFS(file)
    //         if (response.success === true) {
    //             enableButton()
    //             updateMessage("")
    //             console.log("Uploaded image to Pinata: ", response.pinataURL)
    //             setFileURL(response.pinataURL)
    //         }
    //     } catch (e) {
    //         console.log("Error during file upload", e)
    //     }
    // }

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

    async function listNFT(e) {
        e.preventDefault()

        //Upload data to IPFS
        try {
            const metadataURL = await uploadMetadataToIPFS()
            if (metadataURL === -1) return
            //After adding your Hardhat network to your metamask, this code will get providers and signers
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            disableButton()
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
            enableButton()
            updateMessage("")
            updateFormParams({ name: "", description: "", price: "" })
            window.location.replace("/marketplace")
        } catch (e) {
            alert("Upload error" + e)
        }
    }

    console.log("Working", process.env)
    return (
        // <div className="">
        //   <Navbar></Navbar>
        //   <div className="flex flex-col place-items-center mt-10" id="nftForm">
        //     <form className="bg-white shadow-md rounded px-8 pt-4 pb-8 mb-4">
        //       <h3 className="text-center font-bold text-purple-500 mb-8">
        //         Upload your NFT to the marketplace
        //       </h3>
        //       <div className="mb-4">
        //         <label
        //           className="block text-purple-500 text-sm font-bold mb-2"
        //           htmlFor="name"
        //         >
        //           NFT Name
        //         </label>
        //         <input
        //           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        //           id="name"
        //           type="text"
        //           placeholder="Axie#4563"
        //           onChange={(e) =>
        //             updateFormParams({ ...formParams, name: e.target.value })
        //           }
        //           value={formParams.name}
        //         ></input>
        //       </div>
        //       <div className="mb-6">
        //         <label
        //           className="block text-purple-500 text-sm font-bold mb-2"
        //           htmlFor="description"
        //         >
        //           NFT Description
        //         </label>
        //         <textarea
        //           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        //           cols="40"
        //           rows="5"
        //           id="description"
        //           type="text"
        //           placeholder="Axie Infinity Collection"
        //           value={formParams.description}
        //           onChange={(e) =>
        //             updateFormParams({ ...formParams, description: e.target.value })
        //           }
        //         ></textarea>
        //       </div>
        //       <div className="mb-6">
        //         <label
        //           className="block text-purple-500 text-sm font-bold mb-2"
        //           htmlFor="price"
        //         >
        //           Price (in ETH)
        //         </label>
        //         <input
        //           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        //           type="number"
        //           placeholder="Min 0.01 ETH"
        //           step="0.01"
        //           value={formParams.price}
        //           onChange={(e) =>
        //             updateFormParams({ ...formParams, price: e.target.value })
        //           }
        //         ></input>
        //       </div>
        //       <div>
        //         <label
        //           className="block text-purple-500 text-sm font-bold mb-2"
        //           htmlFor="image"
        //         >
        //           Upload Image (&lt;500 KB)
        //         </label>
        //         <input type={'file'} onChange={OnChangeFile}></input>
        //       </div>
        //       <br></br>
        //       <div className="text-red-500 text-center">{message}</div>
        //       <button
        //         onClick={listNFT}
        //         className="font-bold mt-10 w-full bg-purple-500 text-white rounded p-2 shadow-lg"
        //         id="list-button"
        //       >
        //         List NFT
        //       </button>
        //     </form>
        //   </div>
        // </div>
        <div class=" flex-col justify-center px-6 py-14 lg:px-8">
            {/* <div class="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]" aria-hidden="true">
        <div class="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" ></div>
      </div> */}
            <div class="mx-auto max-w-2xl text-center">
                <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Land Details
                </h2>
                <p class="mt-2 text-lg leading-8 text-gray-600">Enter the details of the land </p>
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
                                    updateFormParams({ ...formParams, address: e.target.value })
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
                                    updateFormParams({ ...formParams, district: e.target.value })
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
                                    updateFormParams({ ...formParams, blockno: e.target.value })
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
                        id="list-button"
                        onClick={listNFT}
                    >
                        Send request
                    </button>
                </div>
            </form>
        </div>
    )
}
