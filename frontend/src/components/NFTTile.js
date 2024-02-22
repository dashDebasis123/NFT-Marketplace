// import axie from "../tile.jpeg";
import { Link } from "react-router-dom"
// import { GetIpfsUrlFromPinata } from "../utils"

function NFTTile(data) {
    
    const newTo = {
        pathname: "/nftPage/" + data.data.tokenId,
    }
    
    console.log("in nft tile:  ", data.data.address)
   

    return (
    
        <Link to={newTo}>
            
            <div className="border-2 ml-12 mt-5 mb-12 flex flex-col items-center rounded-lg w-48 md:w-72 shadow-2xl">
                
                <div className="text-white w-full p-2 bg-gradient-to-t from-[#454545] to-transparent rounded-lg pt-5 -mt-20">
                    <strong className="text-xl">{data.data.address}</strong>
                    <p className="display-inline">{data.data.mandal}</p>
                    <p className="display-inline">{data.data.district}</p>
                    <p className="display-inline">{data.data.wardno}</p>
                    <p className="display-inline">{data.data.blockno}</p>
                </div>
            </div>
        </Link>
    )
}

export default NFTTile
