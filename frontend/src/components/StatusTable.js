import { db } from "../firebase"
import { doc, getDoc, deleteDoc } from "firebase/firestore"
import NavbarMain from "./NavbarMain"
import {
    Spinner,
    Card,
    CardBody,
    CardFooter,
    Typography,
    Button,
    CardHeader,
} from "@material-tailwind/react"
import Marketplace from "../Marketplace.json"

import { useUserAuth } from "./context/UserAuthContext"

import { useEffect, useState } from "react"
const StatusTable = () => {
    const { user } = useUserAuth()
    const [data, setData] = useState()
    const ethers = require("ethers")
    const [spinner, setSpinner] = useState(false)
    const [message, updateMessage] = useState("")

    useEffect(() => {
        const fetchRequests = async () => {
            console.log("1")
            console.log("email", user.email)
            const docRef = doc(db, "requests", user.email)
            console.log(docRef)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                console.log("Document: ", docSnap.data())
                setData(docSnap.data())
                console.log("data: ", data)
            } else {
                console.log("error")
            }
        }
        if (user) fetchRequests()
    }, [user])

    async function listNFT() {
        console.log("11")
        const url = data.url
        const userPrice = data.price
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        setSpinner(true)
        updateMessage("Uploading NFT(takes 5 mins).. please dont click anything!")

        //Pull the deployed contract instance
        let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer)

        //message the params to be sent to the create NFT request
        const price = ethers.utils.parseUnits(userPrice, "ether")
        let listingPrice = await contract.getListPrice()
        listingPrice = listingPrice.toString()

        //actually create the NFT
        let transaction = await contract.createToken(url, price, {
            value: listingPrice,
        })
        await transaction.wait()

        alert("Successfully listed your NFT!")

        setSpinner(false)

        window.location.replace("/marketplace")
    }

    return (
        <div>
            <NavbarMain />
            <Card className="flex  p-4 md:m-20 ">
                <Typography
                    variant="h5"
                    color="blue-gray"
                    className="text-3xl text-center underline decoration-2 mt-4"
                >
                    Registraion Status
                </Typography>

                <CardBody>
                    <Typography>
                        <h1 className="text-xl text-black">User: {user ? user.email : ""}</h1>
                        <h1 className="text-xl text-black">
                            {" "}
                            Wallet Address: {data ? data.address : ""}
                        </h1>
                        <h1 className="text-xl text-black">Price: {data ? data.price : ""}</h1>
                        <h1 className="text-xl text-black">Status: {data ? data.status : ""}</h1>

                        <h1 className="text-xl brek-words text-black">
                            Url: {data ? data.url : ""}
                        </h1>
                    </Typography>
                </CardBody>
                <CardFooter className="pt-0">
                    <Button>Read More</Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default StatusTable
