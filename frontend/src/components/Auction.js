import NavbarMain from "./NavbarMain";
import {
    Card,
    Button,
    Typography,
    CardHeader,
    CardBody,
    CardFooter,
    Input,
} from "@material-tailwind/react";
import { useEthers } from "@usedapp/core";
import englishAuction from "../englishAuction.json";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Marketplace from "../Marketplace.json";
const Auction = () => {
    const navigate = useNavigate();
    console.log("Auction Page");
    const { account } = useEthers();
    const ethers = require("ethers");
    const [tokenId, setTokenId] = useState(0);
    const [nftAddress, setNftAddress] = useState("");
    const [bidValue, setBidValue] = useState(0);
    const [highestBid, setHighestBid ] = useState();
    const [status,setBidStatus] = useState(false);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(
        englishAuction.address,
        englishAuction.abi,
        signer,
    );

    let nftContract = new ethers.Contract(
        Marketplace.address,
        Marketplace.abi,
        signer,
    );
    // let owner
    // let bid

    useEffect(() => {
        console.log("inside use effect");
        const fetchBidDetails = async () => {
            // contract
            //     .highestBid()
            //     .then((bid) => {
            //         console.log("highest:", bid)
            //     })
            //     .catch((error) => {
            //         console.error("Error fetching highest bid:", error)
            //     })
            let highestBid = await contract.highestBid();
            highestBid = ethers.utils.formatUnits(highestBid.toString(),"ether");
            console.log("highest bid:", highestBid);
            setHighestBid(highestBid);

            let bidStatus = await contract.auctionStatus();
            bidStatus = bidStatus.toString();
            console.log("status:", bidStatus);
            setBidStatus(bidStatus);
        };

        if (account) fetchBidDetails();
    }, [bidValue, account]);

   

    async function startAuction() {
        // e.preventDefault();

        try {
            console.log("Token ID:", tokenId);

            // Add your logic for starting the auction here
        } catch (error) {
            console.error("Error fetching data from the contract:", error);
        }

        console.log(nftAddress, tokenId);

        
        let start = contract.start(
            nftAddress,
            tokenId,
           
        );
        await start.wait();

        alert("successfully started the auction");
    }

    async function endAuction() {

        let tx = await nftContract.setApprovalForAll(
            englishAuction.address,
            true,
        );
        await tx.wait();
        let endAuction = contract.end()
        await endAuction.wait()
        alert("successfully ended the auction")
        navigate("/marketplace")
    }

    async function bidAuction() {
        const bidAmount = ethers.utils.parseEther(bidValue.toString())
        let bidTransaction = await  contract.bid({ value: bidAmount })
        await bidTransaction.wait()
        alert("successfully bid the auction")
    }

    async function withdrawAmount() {
        const withdrawRequest = contract.withdraw()
        await withdrawRequest.wait()
        alert("successfully withdraw the bid amount ")
    }

    const onNftAddress = ({ target }) => setNftAddress(target.value);
    const onTokenId = ({ target }) => setTokenId(target.value);
    const onBidValue = ({ target }) => setBidValue(target.value);

    return (
        <div class="flex flex-col items-center justify-center ">
            <NavbarMain />

            <Card className="flex flex-col w-1/3  text-blue-gray-900 mt-36 p-8 ">
                <CardHeader className="place-self-center ">
                    <Typography variant="h5" color="red">
                        Auction
                    </Typography>
                </CardHeader>

                <CardBody className="flex flex-col space-y-4">
                    <Input
                        required
                        label="NFT Address"
                        type="text"
                        value={nftAddress}
                        onChange={onNftAddress}
                        className="space-y-2"
                    />
                    <Input
                        required
                        label="Token ID"
                        type="number"
                        value={tokenId}
                        onChange={onTokenId}
                    />
                    <Button color="purple" onClick={startAuction}>
                        Start
                    </Button>
                    <Input
                        required
                        type="number"
                        value={bidValue}
                        step="0.01"
                        onChange={onBidValue}
                    />
                    <Button color="purple" onClick={bidAuction}>
                        Bid
                    </Button>
                
                <Button className="mt-2" color="purple" onClick={endAuction}>
                    End
                </Button>

                    <Button className="mt-2" color="purple" onClick={withdrawAmount}>
                    Withdraw
                </Button>

                {/* <Typography variant="h3">contract owner = {owner}</Typography> */}

                <Typography variant="h3">current highest bid = {highestBid} ETH</Typography>

                    <Typography variant="h3" className="truncate" >current player = {account}</Typography>
                    <Typography variant="h3" className="truncate" >Bid Status = {status}</Typography>

                </CardBody>
            </Card>
        </div>
    );
};

export default Auction;
