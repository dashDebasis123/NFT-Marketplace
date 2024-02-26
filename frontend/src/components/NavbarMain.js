// import fullLogo from "../out2.png"
// import { Link } from "react-router-dom"

import { useNavigate } from "react-router"
import { useUserAuth } from "./context/UserAuthContext"
import { useEthers } from "@usedapp/core"

import { Navbar, MobileNav, Typography, Button, IconButton } from "@material-tailwind/react"
import { useState, useEffect } from "react"

// import { AccountIcon }
function NavbarMain() {
    const { logOut } = useUserAuth()
    const navigate = useNavigate()
    const { account, activateBrowserWallet, deactivate } = useEthers()
    const [openNav, setOpenNav] = useState(false)
    const adminAddress = "0x3E6696020ca8DCeb836e4662D48B36d4763dfC3D"

    useEffect(() => {
        window.addEventListener("resize", () => window.innerWidth >= 960 && setOpenNav(false))
    }, [])

    const handleLogout = async () => {
        try {
            await logOut()
            navigate("/")
        } catch (error) {
            console.log(error.message)
        }
    }

    const navList = (
        <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
            <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className="flex items-center gap-x-2 p-1 font-medium"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-6 h-6"
                >
                    <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
                </svg>

                <a href="/marketplace" className="flex items-center">
                    Marketplace
                </a>
            </Typography>
            <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className="flex items-center gap-x-2 p-1 font-medium"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-6 h-6"
                >
                    <path
                        fill-rule="evenodd"
                        d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875Zm6.905 9.97a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72V18a.75.75 0 0 0 1.5 0v-4.19l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z"
                        clip-rule="evenodd"
                    />
                    <path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z" />
                </svg>

                <a href="/sellNFT" className="flex items-center">
                    List NFT
                </a>
            </Typography>
            <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className="flex items-center gap-x-2 p-1 font-medium"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-6 h-6"
                >
                    <path d="M2.273 5.625A4.483 4.483 0 0 1 5.25 4.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 3H5.25a3 3 0 0 0-2.977 2.625ZM2.273 8.625A4.483 4.483 0 0 1 5.25 7.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 6H5.25a3 3 0 0 0-2.977 2.625ZM5.25 9a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h13.5a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3H15a.75.75 0 0 0-.75.75 2.25 2.25 0 0 1-4.5 0A.75.75 0 0 0 9 9H5.25Z" />
                </svg>

                <a href="/lottery" className="flex items-center">
                    Lottery
                </a>
            </Typography>
            <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className="flex items-center gap-x-2 p-1 font-medium"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-6 h-6"
                >
                    <path
                        fill-rule="evenodd"
                        d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                        clip-rule="evenodd"
                    />
                </svg>

                <a href="/profile" className="flex items-center">
                    Profile
                </a>
            </Typography>
            {account === adminAddress && (
                <Typography
                    as="li"
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-x-2 p-1 font-medium"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="w-6 h-6"
                    >
                        <path d="M11.584 2.376a.75.75 0 0 1 .832 0l9 6a.75.75 0 1 1-.832 1.248L12 3.901 3.416 9.624a.75.75 0 0 1-.832-1.248l9-6Z" />
                        <path
                            fill-rule="evenodd"
                            d="M20.25 10.332v9.918H21a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1 0-1.5h.75v-9.918a.75.75 0 0 1 .634-.74A49.109 49.109 0 0 1 12 9c2.59 0 5.134.202 7.616.592a.75.75 0 0 1 .634.74Zm-7.5 2.418a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Zm3-.75a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0v-6.75a.75.75 0 0 1 .75-.75ZM9 12.75a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Z"
                            clip-rule="evenodd"
                        />
                        <path d="M12 7.875a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" />
                    </svg>

                    <a href="/admin" className="flex items-center">
                        Admin
                    </a>
                </Typography>
            )}
        </ul>
    )

    return (
        <Navbar className="mx-auto max-w-screen-xl px-4 py-2 lg:px-8 lg:py-4">
            <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
                <Typography
                    as="a"
                    href="/marketplace"
                    className="mr-4 cursor-pointer py-1.5 font-medium"
                >
                    Land Registry
                </Typography>
                <div className="hidden lg:block">{navList}</div>
                <div className="flex items-center gap-x-1">
                    {account && (
                        <Button
                            variant="text"
                            size="sm"
                            color="purple"
                            className="hidden lg:flex"
                            onClick={deactivate}
                        >
                            <img
                                src="https://docs.material-tailwind.com/icons/metamask.svg"
                                alt="metamask"
                                className="h-6 w-6 "
                            />
                            <span className="self-center">Disconnect</span>
                        </Button>
                    )}

                    {!account && (
                        <Button
                            variant="text"
                            size="sm"
                            color="purple"
                            className="hidden lg:flex"
                            onClick={activateBrowserWallet}
                        >
                            <img
                                src="https://docs.material-tailwind.com/icons/metamask.svg"
                                alt="metamask"
                                className="h-6 w-6 "
                            />
                            <span className="self-center">connect</span>
                        </Button>
                    )}

                    <Button
                        variant="gradient"
                        color="purple"
                        size="sm"
                        className="hidden lg:inline-block"
                        onClick={handleLogout}
                    >
                        <span>Log out</span>
                    </Button>
                </div>
                <IconButton
                    variant="text"
                    className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
                    ripple={false}
                    onClick={() => setOpenNav(!openNav)}
                >
                    {openNav ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            className="h-6 w-6"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    )}
                </IconButton>
            </div>
            <MobileNav open={openNav}>
                <div className="container mx-auto">
                    {navList}
                    <div className="flex items-center gap-x-1">
                        {account && (
                            <Button
                                fullWidth
                                variant="text"
                                size="sm"
                                color="purple"
                                className=""
                                onClick={deactivate}
                            >
                                <img
                                    src="https://docs.material-tailwind.com/icons/metamask.svg"
                                    alt="metamask"
                                    className="h-6 w-6 "
                                />
                                <span>Disconnect</span>
                            </Button>
                        )}

                        {!account && (
                            <Button
                                fullWidth
                                variant="text"
                                size="sm"
                                color="purple"
                                className=""
                                onClick={activateBrowserWallet}
                            >
                                <img
                                    src="https://docs.material-tailwind.com/icons/metamask.svg"
                                    alt="metamask"
                                    className="h-6 w-6"
                                />
                                <span className="align-middle">Connect</span>
                            </Button>
                        )}

                        <Button
                            fullWidth
                            variant="gradient"
                            size="sm"
                            className=""
                            onClick={handleLogout}
                        >
                            <span>Log out</span>
                        </Button>
                    </div>
                </div>
            </MobileNav>
        </Navbar>
    )
}

export default NavbarMain
