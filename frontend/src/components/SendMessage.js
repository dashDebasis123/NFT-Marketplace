import { useState } from 'react';
import { auth, db } from '../firebase';
import { addDoc, setDoc, collection, serverTimestamp, doc } from 'firebase/firestore';

const SendMessage = () => {
    const [message, setMessage] = useState('');

    const sendMessage = async (event) => {
        event.preventDefault();

        if (message.trim() === '') {
            alert('enter valid message');
            return;
        }
        const { uid, displayName } = auth.currentUser;
        console.log(uid)
        console.log(displayName)
        console.log(message)
        await setDoc(doc(db, 'messages','test32'), {
            text: message,
            name: displayName,
            createdAt: serverTimestamp(),
            uid,
        });
        setMessage('');
    };

    return (
        <form onSubmit={(event) => sendMessage(event)} className="send-message">
            <input
                id="messageInput"
                name="messageInput"
                type="text"
                className="form-input__input"
                placeholder="type message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />

            <button type="submit">Send</button>
        </form>
    );
};

export default SendMessage;
