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

// SyntheticToken from UMA
import "./uma/contracts/financial-templates/implementation/SyntheticToken.sol";



/***
 * @notice - This contract is that ...
 **/
contract StakeholderRegistry is OwnableOriginal(msg.sender), McStorage, McConstants {
    using SafeMath for uint;

    //@dev - Token Address
    address DAI_ADDRESS;
    IERC20 public dai;
    SyntheticToken public syntheticToken;

    constructor(address _erc20, address _syntheticToken) public {
        dai = IERC20(_erc20);
        DAI_ADDRESS = _erc20;

        syntheticToken = SyntheticToken(_syntheticToken);
    }


    function balanceOfContract() public view returns (uint _balanceOfContract) {
        uint TEST_VALUE = 1;
        return TEST_VALUE;
    }

}
