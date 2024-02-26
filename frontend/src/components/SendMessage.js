import { useEffect, useState } from "react"
import { auth, db } from "../firebase"
import { getDoc, addDoc, setDoc, collection, serverTimestamp, doc } from "firebase/firestore"
import NavbarMain from "./NavbarMain"
const SendMessage = () => {
    const [message, setMessage] = useState("")
    const [output, setOutput] = useState()

    const sendMessage = async (event) => {
        event.preventDefault()

        if (message.trim() === "") {
            alert("enter valid message")
            return
        }
        const { uid, displayName } = auth.currentUser
        console.log(uid)
        // console.log(displayName)
        console.log(message)
        await setDoc(doc(db, "messages", "test32"), {
            text: message,
            name: displayName,
            createdAt: serverTimestamp(),
            uid,
        })
        setMessage("")

        const docRef = doc(db, "messages", "test32")
        console.log("docref = ", docRef)
        const docSnap = await getDoc(docRef)
        console.log("Document: ", docSnap.data())

        if (docSnap.exists()) {
            let d = docSnap.data()
            console.log("Document: ", docSnap.data())
            console.log(d.uid, d.text)
        } else {
            console.log("error")
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            console.log("2")
            const docRef = doc(db, "messages", "test32")
            console.log("docref = ", docRef)
            const docSnap = await getDoc(docRef)
            console.log("Document: ", docSnap.data())

            if (docSnap.exists()) {
                console.log("Document: ", docSnap.data())
                setOutput(docSnap.data())
                console.log("output: ", output)
            } else {
                console.log("error")
            }
        }
        fetchData()
    }, [output])

    return (
        <div className="flex flex-col place-items-center mt-10">
            <NavbarMain></NavbarMain>
            <form onSubmit={(event) => sendMessage(event)} className="send-message ">
                <input
                    id="messageInput"
                    name="messageInput"
                    type="text"
                    className="form-input__input text-sm font-medium leading-6 text-gray-900"
                    placeholder="type message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />

                <button type="submit">Send</button>
            </form>

            <div>{output ? output.text : "error"}</div>
        </div>
    )
}

export default SendMessage
