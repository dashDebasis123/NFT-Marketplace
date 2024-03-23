// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract EnglishAuction {
    event auctionStarted();
    event bidAuction(address indexed sender, uint256 amount);
    event withdrawAuction(address indexed bidder, uint256 amount);
    event auctionEnded(address winner, uint256 amount);

    IERC721 public nft;
    uint256 public nftId;

    address payable public owner;
    // uint256 public endAt;
    bool public auctionStatus;

    address public highestBidder;
    uint256 public highestBid;
    mapping(address => uint256) public bids;

    constructor() {
        owner = payable(msg.sender);

        auctionStatus = false;

        highestBid = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this method");
        _;
    }

    function start(address _nftContract, uint256 _tokenId) public onlyOwner {
        require(!auctionStatus, "started");
        require(msg.sender == owner, "not seller");
        nft = IERC721(_nftContract);
        nftId = _tokenId;
        auctionStatus = true;

        emit auctionStarted();
    }

    function bid() public payable {
        require(auctionStatus, "auction not started");

        // require(block.timestamp < endAt, "ended");
        require(msg.value > highestBid, "value < highest");

        if (highestBidder != address(0)) {
            bids[highestBidder] += highestBid;
        }

        highestBidder = msg.sender;
        highestBid = msg.value;

        emit bidAuction(msg.sender, msg.value);
    }

    function withdraw() public payable {
        uint256 bal = bids[msg.sender];
        bids[msg.sender] = 0;
        payable(msg.sender).transfer(bal);

        emit withdrawAuction(msg.sender, bal);
    }

    function end() public payable  onlyOwner{
        require(auctionStatus, "auction didn't started");
        auctionStatus = false;
        if (highestBidder != address(0)) {
            // nft.safeTransferFrom(address(this, highestBidder, nftId);
            nft.safeTransferFrom(owner, highestBidder, nftId);

            owner.transfer(highestBid);
        }
        highestBid = 0;
        nftId = 0;

        emit auctionEnded(highestBidder, highestBid);
    }
}
