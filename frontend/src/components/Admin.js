import { useEffect, useState } from "react"
import { auth, db } from "../firebase"
import { getDoc, addDoc, setDoc, collection, serverTimestamp, doc } from "firebase/firestore"
import NavbarMain from "./NavbarMain"

const Admin = () => {
    const [message, setMessage] = useState("")
    const [output, setOutput] = useState()

    
        const { uid, displayName, email } = auth.currentUser

        console.log("email === ", email)

        return (
            <div className="flex flex-col place-items-center mt-10">
                <NavbarMain></NavbarMain>
            </div>
        )
    
}
export default Admin
