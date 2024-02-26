import NavbarMain from "./NavbarMain"
import NFTTile from "./NFTTile"
import MarketplaceJSON from "../Marketplace.json"
import axios from "axios"
import { useState } from "react"
import { GetIpfsUrlFromPinata } from "../utils"

export default function Marketplace() {
    const [data, updateData] = useState([])
    const [dataFetched, updateFetched] = useState(false)

    async function getAllNFTs() {
        const ethers = require("ethers")
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        console.log("signer : ", signer)
        //Pull the deployed contract instance
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)

        const prov = new ethers.providers.JsonRpcProvider("https://sepolia.etherscan.io")
        const transactionReceipt = await prov.getTransactionReceipt(MarketplaceJSON.address)

        // Extract the deployer address from the transaction receipt
        const deployerAddress = transactionReceipt.from
        console.log("Deployer Address:", deployerAddress)

        //create an NFT Token
        let transaction = await contract.getAllNFTs()

        //Fetch all the details of every NFT from the contract and display
        const items = await Promise.all(
            transaction.map(async (i) => {
                var tokenURI = await contract.tokenURI(i.tokenId)
                console.log("getting this tokenUri", tokenURI)
                tokenURI = GetIpfsUrlFromPinata(tokenURI)
                let meta = await axios.get(tokenURI)
                meta = meta.data

                let price = ethers.utils.formatUnits(i.price.toString(), "ether")
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
                }
                // console.log(item);
                return item
            }),
        )

        updateFetched(true)
        updateData(items)
    }

    if (!dataFetched) {
        // console.log("in datafetched", dataFetched)

        getAllNFTs()
    }

    return (
        <div>
            <NavbarMain></NavbarMain>

            <div className="flex flex-col place-items-center mt-20">
                <div className="md:text-xl font-bold text-white">Top NFTs</div>
                <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
                    {data.length !== 0
                        ? data.map((value, index) => {
                              return <NFTTile data={value} key={index}></NFTTile>
                          })
                        : "please connect to the account"}
                </div>
            </div>
        </div>
    )
}
