import { useEffect, useState } from "react"
import { auth, db } from "../firebase"
import { onAuthStateChanged } from "firebase/auth"
import { getDoc, setDoc, serverTimestamp, doc } from "firebase/firestore"
import { useUserAuth } from "./context/UserAuthContext"
import NavbarMain from "./NavbarMain"

const Admin = () => {
    const [output, setOutput] = useState()
    const [status, setStatus] = useState("")
    // const [user, setUser] = useState()
    const { user } = useUserAuth();
   

    useEffect(() => {
        // const {email, uid} = auth.currentUser;
        // setEmail(auth.currentUser);
        const fetchRequests = async () => {
            console.log("1")

            // const { uid, displayName } = auth.currentUser
            // console.log(uid);
            // console.log("TSSSSSSSSS", serverTimestamp());
            console.log("email", user.email)
            const docRef = doc(db, "requests", user.email)
            console.log(docRef)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                console.log("Document: ", docSnap.data())
                setOutput(docSnap.data())
                console.log("output: ", output)
            } else {
                console.log("error")
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
    }

    const onAcceptClick = (e) => {
        // setStatus("accepted");
        changeStatus("accepted")
    }

    const onRejectClick = (e) => {
        // setStatus("rejected");
        changeStatus("rejected")
    }

    return (
        <div className="flex flex-col place-items-center mt-10">
            <NavbarMain></NavbarMain>
            <h1>Sairam</h1>

            <div className="flex-col justify-center px-6 py-14 lg:px-8">
                <strong className="text-xl">{output ? output.address : ""}</strong>
                <p className="display-inline">{output ? output.status : ""}</p>
                <p className="display-inline">
                    {output ? Date(output.time.seconds).toString() : ""}
                </p>
                <p className="display-inline">{output ? output.url : ""}</p>
                <div>
                    <button
                        onClick={() => {
                            onAcceptClick()
                        }}
                    >
                        accept
                    </button>
                </div>
                <div>
                    <button
                        onClick={() => {
                            onRejectClick()
                        }}
                    >
                        reject
                    </button>
                </div>
            </div>
        </div>
    )
}
export default Admin
