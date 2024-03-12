import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import NavbarMain from "./NavbarMain";
import {
    Card,
    CardBody,
    CardFooter,
    Typography,
    Button,
} from "@material-tailwind/react";
import Marketplace from "../Marketplace.json";

import { useUserAuth } from "./context/UserAuthContext";

import { useEffect, useState } from "react";
const StatusTable = () => {
    const { user } = useUserAuth();
    const [data, setData] = useState();
    const ethers = require("ethers");
    const [spinner, setSpinner] = useState(false);
    const [message, updateMessage] = useState("");
    const [isDisabled, setIsDisabled] = useState(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    let contract = new ethers.Contract(
        Marketplace.address,
        Marketplace.abi,
        signer,
    );
    let token = 0;

    const { Alchemy, Network } = require("alchemy-sdk");
    require("dotenv").config();
    const config = {
        apiKey: "rhFU6gtSqgHTwV2ImBhPCREANGrsZmma",
        network: Network.ETH_SEPOLIA,
    };
    const alchemy = new Alchemy(config);

    useEffect(() => {
        const fetchRequests = async () => {
            console.log("1");
            console.log("email", user.email);
            const docRef = doc(db, "requests", user.email);
            console.log(docRef);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("Document: ", docSnap.data());
                setData(docSnap.data());
                console.log("data: ", data);
                if (docSnap.data().status === "accepted") {
                    console.log("success");
                    setIsDisabled(false);
                    getNftsForOwner();
                }
            } else {
                console.log("error");
            }
        };
        if (user) fetchRequests();
    }, [user]);

    async function createNFT() {
        const url = data.url;
        console.log("url== ", url);
        setSpinner(true);
        updateMessage("Creating a NFT token for you, please wait...");

        const transaction = await contract.createToken(url);

        // Wait for the transaction receipt
        await transaction.wait();

        updateMessage("");

        alert("Successfully created your NFT!");

        setSpinner(false);
    }

    async function getNftsForOwner() {
        const address = "0x864b05818C8e3d894d85e839af2865351c4Df8Aa";
        const nfts = await alchemy.nft.getNftsForOwner(address);

        try {
            console.log("Getting");
            nfts.ownedNfts.forEach((nft) => {
                if (
                    nft.contract.address ===
                    "0x51105090F39651EF570608deD574D64B699dCEd5"
                ) {
                    console.log("Name:", nft.contract.name);
                    console.log("Contract Address:", nft.contract.address);
                    console.log("Token ID:", nft.tokenId);
                    console.log("Token Type:", nft.tokenType);
                    console.log("Token uri:", nft.tokenUri);

                    console.log("----------------------------------");
                }
            });
        } catch {
            console.log("error");
        }
    }

    async function listNFT() {
        await createNFT();
        console.log("token: ", token);
        const userPrice = data.price;
        //After adding your Hardhat network to your metamask, this code will get providers and signers

        setSpinner(true);
        updateMessage(
            "Uploading NFT(takes 5 mins).. please dont click anything!",
        );

        //Pull the deployed contract instance

        //message the params to be sent to the create NFT request
        const price = ethers.utils.parseUnits(userPrice, "ether");
        let listingPrice = await contract.getListPrice();
        listingPrice = listingPrice.toString();

        //actually create the NFT
        let transaction = await contract.createListedToken(token, price, {
            value: listingPrice,
        });
        await transaction.wait();
        updateMessage("");
        alert("Successfully listed your NFT!");

        setSpinner(false);

        window.location.replace("/marketplace");
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
                        {user && data ? (
                            <div>
                                <h1 className="text-xl text-black">
                                    User: {user.email}
                                </h1>
                                <h1 className="text-xl text-black">
                                    Wallet Address: {data.address}
                                </h1>
                                <h1 className="text-xl text-black">
                                    Price: {data.price}
                                </h1>
                                <h1 className="capitalize text-xl text-black">
                                    Status: {data.status}
                                </h1>
                                <h1 className="text-xl break-words text-black">
                                    Url: {data.url}
                                </h1>
                            </div>
                        ) : (
                            <div className="max-w-full animate-pulse">
                                <Typography
                                    as="div"
                                    variant="h1"
                                    className="mb-4 h-3 w-56 rounded-full bg-gray-300"
                                >
                                    &nbsp;
                                </Typography>
                                <Typography
                                    as="div"
                                    variant="paragraph"
                                    className="mb-2 h-2 w-72 rounded-full bg-gray-300"
                                >
                                    &nbsp;
                                </Typography>
                                <Typography
                                    as="div"
                                    variant="paragraph"
                                    className="mb-2 h-2 w-72 rounded-full bg-gray-300"
                                >
                                    &nbsp;
                                </Typography>
                                <Typography
                                    as="div"
                                    variant="paragraph"
                                    className="mb-2 h-2 w-72 rounded-full bg-gray-300"
                                >
                                    &nbsp;
                                </Typography>
                                <Typography
                                    as="div"
                                    variant="paragraph"
                                    className="mb-2 h-2 w-72 rounded-full bg-gray-300"
                                >
                                    &nbsp;
                                </Typography>
                            </div>
                        )}
                    </Typography>
                </CardBody>
                <CardFooter className="pt-0">
                    <h1>{message}</h1>

                    {spinner && data ? (
                        <Button variant="outlined" loading={true}>
                            Loading
                        </Button>
                    ) : (
                        <Button
                            color="purple"
                            onClick={createNFT}
                            disabled={isDisabled}
                        >
                            {isDisabled
                                ? data
                                    ? data.status
                                    : "Wait..."
                                : "Create NFT"}
                        </Button>
                    )}

                    <Button
                        color="purple"
                        onClick={listNFT}
                        disabled={isDisabled}
                    >
                        {isDisabled
                            ? data
                                ? data.status
                                : "Wait..."
                            : "List NFT"}
                    </Button>

                    {/* <Button color="purple" onClick={getNftsForOwner} disabled={isDisabled}>
                        {isDisabled ? (data ? data.status : "Wait...") : "Get NFT"}
                    </Button> */}
                </CardFooter>
            </Card>
        </div>
    );
};

export default StatusTable;
