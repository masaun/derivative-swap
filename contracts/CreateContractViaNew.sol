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
import "./uma/contracts/financial-templates/implementation/ExpiringMultiPartyCreator.sol";
import "./uma/contracts/financial-templates/implementation/TokenFactory.sol";
import "./uma/contracts/oracle/implementation/IdentifierWhitelist.sol";
import "./uma/contracts/oracle/implementation/Registry.sol";
import "./uma/contracts/oracle/implementation/Finder.sol";
import "./uma/contracts/common/implementation/AddressWhitelist.sol";


/***
 * @notice - This contract is that ...
 **/
contract CreateContractViaNew is OwnableOriginal(msg.sender), McStorage, McConstants {
    using SafeMath for uint;

    TokenFactory public tokenFactory;
    ExpiringMultiPartyCreator public expiringMultiPartyCreator;
    IdentifierWhitelist public identifierWhitelist;
    Registry public registry;
    AddressWhitelist public addressWhitelist;
    Finder public finder;
    Timer public timer;

    constructor() public {}

    function createContractViaNew() 
        public 
        returns (IdentifierWhitelist identifierWhitelist, 
                 Registry registry, 
                 AddressWhitelist addressWhitelist, 
                 Finder finder,
                 TokenFactory tokenFactory,
                 Timer timer) 
    {
        IdentifierWhitelist identifierWhitelist = new IdentifierWhitelist();
        Registry registry = new Registry();
        AddressWhitelist addressWhitelist = new AddressWhitelist();
        Finder finder = new Finder();
        TokenFactory tokenFactory = new TokenFactory();
        Timer timer = new Timer();

        return (identifierWhitelist, registry, addressWhitelist, finder, tokenFactory, timer);
    }

}
