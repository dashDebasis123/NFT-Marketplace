import NavbarMain from "./NavbarMain";
import { useParams } from "react-router-dom";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState, useEffect } from "react";
import NFTTile from "./NFTTile";
import { useEthers } from "@usedapp/core";
import { Typography } from "@material-tailwind/react";

export default function Profile() {
    const [data, updateData] = useState([]);
    const [dataFetched, updateFetched] = useState(false);
    // const [address, updateAddress] = useState("0x")
    const [totalPrice, updateTotalPrice] = useState("0");
    const { account, chainId } = useEthers();
    const [accountId, updateAccount] = useState("");
    const [listedToken, setListedToken] = useState(false);
    const [tokenData, setTokenData] = useState([]);
    const ethers = require("ethers");

    const { Alchemy, Network } = require("alchemy-sdk");
    require("dotenv").config();
    const config = {
        apiKey: "bLe37Jhw-kV28mtS-JnR_OT7mpfH6fWE",
        network: Network.ETH_SEPOLIA,
    };
    const alchemy = new Alchemy(config);

    useEffect(() => {
        const fetchData = async () => {
            try {
                updateAccount(account);
                console.log(account);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (!listedToken) {
            fetchData();
        }

        if (accountId !== "") {
            getCreatedNFT();
        }
    }, [listedToken, tokenData, account, accountId]);

    // List all the nft in the NfT Marketplace of a user
    async function getNFTData(tokenId) {
        let sumPrice = 0;
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        // const addr = await signer.getAddress()

        //Pull the deployed contract instance
        let contract = new ethers.Contract(
            MarketplaceJSON.address,
            MarketplaceJSON.abi,
            signer,
        );

        //create an NFT Token
        let transaction = await contract.getMyNFTs();

        /*
         * Below function takes the metadata from tokenURI and the data returned by getMyNFTs() contract function
         * and creates an object of information that is to be displayed
         */

        const items = await Promise.all(
            transaction.map(async (i) => {
                const tokenURI = await contract.tokenURI(i.tokenId);
                let meta = await axios.get(tokenURI);
                meta = meta.data;

                let price = ethers.utils.formatUnits(
                    i.price.toString(),
                    "ether",
                );
                let item = {
                    price,
                    tokenId: i.tokenId.toNumber(),
                    seller: i.seller,
                    owner: i.owner,
                    address: meta.address,
                    mandal: meta.mandal,
                    district: meta.district,
                    wardno: meta.wardno,
                    blockno: meta.blockno,
                };
                sumPrice += Number(price);
                return item;
            }),
        );
        console.log("items", items);

        updateData(items);
        updateFetched(true);
        // updateAddress(addr)
        updateTotalPrice(sumPrice.toPrecision(3));
    }

    const params = useParams();
    const tokenId = params.tokenId;
    if (!dataFetched) getNFTData(tokenId);

    // Function for displaying the new minted tokens a user has recently
    async function getCreatedNFT() {
        // console.log("inside getCreatedNFT func");
        const nfts = await alchemy.nft.getNftsForOwner(accountId);

        console.log("account", accountId);

        let tokenList = await Promise.all(
            nfts.ownedNfts.map(async (nft) => {
                if (nft.contract.address === MarketplaceJSON.address) {
                    console.log("Name:", nft.contract.name);
                    console.log("Contract Address:", nft.contract.address);
                    console.log("Token ID:", nft.tokenId);
                    console.log("Token Type:", nft.tokenType);
                    console.log("----------------------------------");

                    let tokenUri = nft.tokenUri;
                    console.log("Token uri:", tokenUri);
                    let metadataUri = await axios.get(tokenUri);

                    metadataUri = metadataUri.data;
                    console.log("meta uri:", metadataUri);

                    let price = metadataUri.price.toString();
                    console.log("price", price);
                    let item = {
                        price,
                        tokenId: nft.tokenId,
                        owner: accountId,
                        seller: accountId,
                        address: metadataUri.address,
                        mandal: metadataUri.mandal,
                        district: metadataUri.district,
                        wardno: metadataUri.wardno,
                        blockno: metadataUri.blockno,
                    };
                    console.log("items: ", item);
                    return item;
                }
            }),
        );
        console.log("tokenlist :", tokenList);
        tokenList = tokenList.filter((item) => item !== undefined);
        console.log("tokenList ", tokenList, tokenList.length);

        setTokenData(tokenList);
        setListedToken(true);
    }

    console.log("tokenData ", tokenData);
    console.log("listedtoken = ", listedToken);

    return (
        <div >
            <NavbarMain></NavbarMain>

            <div className="flex text-center flex-col mt-11 md:text-2xl text-white">
                <div className="mb-5">
                    <h2 className="font-bold">Wallet Address</h2>
                    {account}
                    <br />
                    {/* {balance ? utils.formatEther(balance) : 0} ETH */}
                    Chain Id = {chainId}
                </div>
                <Typography variant="h3" color="white" > Wallet Address : {account}</Typography>
            </div>
            <div className="flex flex-row text-center justify-center mt-10 md:text-2xl text-white">
                <div>
                    <h2 className="font-bold">No. of NFTs</h2>
                    {data.length}
                </div>
                <div className="ml-20">
                    <h2 className="font-bold">Total Value</h2>
                    {totalPrice} ETH
                </div>
            </div>
            
            <div className="flex flex-col justify-center items-center">
                <Typography className="underline underline-offset-4" variant="h1" color="white"> Your Lsited NFTs in NFT Marketplace </Typography>


                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 gap-2 md:grid-cols-3 gap-2">

                    {data.map((value, index) => {
                        return <NFTTile data={value} key={index}></NFTTile>;
                    })}
                </div>
                <Typography variant="h3" color="white">
                    {data.length === 0
                        ? "Oops, No NFT data to display (Are you logged in?)"
                        : ""}

                    {account ? "" : "Connect to Metamask"}
                </Typography>
                {/* </div> */}
            </div>
            {/* <div className="flex flex-col text-center items-center mt-11 text-white"> */}
            {/* <h2 className="font-bold">Your Created NFTs</h2>
             */}
            <div className="flex flex-col justify-center items-center">
                <Typography className="underline underline-offset-4" variant="h1" color="white"> Recently created NFTs </Typography>


                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 gap-2 md:grid-cols-3 gap-2">

                    {tokenData.map((value, index) => {
                        return <NFTTile data={value} key={index}></NFTTile>;
                    })}
                </div>
                <Typography variant="h3" color="white">
                    {tokenData.length === 0
                        ? "Oops, No NFT data to display (Are you logged in?)"
                        : ""}

                    {account ? "" : "Connect to Metamask"}
                </Typography>
                {/* </div> */}
            </div>
        </div >
    );
}
