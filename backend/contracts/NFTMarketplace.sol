//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.7;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMarketplace is ERC721URIStorage {
    
    using Counters for Counters.Counter;
    //_tokenIds variable has the most recent minted tokenId
    Counters.Counter private _tokenIds;
    //Keeps track of the number of items sold on the marketplace
    Counters.Counter private _itemsSold;
    //owner is the contract address that created the smart contract
    address payable owner;
    //The fee charged by the marketplace to be allowed to list an NFT
    uint256 listPrice = 0.01 ether;
/////////////////////////////////////////////////////////////////////////////////////////////
    mapping (address => uint256) public entryCount;
    address[] public players;
    address [] public playerSelector;
    // address public nftAddress;
    bool public raffleStatus;
    uint256 public entryCost = 0.01 ether;
    uint256 public nftId;
    uint256 public totalEntries;


    event NewEntry(address player);
    event RaffleStarted();
    event RaffleEnded();
    event WinnerSelected(address winner);
    event EntryCostChanged(uint256 newCost);
    event NFTPrizeSet( uint256 nftId);
    event BalanceWithdrawn(uint256 amount);

////////////////////////////////////////////////////////////////////////////////////////////
    /* Auction */
    event auctionStarted();
    event bidAuction(address indexed sender, uint256 amount);
    event withdrawAuction(address indexed bidder, uint256 amount);
    event auctionEnded(address winner, uint256 amount);

    uint256 public auctionNftId;
    bool public  auctionStatus ;
    address public highestBidder;
    uint256 public highestBid;
    mapping (address => uint256) public bids;
