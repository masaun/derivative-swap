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
import "./uma/contracts/financial-templates/implementation/TokenFactory.sol";  // Inherit SyntheticToken.sol


/***
 * @notice - This contract is that ...
 **/
contract StakeholderRegistry is OwnableOriginal(msg.sender), McStorage, McConstants {
    using SafeMath for uint;

    //@dev - Token Address
    address DAI_ADDRESS;
    IERC20 public dai;
    TokenFactory public tokenFactory;

    constructor(address _erc20, address _syntheticToken) public {
        dai = IERC20(_erc20);
        DAI_ADDRESS = _erc20;

        tokenFactory = TokenFactory(_syntheticToken);
    }



    function _createToken(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint8 _tokenDecimals
    ) public returns (ExpandedIERC20 _newToken) {
        ExpandedIERC20 _newToken = tokenFactory.createToken(_tokenName, _tokenSymbol, _tokenDecimals);
        return _newToken;
    }
    

    function balanceOfContract() public view returns (uint _balanceOfContract) {
        return address(this).balance;
    }

}
