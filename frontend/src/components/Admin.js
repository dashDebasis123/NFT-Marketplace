/* eslint-disable */
import { useState, useEffect } from "react"
import { Card, CardBody, CardFooter, Typography, Button, Alert } from "@material-tailwind/react"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase"
import NavbarMain from "./NavbarMain"
import { useUserAuth } from "./context/UserAuthContext"
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid"

const Admin = () => {
    const [output, setOutput] = useState()
    const [status, setStatus] = useState(false)
    const { user } = useUserAuth()
    const [notify, setNotify] = useState(null)
    const [open, setOpen] = useState(true)

    const [isDisabled, setIsDisabled] = useState(false)
    useEffect(() => {
        const fetchRequests = async () => {
            console.log("1")

            console.log("email", user.email)
            const docRef = doc(db, "requests", user.email)
            console.log(docRef)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                console.log("Document: ", docSnap.data())
                setOutput(docSnap.data())
                console.log("output: ", output)
                if (docSnap.data().status === "accepted" || docSnap.data().status === "rejected") {
                    console.log("success")
                    setIsDisabled(true)
                }
            } else {
                console.log("fetch request error!!!")
            }
        }
        if (user) fetchRequests()
    }, [user])

    const changeStatus = async (newStatus) => {
        await setDoc(doc(db, "requests", user.email), {
            ...output,
            status: newStatus,
            time: serverTimestamp(),
        })

        setNotify(`You have ${newStatus}`)
    }

    const onAcceptClick = (e) => {
        // setStatus("accepted");
        changeStatus("accepted")
        setIsDisabled(true)
    }

    const onRejectClick = (e) => {
        // setStatus("rejected");
        setIsDisabled(true)
        changeStatus("rejected")
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
                                <h1 className="text-xl text-black">User: {user.email}</h1>
                                <h1 className="text-xl text-black">
                                    Wallet Address: {output.address}
                                </h1>
                                <h1 className="text-xl text-black">Price: {output.price}</h1>
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
                            <Button color="purple" onClick={onAcceptClick} disabled={isDisabled}>
                                Accept
                            </Button>

                            <Button color="purple" onClick={onRejectClick} disabled={isDisabled}>
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
        </div>
    )
}
export default Admin
