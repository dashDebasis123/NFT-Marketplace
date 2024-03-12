/* eslint-disable */
import { useState, useEffect } from "react";
import {
    Card,
    CardBody,
    CardFooter,
    Popover,
    PopoverHandler,
    PopoverContent,
    CardHeader,
    Typography,
    Button,
    Alert,
    Input,
} from "@material-tailwind/react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import NavbarMain from "./NavbarMain";
import { useUserAuth } from "./context/UserAuthContext";
import RaffleJson from "../Marketplace.json";

const Admin = () => {
    const [output, setOutput] = useState();
    const [status, setStatus] = useState();
    const { user } = useUserAuth();
    const [notify, setNotify] = useState(null);
    const [open, setOpen] = useState(true);
    const [id, updateId] = useState(0);
    const [isDisabled, setIsDisabled] = useState(false);
    const [tokenId, setTokenId] = useState();
    const [currentPrice, updatePrice] = useState();
    const [currentBalance, updateBalance] = useState();

    const ethers = require("ethers");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(
        RaffleJson.address,
        RaffleJson.abi,
        signer,
    );
    useEffect(() => {
        const fetchRequests = async () => {
            console.log("1");

            console.log("email", user.email);
            const docRef = doc(db, "requests", user.email);
            console.log(docRef);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("Document: ", docSnap.data());
                setOutput(docSnap.data());
                console.log("output: ", output);
                if (
                    docSnap.data().status === "accepted" ||
                    docSnap.data().status === "rejected"
                ) {
                    console.log("success");
                    setIsDisabled(true);
                }
            } else {
                console.log("fetch request error!!!");
            }
        };
        if (user) fetchRequests();
    }, [user]);

    useEffect(() => {
        async function getStatus() {
            try {
                let raffleStatus = await contract.raffleStatus();
                raffleStatus = raffleStatus.toString();
                console.log("status", status);
                setStatus(raffleStatus);

                let price = await contract.entryCost();
                price = ethers.utils.formatUnits(price.toString(), "ether");
                updatePrice(price);
                console.log("ticket price: ", price);

                let balance = await contract.getBalance();
                balance = ethers.utils.formatUnits(balance.toString(), "ether");
                updateBalance(balance);
                console.log("Admin balance: ", balance);

                let id = await contract.nftId();
                id = id.toString();
                updateId(id);
                console.log("id: ", id);
            } catch (error) {
                console.error("Error fetching contract data:", error);
            }
        }
        console.log("Before getStatus");

        getStatus();
        console.log("After getStatus");
    }, [status, currentPrice, currentBalance]);

    const changeStatus = async (newStatus) => {
        await setDoc(doc(db, "requests", user.email), {
            ...output,
            status: newStatus,
            time: serverTimestamp(),
        });

        setNotify(`You have ${newStatus}`);
    };

    const onAcceptClick = (e) => {
        // setStatus("accepted");
        changeStatus("accepted");
        setIsDisabled(true);
    };

    const onRejectClick = (e) => {
        // setStatus("rejected");
        setIsDisabled(true);
        changeStatus("rejected");
    };

    const onTokenID = ({ target }) => setTokenId(target.value);

    async function startRaffle(tokenid) {
        let raffle = await contract.startRaffle(tokenid);
        await raffle.wait();
        setNotify("Raffle has started");
    }
    async function endRaffle() {
        let raffle = await contract.endRaffle();
        await raffle.wait();
        setNotify("Raffle has ended");
    }

    async function raffleWinner() {
        let winner = await contract.selectWinner();
        await winner.wait();
        setNotify("Winner has been selected");
    }

    async function resetLottery() {
        let balance = await contract.resestContracts();
        await balance.wait();
        setNotify("Balance has been withdrawn");
    }

    async function updateTicketPrice() {
        let ticketPrice = await contract.changeEntryCost(currentPrice);
        await ticketPrice.wait();
        setNotify("Ticket price has been updated");
    }

    return (
        <div>
            <NavbarMain />

            {notify && (
                <Alert open={open} onClose={() => setOpen(false)}>
                    {notify}
                </Alert>
            )}

            <Card className="flex p-4 md:m-20 ">
                <Typography
                    variant="h5"
                    color="blue-gray"
                    className="text-3xl text-center underline decoration-2 mt-4"
                >
                    Registraion Status
                </Typography>

                <CardBody>
                    <Typography>
                        {user && output ? (
                            <div>
                                <h1 className="text-xl text-black">
                                    User: {user.email}
                                </h1>
                                <h1 className="text-xl text-black">
                                    Wallet Address: {output.address}
                                </h1>
                                <h1 className="text-xl text-black">
                                    Price: {output.price}
                                </h1>
                                <h1 className="capitalize text-xl text-black">
                                    Status: {output.status}
                                </h1>
                                <h1 className="text-xl break-words text-black">
                                    Url: {output.url}
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
                    {user && output ? (
                        <div className="flex space-x-3 ">
                            <Button
                                color="purple"
                                onClick={onAcceptClick}
                                disabled={isDisabled}
                            >
                                Accept
                            </Button>

                            <Button
                                color="purple"
                                onClick={onRejectClick}
                                disabled={isDisabled}
                            >
                                Reject
                            </Button>
                        </div>
                    ) : (
                        <div className="flex space-x-3 ">
                            <Button loading={true}>Accept</Button>

                            <Button loading={true}>Reject</Button>
                        </div>
                    )}
                </CardFooter>
            </Card>

            <Card className="box-border h-fit w-fit p-4 border-4  flex-col mx-auto items-center justify-between text-blue-gray-900 mt-16">
                <CardHeader>
                    <Typography variant="h4">Lottery</Typography>
                </CardHeader>
                <CardBody>
                    <Typography variant="h5">
                        Lottery Status: {status}
                    </Typography>

                    <Typography variant="h5">Enter NFT details</Typography>

                    <div className="">
                        <Input
                            required
                            type="number"
                            label="Token ID"
                            value={tokenId}
                            onChange={onTokenID}
                            className="pr-20 space-y-4 "
                        />
                    </div>
                </CardBody>
                <CardFooter className="col-4 space-x-2">
                    {status ? (
                        <Button
                            color={tokenId ? "purple" : "blue-gray"}
                            disabled={!tokenId}
                            onClick={() => startRaffle(tokenId)}
                        >
                            Start
                        </Button>
                    ) : (
                        <Button
                            color={status ? "purple" : "blue-gray"}
                            onClick={endRaffle}
                            disabled={!status}
                        >
                            End
                        </Button>
                    )}

                    <Button
                        color={!status ? "purple" : "blue-gray"}
                        onClick={raffleWinner}
                        disabled={status}
                    >
                        winner
                    </Button>

                    <Button
                        color={id !== "0" ? "purple" : "blue-gray"}
                        onClick={resetLottery}
                        disabled={id == "0"}
                    >
                        Reset
                    </Button>
                    <Popover placement="bottom">
                        <PopoverHandler>
                            <Button
                                color={
                                    status == "false" ? "purple" : "blue-gray"
                                }
                                disabled={status == "true"}
                            >
                                Update Price
                            </Button>
                        </PopoverHandler>
                        <PopoverContent className="w-96">
                            <Typography
                                variant="h6"
                                color="blue-gray"
                                className="mb-6"
                            >
                                Current Ticket Price = {currentPrice} ETH
                            </Typography>
                            <Typography
                                variant="h6"
                                color="blue-gray"
                                className="mb-6"
                            >
                                Update the Ticket Price
                            </Typography>

                            <div className="flex gap-2">
                                <Input
                                    size="lg"
                                    placeholder="Ethers"
                                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                    labelProps={{
                                        className:
                                            "before:content-none after:content-none",
                                    }}
                                    onChange={updatePrice}
                                />
                                <Button
                                    color="purple"
                                    variant="gradient"
                                    className="flex-shrink-0"
                                    onClick={updateTicketPrice}
                                >
                                    Update
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </CardFooter>
            </Card>
        </div>
    );
};
export default Admin;
