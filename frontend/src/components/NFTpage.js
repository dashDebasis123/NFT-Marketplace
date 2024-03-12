import NavbarMain from "./NavbarMain";

import { useParams } from "react-router-dom";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import { GetIpfsUrlFromPinata } from "../utils";
import {
    Card,
    CardBody,
    CardFooter,
    Typography,
    Button,
} from "@material-tailwind/react";
import { useEthers } from "@usedapp/core";
export default function NFTPage(props) {
    console.log("inside nft page");
    const { account } = useEthers();
    const [data, updateData] = useState({});
    const [dataFetched, updateDataFetched] = useState(false);
    const [message, updateMessage] = useState("");
    const [disableButton, setDisabled] = useState(false);
    const [currAddress, updateCurrAddress] = useState("0x");
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers

    async function getNFTData(tokenId) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();
        //Pull the deployed contract instance
        let contract = new ethers.Contract(
            MarketplaceJSON.address,
            MarketplaceJSON.abi,
            signer,
        );
        //create an NFT Token
        var tokenURI = await contract.tokenURI(tokenId);
        const listedToken = await contract.getListedTokenForId(tokenId);
        tokenURI = GetIpfsUrlFromPinata(tokenURI);
        let meta = await axios.get(tokenURI);
        meta = meta.data;
        console.log(listedToken);

        let item = {
            price: meta.price,
            tokenId: tokenId,
            seller: listedToken.seller,
            owner: listedToken.owner,
            address: meta.address,
            mandal: meta.mandal,
            district: meta.district,
            wardno: meta.wardno,
            blockno: meta.blockno,
        };
        if (
            listedToken.owner ===
                "0x0000000000000000000000000000000000000000" ||
            listedToken.seller === "0x00000000000000000000000000000000"
        ) {
            setDisabled(true);
        }
        updateData(item);

        updateDataFetched(true);

        updateCurrAddress(addr);
    }

    async function buyNFT(tokenId) {
        try {
            const ethers = require("ethers");
            //After adding your Hardhat network to your metamask, this code will get providers and signers
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            //Pull the deployed contract instance
            let contract = new ethers.Contract(
                MarketplaceJSON.address,
                MarketplaceJSON.abi,
                signer,
            );
            const salePrice = ethers.utils.parseUnits(data.price, "ether");
            updateMessage("Buying the NFT... Please Wait (Upto 5 mins)");
            //run the executeSale function
            let transaction = await contract.executeSale(tokenId, {
                value: salePrice,
            });
            await transaction.wait();

            alert("You successfully bought the NFT!");
            updateMessage("");
        } catch (e) {
            alert("Upload Error" + e);
        }
    }

    const params = useParams();
    const tokenId = params.tokenId;
    if (!dataFetched) getNFTData(tokenId);

    async function listNFT(tokenId, price) {
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        //Pull the deployed contract instance
        let contract = new ethers.Contract(
            MarketplaceJSON.address,
            MarketplaceJSON.abi,
            signer,
        );
        // setSpinner(true)
        updateMessage(
            "Uploading NFT(takes 5 mins).. please dont click anything!",
        );

        //Pull the deployed contract instance

        //message the params to be sent to the create NFT request
        const tokenPrice = ethers.utils.parseUnits(price, "ether");
        let listingPrice = await contract.getListPrice();
        listingPrice = listingPrice.toString();

        //actually create the NFT
        let transaction = await contract.createListedToken(
            tokenId,
            tokenPrice,
            {
                value: listingPrice,
            },
        );
        await transaction.wait();
        updateMessage("");
        setDisabled(false);
        alert("Successfully listed your NFT!");

        // setSpinner(false)

        window.location.replace("/marketplace");
    }

    async function cancelListing(tokenId) {
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        updateMessage(`token id = ${tokenId} is getting canceled, please wait`);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        //Pull the deployed contract instance
        let contract = new ethers.Contract(
            MarketplaceJSON.address,
            MarketplaceJSON.abi,
            signer,
        );
        let transaction = await contract.cancelListing(tokenId);
        await transaction.wait();

        updateMessage("");
        alert("success");

        window.location.replace("/profile");
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
                    Token ID: {data.tokenId}
                </Typography>

                <CardBody>
                    <Typography>
                        {data && account ? (
                            <div>
                                <h1 className="text-xl text-black">
                                    Address: {data.address}
                                </h1>
                                <h1 className="text-xl text-black">
                                    Mandal: {data.mandal}
                                </h1>
                                <h1 className="text-xl break-words text-black">
                                    District : {data.district}
                                </h1>
                                <h1 className="text-xl break-words text-black">
                                    Ward No : {data.wardno}
                                </h1>
                                <h1 className="text-xl break-words text-black">
                                    Block No: {data.blockno}
                                </h1>

                                <h1 className="text-xl break-words text-black">
                                    Price: {data.price + " ETH"}
                                </h1>
                                <h1 className="text-xl break-words text-black">
                                    Owner :
                                    {disableButton ? account : data.owner}
                                </h1>
                                <h1 className="text-xl break-words text-black">
                                    Seller:{" "}
                                    {disableButton ? account : data.seller}
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

                    {currAddress !== data.owner &&
                    currAddress !== data.seller &&
                    !disableButton ? (
                        <Button color="purple" onClick={() => buyNFT(tokenId)}>
                            Buy NFT
                        </Button>
                    ) : disableButton ? (
                        <>
                            <Typography variant="h3">
                                You are the owner of this NFT
                            </Typography>
                            <Button
                                color="purple"
                                onClick={() =>
                                    listNFT(data.tokenId, data.price)
                                }
                            >
                                List NFT
                            </Button>
                        </>
                    ) : (
                        <Button
                            color="purple"
                            onClick={() => cancelListing(tokenId)}
                        >
                            Cancel Listing
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
