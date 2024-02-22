import React from "react"
import "./App.css"

import { Routes, Route } from "react-router-dom"
import SellNFT from "./components/SellNFT"
import Marketplace from "./components/Marketplace"
import Profile from "./components/Profile"
import NFTPage from "./components/NFTpage"
import Login from "./components/Login"
import Signup from "./components/Signup"
import SendMessage from "./components/SendMessage"
import ProtectedRoute from "./components/ProtectedRoute"

import { UserAuthContextProvider } from "./components/context/UserAuthContext"

function App() {
    return (
        <UserAuthContextProvider>
            <Routes>
                <Route
                    path="/marketplace"
                    element={
                        <ProtectedRoute>
                            <Marketplace />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/sellNFT"
                    element={
                        <ProtectedRoute>
                            <SellNFT />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/nftPage/:tokenId"
                    element={
                        <ProtectedRoute>
                            <NFTPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/sendMessage"
                    element={
                        <ProtectedRoute>
                            <SendMessage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<Login />} />
            </Routes>
        </UserAuthContextProvider>
    )
}

export default App
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