////////////////////////////////////////////////////////////////////////////////////////////
    //The structure to store info about a listed token
    struct ListedToken {
        uint256 tokenId;
        address owner;
        address seller;
        uint256 price;
        bool currentlyListed;
    }

    //the event emitted when a token is successfully listed
    event TokenListedSuccess (
        uint256 indexed tokenId,
        address owner,
        address seller,
        uint256 price,
        bool currentlyListed
    );
    event TokenListed(uint256 tokenID);
    event NFTTransfer(uint256 tokenID, address from, address to, string tokenURI, uint256 price);


    //This mapping maps tokenId to token info and is helpful when retrieving details about a tokenId
    mapping(uint256 => ListedToken) private idToListedToken;

    constructor() ERC721("NFTMarketplace", "NFTM") {
        owner = payable(msg.sender);
        raffleStatus = false;
        totalEntries = 0;
        auctionStatus = false;
        highestBid = 0;
    }

    modifier onlyOwner(){
        require(msg.sender == owner, "Only owner can call this method");
        _;
    }
    function updateListPrice(uint256 _listPrice) public payable {
        require(owner == msg.sender, "Only owner can update listing price");
        listPrice = _listPrice;
    }

    function getListPrice() public view returns (uint256) {
        return listPrice;
    }

    function getLatestIdToListedToken() public view returns (ListedToken memory) {
        uint256 currentTokenId = _tokenIds.current();
        return idToListedToken[currentTokenId];
    }

    function getListedTokenForId(uint256 tokenId) public view returns (ListedToken memory) {
        return idToListedToken[tokenId];
    }

    function getCurrentToken() public view returns (uint256) {
        return _tokenIds.current();
    }

    //The first time a token is created, it is listed here
        function createToken(string memory tokenURI) public  payable {
            //Increment the tokenId counter, which is keeping track of the number of minted NFTs
            _tokenIds.increment();
            uint256 newTokenId = _tokenIds.current();

            //Mint the NFT with tokenId newTokenId to the address who called createToken
            _safeMint(msg.sender, newTokenId);

            //Map the tokenId to the tokenURI (which is an IPFS URL with the NFT metadata)
            _setTokenURI(newTokenId, tokenURI);


            emit TokenListed(newTokenId);
        
        }

    function createListedToken(uint256 tokenId, uint256 price) public payable{
        //Make sure the sender sent enough ETH to pay for listing
        require(msg.value == listPrice, "Hopefully sending the correct price");
        //Just sanity check
        require(price > 0, "Make sure the price isn't negative");
        require(msg.sender == ownerOf(tokenId), "You are not the owner of the token");

        //Update the mapping of tokenId's to Token details, useful for retrieval functions
        idToListedToken[tokenId] = ListedToken(
            tokenId,
            address(this),
            msg.sender,
            price,
            true
        );

        _transfer(msg.sender, address(this), tokenId);
        //Emit the event for successful transfer. The frontend parses this message and updates the end user
        emit TokenListedSuccess(
            tokenId,
            address(this),
            msg.sender,
            price,
            true
        );
    }

    /*
     Removing the owner's NFT from the NFT Marketplace 
    */
    function cancelListing(uint256 tokenId) public {
        ListedToken memory listing = idToListedToken[tokenId];
        require(listing.price > 0, "NFTMarket: nft not listed for sale");
        require(listing.seller == msg.sender, "NFTMarket: you're not the seller");
        _transfer(address(this), msg.sender, tokenId);
        clearListing(tokenId);
        emit NFTTransfer(tokenId, address(this), msg.sender, "", 0);
  }
  function clearListing(uint256 tokenId) private {
    idToListedToken[tokenId].price = 0;
    idToListedToken[tokenId].seller= address(0);
    idToListedToken[tokenId].owner = address(0);
    idToListedToken[tokenId].tokenId = 0;
    idToListedToken[tokenId].currentlyListed = false;   
  }
    
    //This will return all the NFTs currently listed to be sold on the marketplace
    function getAllNFTs() public view returns (ListedToken[] memory) {
        uint nftCount = _tokenIds.current();
        ListedToken[] memory tokens = new ListedToken[](nftCount);
        uint currentIndex = 0;
        uint currentId;
        //at the moment currentlyListed is true for all, if it becomes false in the future we will 
        //filter out currentlyListed == false over here
        for(uint i=0;i<nftCount;i++)
        {
            currentId = i + 1;
            ListedToken storage currentItem = idToListedToken[currentId];
            tokens[currentIndex] = currentItem;
            currentIndex += 1;
        }
        //the array 'tokens' has the list of all NFTs in the marketplace
        return tokens;
    }
    
    //Returns all the NFTs that the current user is owner or seller in
    function getMyNFTs() public view returns (ListedToken[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
        uint currentId;
        //Important to get a count of all the NFTs that belong to the user before we can make an array for them
        for(uint i=0; i < totalItemCount; i++)
        {
            if(idToListedToken[i+1].owner == msg.sender || idToListedToken[i+1].seller == msg.sender){
                itemCount += 1;
            }
        }

        //Once you have the count of relevant NFTs, create an array then store all the NFTs in it
        ListedToken[] memory items = new ListedToken[](itemCount);
        for(uint i=0; i < totalItemCount; i++) {
            if(idToListedToken[i+1].owner == msg.sender || idToListedToken[i+1].seller == msg.sender) {
                currentId = i+1;
                ListedToken storage currentItem = idToListedToken[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    // Selling of account from one user to another by changing the ownership of the account
    function executeSale(uint256 tokenId) public payable {
        uint price = idToListedToken[tokenId].price;
        address seller = idToListedToken[tokenId].seller;
        require(msg.value == price, "Please submit the asking price in order to complete the purchase");

        //update the details of the token
        idToListedToken[tokenId].currentlyListed = true;
        idToListedToken[tokenId].seller = payable(msg.sender);
        _itemsSold.increment();
        clearListing(tokenId);

        //Actually transfer the token to the new owner
        _transfer(address(this), msg.sender, tokenId);
        approve(address(this), tokenId);
        //approve the marketplace to sell NFTs on your behalf

        //Transfer the listing fee to the marketplace creator
        payable(owner).transfer(listPrice);
        //Transfer the proceeds from the sale to the seller of the NFT
        payable(seller).transfer(msg.value);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////

    function startRaffle(uint256 _tokenId) public onlyOwner{
        require (!raffleStatus, "Raflle is already started");
        // require (nftAddress == address(0), "NFT prize is already set. Please select winner from the previous lottery list");
        // require (  )

        // nftAddress = _nftContract;
        nftId = _tokenId;
        raffleStatus = true;

        // _transfer(msg.sender, address(this), nftId);

        emit RaffleStarted();
        emit NFTPrizeSet(_tokenId);   
        
    }

    function buyEntry(uint256 _numberOfEntries) public payable{
        require  (raffleStatus, "Raffle is not started yet");
        require(msg.value == entryCost * _numberOfEntries, "Incorrect amount sent");

        entryCount[msg.sender] += _numberOfEntries;
        totalEntries += _numberOfEntries;

        if(!isPlayer(msg.sender)) {
            players.push(msg.sender);
        }

        for(uint256 i = 0; i < _numberOfEntries; i++) {
            playerSelector.push(msg.sender);
        }
    }

    function isPlayer(address _player) public view returns(bool) {

        for (uint256 i=0; i< players.length; i++) {
            if(players[i] == _player){
                return true;
            }
        }
        return false;
    }


    function endRaffle() public onlyOwner {
        require(raffleStatus,"Raffle is not  started");
        raffleStatus = false;
        emit RaffleEnded();
    }

    function selectWinner() public payable onlyOwner {
        require(!raffleStatus,"Raffle is running");
        require (playerSelector.length>0,"No players in Raffle");
        // require (nftAddress != address(0), "Nft prize is not set");

        uint256 winnerIndex = random() % playerSelector.length;
        address winner = playerSelector[winnerIndex];
        emit WinnerSelected(winner);

        _transfer(msg.sender, winner, nftId);
        // approve(address(this),nftId);

        uint256 balance = address(this).balance;
          payable(owner).transfer(balance);
        
     }

   function random() private view returns (uint256) { 
    return uint256(
        keccak256(
            abi.encodePacked(
                blockhash(block.number - 1),
                block.timestamp,
                players.length 
            )
        )
        
    );
    }   


    function resetEntryCounts() private{
        for(uint256 i = 0; i < players.length; i){
            entryCount[players[i]] = 0;

        }
    }


    function changeEntryCost(uint256 _newCost) public onlyOwner {
        require (!raffleStatus, "Raffle is stil running");
        entryCost = _newCost;
        emit EntryCostChanged(_newCost);
     
       
    }

    function withdrawBlance() public onlyOwner{
        require (address(this).balance > 0 , "No balace to withdraw");
        uint256 balanceAmount = address(this).balance;
          payable(owner).transfer(balanceAmount);
        emit BalanceWithdrawn(balanceAmount);

        resetEntryCounts();
        delete playerSelector;
        delete players;
        nftId = 0;
        totalEntries = 0;
    }

    function getPlayers() public view returns(address[] memory){
        return players;
    }

    function getBalance() public view returns(uint256){
        return address(this).balance;
    }


    function resestContracts()  public onlyOwner{
        delete playerSelector;
        delete players;
        raffleStatus = false;
        // nftAddress = address(0);
        nftId = 0;
        entryCost = 0;
        totalEntries = 0;
        resetEntryCounts();
    }
}
