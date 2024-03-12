import NavbarMain from "./NavbarMain";
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Typography,
    Button,
    Input,
} from "@material-tailwind/react";
import raffleJson from "../Marketplace.json";

import { useState, useEffect } from "react";

const Lottery = () => {
    const ethers = require("ethers");
    const [tickets, setTickets] = useState();
    const [status, setStatus] = useState(false);
    const [nftId, setNftId] = useState(0);
    const [totalPlayers, setTotalPlayers] = useState();
    const [ticketPrice, setTtickePrice] = useState();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(
        raffleJson.address,
        raffleJson.abi,
        signer,
    );

    const totalTicketCost = parseFloat(ticketPrice) * tickets;
    console.log("totalTicketCost: ", totalTicketCost);
    useEffect(() => {
        async function getStatus() {
            try {
                const raffleStatus = await contract.raffleStatus();
                console.log("status", raffleStatus);
                setStatus(raffleStatus);

                let id = await contract.nftId();
                id = id.toString();
                console.log("id: ", id);
                setNftId(id);

                let players = await contract.getPlayers();
                players = players.length;
                console.log("players: ", players);
                setTotalPlayers(players);

                let price = await contract.entryCost();
                price = ethers.utils.formatUnits(price.toString(), "ether");
                setTtickePrice(price);
                console.log("price: ", price);
            } catch (error) {
                console.error("Error fetching contract data:", error);
            }
        }
        console.log("Before getStatus");

        getStatus();
        console.log("After getStatus");
    }, [tickets, status, nftId, ticketPrice]);

    async function buyTicket() {
        console.log(tickets);
        let ticket = await contract.buyEntry(tickets, {
            value: ethers.utils.parseEther(totalTicketCost.toString()),
        });
        await ticket.wait();
        alert("bought ticket");
    }
    const onNftTickets = ({ target }) => setTickets(target.value);

    return (
        <div>
            <NavbarMain />
            <Card className="box-border h-fit w-80 p-4 border-4  flex-col mx-auto items-center justify-between text-blue-gray-900 mt-36">
                <CardHeader>
                    <Typography variant="h4">Lottery </Typography>
                </CardHeader>
                <CardBody>
                    <Typography variant="h5">Token ID: {nftId}</Typography>
                    <Typography variant="h5">
                        Lottery Status : {status.toString()}
                    </Typography>
                    <Typography variant="h5">
                        Ticket Price : {ticketPrice} ETH
                    </Typography>

                    <Typography variant="h5">
                        Total Players : {totalPlayers}
                    </Typography>

                    <Input
                        min="1"
                        type="number"
                        label="Tickets"
                        value={tickets}
                        onChange={onNftTickets}
                    />
                </CardBody>
                <CardFooter>
                    <Button
                        color={nftId ? "purple" : "blue-gray"}
                        onClick={buyTicket}
                        disabled={!nftId || !status}
                    >
                        Buy Ticket
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Lottery;
