pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/math/SafeMath.sol";

// Use original Ownable.sol
import "./lib/OwnableOriginal.sol";

// Storage
import "./storage/McStorage.sol";
import "./storage/McConstants.sol";


/***
 * @notice - This contract is that ...
 **/
contract StakeholderRegistry is OwnableOriginal(msg.sender), McStorage, McConstants {
    using SafeMath for uint;

    //@dev - Token Address
    address DAI_ADDRESS;
    IERC20 public dai;

    constructor(address _erc20) public {
        dai = IERC20(_erc20);
        DAI_ADDRESS = _erc20;
    }


    function balanceOfContract() public view returns (uint _balanceOfContract) {
        uint TEST_VALUE = 1;
        return TEST_VALUE;
    }

}
