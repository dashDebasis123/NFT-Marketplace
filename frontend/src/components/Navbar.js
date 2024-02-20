import fullLogo from '../out2.png';
import { Link } from 'react-router-dom';
// import { useState } from 'react';
// import { useLocation } from 'react-router';
import { useNavigate } from 'react-router';
import { useUserAuth } from './context/UserAuthContext';
import { useEthers } from '@usedapp/core';
// import { AccountIcon }
function Navbar() {
  const { logOut } = useUserAuth();
  const navigate = useNavigate();
  const { account, activateBrowserWallet, deactivate } = useEthers();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      console.log(error.message);
    }
  };

  const ConnectButton = () => (
    <div className="flex items-center justify-center">
      <button
        className=" bg-violet-500 hover:bg-violet-400 text-white font-bold py-2 px-4 rounded text-sm"
        onClick={activateBrowserWallet}
      >
        Connect
      </button>
    </div>
  );

  const MetamaskConnect = () => (
    <div className="flex items-center justify-center">
      {!account && <ConnectButton />}
      {account && (
        <button
          className=" bg-violet-500 hover:bg-violet-400 text-white font-bold py-2 px-4 rounded text-sm"
          onClick={deactivate}
        >
          Disconnect
        </button>
      )}
    </div>
  );

  return (
    <div className="">
      <MetamaskConnect />
      <nav className="w-screen">
        <ul className="flex items-end justify-between py-3 bg-transparent text-white pr-5">
          <li className="flex items-end ml-5 pb-2">
            <img
              src={fullLogo}
              alt=""
              width={120}
              height={120}
              className="inline-block -mt-2"
            />
            <div className="inline-block font-bold text-xl ml-2">
              Welcome to Land Registry
            </div>
          </li>
          <li className="w-2/6">
            <ul className="lg:flex justify-between font-bold mr-10 text-lg">
              <li className="hover:border-b-2 hover:pb-0 p-2">
                <Link to="/marketplace">Marketplace</Link>
              </li>

              <li className="hover:border-b-2 hover:pb-0 p-2">
                <Link to="/sellNFT">List NFT</Link>
              </li>

              <li className="hover:border-b-2 hover:pb-0 p-2">
                <Link to="/lottery">Lottery</Link>
              </li>

              <li className="hover:border-b-2 hover:pb-0 p-2">
                <Link to="/profile">Profile</Link>
              </li>

              <li className="hover:border-b-2 hover:pb-0 p-2">
                <Link to="/sendMessage">Send-Message</Link>
              </li>

              <li>
                <button
                  className=" bg-violet-500 hover:bg-violet-400 text-white font-bold py-2 px-4 rounded text-sm"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      <div className="text-white text-bold text-right mr-10 text-base"></div>
    </div>
  );
}

export default Navbar;
