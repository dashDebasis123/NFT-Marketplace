    import './App.css';
    import Navbar from './components/Navbar.js';
    import Marketplace from './components/Marketplace';
    import Profile from './components/Profile';
    import SellNFT from './components/SellNFT';
    import NFTPage from './components/NFTpage';
    import ReactDOM from "react-dom/client";
    import {
    BrowserRouter,
    Routes,
    Route,
    } from "react-router-dom";
    import { initializeApp } from "firebase/app";

    import { getAnalytics } from "firebase/analytics";
    const firebaseConfig = {

        apiKey: "AIzaSyCk-pOkpE6GLSB9d4nd5QZWOXiwBoJutrw",

        authDomain: "land-registry-ec940.firebaseapp.com",

        projectId: "land-registry-ec940",

        storageBucket: "land-registry-ec940.appspot.com",

        messagingSenderId: "733014587585",

        appId: "1:733014587585:web:48273a4a537cdd4f457c40",

        measurementId: "G-N5CTS8PWJ8"

    };
    const app = initializeApp(firebaseConfig);

    const analytics = getAnalytics(app);



    function App() {
    return (
        <div className="container">
            <Routes>
            <Route path="/" element={<Marketplace />}/>
            <Route path="/nftPage" element={<NFTPage />}/>        
            <Route path="/profile" element={<Profile />}/>
            <Route path="/sellNFT" element={<SellNFT />}/>             
            </Routes>
        </div>
    );
    }

    export default App;
