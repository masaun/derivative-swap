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
contract StakeholderRegistry is OwnableOriginal(msg.sender), McStorage, McConstants {
    using SafeMath for uint;

    //@dev - Token Address
    address DAI_ADDRESS;
    address EXPIRING_MULTIPARTY_CREATOR_ADDRESS;
    address EXPIRING_MULTIPARTY_ADDRESS;

    IERC20 public dai;
    TokenFactory public tokenFactory;
    ExpiringMultiPartyCreator public expiringMultiPartyCreator;
    IdentifierWhitelist public identifierWhitelist;
    Registry public registry;
    AddressWhitelist public addressWhitelist;
    Finder public finder;
    Timer public timer;


    constructor(address _erc20, address _tokenFactory, address _expiringMultiPartyCreator, address _identifierWhitelist, address _registry, address _addressWhitelist) public {
        dai = IERC20(_erc20);
        DAI_ADDRESS = _erc20;
        EXPIRING_MULTIPARTY_CREATOR_ADDRESS = _expiringMultiPartyCreator;

        tokenFactory = TokenFactory(_tokenFactory);
        expiringMultiPartyCreator = ExpiringMultiPartyCreator(_expiringMultiPartyCreator);
        identifierWhitelist = IdentifierWhitelist(_identifierWhitelist);
        registry = Registry(_registry);
        addressWhitelist = AddressWhitelist(_addressWhitelist);
    }


    function createSyntheticTokenPosition(ExpiringMultiPartyCreator.Params memory constructorParams) public returns (bool) {
        //@dev - Call from createContractViaNew() method
        (identifierWhitelist, registry, addressWhitelist, finder, tokenFactory, timer) = createContractViaNew();

        //@dev - Create ExpiringMultiParty
        identifierWhitelist.addSupportedIdentifier(constructorParams.priceFeedIdentifier);
        registry.addMember(1, EXPIRING_MULTIPARTY_CREATOR_ADDRESS);
        addressWhitelist.addToWhitelist(constructorParams.collateralAddress);

        address _collateralTokenWhitelist = address(addressWhitelist);
        address _finderAddress = address(finder);
        address _tokenFactoryAddress = address(tokenFactory);
        address _timerAddress = address(timer);

        ExpiringMultiPartyCreator expiringMultiPartyCreator = new ExpiringMultiPartyCreator(_finderAddress, _collateralTokenWhitelist, _tokenFactoryAddress, _timerAddress);

        address EXPIRING_MULTIPARTY_ADDRESS;
        // address EXPIRING_MULTIPARTY_ADDRESS = expiringMultiPartyCreator.createExpiringMultiParty(constructorParams);
    }

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
