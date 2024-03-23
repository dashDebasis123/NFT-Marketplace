// import axie from "../tile.jpeg";
import { Link } from "react-router-dom";
import { useState } from "react";
// import { GetIpfsUrlFromPinata } from "../utils"
import {
    Button,
    Dialog,
    Card,
    CardBody,
    CardFooter,
    Typography,
    Input,
    Checkbox,
} from "@material-tailwind/react";
import MarketplaceJSON from "../Marketplace.json";
function NFTTile(data) {
    const newTo = {
        pathname: "/nftPage/" + data.data.tokenId,
    };
    const ethers = require("ethers");
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen((cur) => !cur);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(
        MarketplaceJSON.address,
        MarketplaceJSON.abi,
        signer,
    );

    

    return (
        <Card className="mt-6 w-96">
            <CardBody className="items-center">
                <Typography variant="h5" color="blue-gray" className="mb-2">
                    {data.data.tokenId}
                </Typography>
                <Typography>{data.data.address}</Typography>
                <Typography>{data.data.mandal}</Typography>
                <Typography>{data.data.district}</Typography>
                <Typography>{data.data.wardno}</Typography>
                <Typography>{data.data.blockno}</Typography>
                <Typography>{data.data.price} ETH</Typography>
            </CardBody>
            <Link to={newTo}>
                <CardFooter className="pt-0">
                    <Button color="purple">Read More</Button>
                </CardFooter>
            </Link>

            <Button onClick={handleOpen}>Read More</Button>
            <Dialog
                size="lg"
                open={open}
                handler={handleOpen}
                className="bg-transparent shadow-none"
            >
                <Card className="mx-auto w-full max-w-[24rem]">
                    <CardBody className="flex flex-col gap-4">
                        <Typography variant="h3" color="blue-gray">
                            Token ID : {data.data.tokenId}
                        </Typography>
                        <Typography variant="lead">
                            Address : {data.data.address}
                        </Typography>
                        <Typography variant="lead">Mandal : {data.data.mandal}</Typography>
                        <Typography variant="lead">
                            District : {data.data.district}
                        </Typography>
                        <Typography variant="lead">Ward No. : {data.data.wardno}</Typography>
                        <Typography variant="lead">
                            Block No. : {data.data.blockno}
                        </Typography>
                        <Typography variant="lead" className="truncate">
                            Owner : {data.data.owner}
                        </Typography>
                        <Typography variant="lead" className="truncate">
                            Seller : {data.data.seller}
                        </Typography>
                        <Typography variant="h3">Price : {data.data.price} ETH</Typography>

                    </CardBody>
                    <CardFooter className="pt-0">
                        <Button
                            variant="gradient"
                            onClick={handleOpen}
                            
                        >
                            List NFT
                        </Button>
                    </CardFooter>
                </Card>
            </Dialog>
        </Card>
    );
}

export default NFTTile;
