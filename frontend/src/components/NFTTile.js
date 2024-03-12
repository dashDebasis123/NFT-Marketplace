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
function NFTTile(data) {
    const newTo = {
        pathname: "/nftPage/" + data.data.tokenId,
    };

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen((cur) => !cur);

    return (
        <Card className="mt-6 w-96">
            <CardBody>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                    {data.data.tokenId}
                </Typography>
                <Typography>{data.data.address}</Typography>
                <Typography>{data.data.mandal}</Typography>
                <Typography>{data.data.district}</Typography>
                <Typography>{data.data.wardno}</Typography>
                <Typography>{data.data.blockno}</Typography>
                <Typography>{data.data.owner}</Typography>
            </CardBody>
            <Link to={newTo}>
                <CardFooter className="pt-0">
                    <Button color="purple">Read More</Button>
                </CardFooter>
            </Link>

            <Button onClick={handleOpen}>Sign In</Button>
            <Dialog
                size="lg"
                open={open}
                handler={handleOpen}
                className="bg-transparent shadow-none"
            >
                <Card className="mx-auto w-full max-w-[24rem]">
                    <CardBody className="flex flex-col gap-4">
                        <Typography variant="h1" color="blue-gray">
                            {data.data.tokenId}
                        </Typography>
                        <Typography variant="h2">
                            {data.data.address}
                        </Typography>
                        <Typography variant="h2">{data.data.mandal}</Typography>
                        <Typography variant="h2">
                            {data.data.district}
                        </Typography>
                        <Typography variant="h2">{data.data.wardno}</Typography>
                        <Typography variant="h2">
                            {data.data.blockno}
                        </Typography>
                        <Typography className="truncate" variant="h2">
                            {data.data.seller}
                        </Typography>
                    </CardBody>
                    <CardFooter className="pt-0">
                        <Button
                            variant="gradient"
                            onClick={handleOpen}
                            fullWidth
                        >
                            Sign In
                        </Button>
                    </CardFooter>
                </Card>
            </Dialog>
        </Card>
    );
}

export default NFTTile;
