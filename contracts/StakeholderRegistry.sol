pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

// Use original Ownable.sol
import "./lib/OwnableOriginal.sol";
import "./lib/ExpiringMultiPartyLibAddress.sol";

// Storage
import "./storage/McStorage.sol";
import "./storage/McConstants.sol";

// SyntheticToken from UMA
import "./uma/contracts/common/implementation/AddressWhitelist.sol";
//import "./uma/contracts/financial-templates/common/FeePayer.sol";
import "./uma/contracts/financial-templates/common/TokenFactory.sol";  // Inherit SyntheticToken.sol
import "./uma/contracts/financial-templates/expiring-multiparty/ExpiringMultiParty.sol";
//import "./uma/contracts/financial-templates/expiring-multiparty/ExpiringMultiPartyLib.sol";
import "./uma/contracts/financial-templates/expiring-multiparty/ExpiringMultiPartyCreator.sol";
import "./uma/contracts/financial-templates/expiring-multiparty/Liquidatable.sol";
import "./uma/contracts/oracle/implementation/Registry.sol";
import "./uma/contracts/oracle/implementation/Finder.sol";
import "./uma/contracts/oracle/implementation/IdentifierWhitelist.sol";
import "./uma/contracts/oracle/implementation/ContractCreator.sol";

// Original Contract
import "./CreateContractViaNew.sol";


/***
 * @notice - This contract is that ...
 **/
contract StakeholderRegistry is ContractCreator, OwnableOriginal(msg.sender), McStorage, McConstants {

    //using ExpiringMultiPartyLib for ExpiringMultiParty.ConstructorParams;
    using SafeMath for uint;

    // This blocks every public state-modifying method until it flips to true, via the `initialize()` method.
    bool private initialized;

    //@dev - Token Address
    address DAI;
    address EXPIRING_MULTIPARTY;
    address EXPIRING_MULTIPARTY_CREATOR;
    address IDENTIFIER_WHITELIST;
    address FINDER;

    CreateContractViaNew public createContractViaNew;
    IERC20 public dai;
    ExpiringMultiPartyCreator public expiringMultiPartyCreator;
    Registry public registry;

    constructor(address _erc20, 
                address _createContractViaNew, 
                address _expiringMultiPartyCreator,
                address _registry,
                address _finder
    ) public ContractCreator(_finder) {
        dai = IERC20(_erc20);
        DAI = _erc20;
        createContractViaNew = CreateContractViaNew(_createContractViaNew);
        expiringMultiPartyCreator = ExpiringMultiPartyCreator(_expiringMultiPartyCreator);
        registry = Registry(_registry);

        //EXPIRING_MULTIPARTY_LIB = _expiringMultiPartyLib;
        EXPIRING_MULTIPARTY_CREATOR = _expiringMultiPartyCreator;
        // ADDRESS_WHITELIST = _addressWhitelist;
        FINDER = _finder;
        // TOKEN_FACTORY = _tokenFactory;
        // TIMER = 0x0000000000000000000000000000000000000000;
        //IDENTIFIER_WHITELIST = _identifierWhitelist;
    }


    // function createEMP(Liquidatable.ConstructorParams memory params) public returns (bool) {
    //     ExpiringMultiParty expiringMultiParty = new ExpiringMultiParty(params);
    // }


    function initialize() public {
        initialized = true;
        _registerContract(new address[](0), address(this));
    }

    function generateEMP(ExpiringMultiPartyCreator.Params memory params) public returns (bool) {
        registry.addMember(1, EXPIRING_MULTIPARTY_CREATOR);

        //@dev - Add Role to EMPCreator contractAddress
        //address EXPIRING_MULTIPARTY = expiringMultiPartyCreator.createExpiringMultiParty(params);
    }

    function checkRoleOfExpiringMultiPartyCreator(uint256 _roleId) public view returns (bool isMember) {
        checkRole(_roleId, EXPIRING_MULTIPARTY_CREATOR);
    }

    function checkRole(uint256 _roleId, address _memberToCheck) public view returns (bool isMember) {
        return registry.holdsRole(_roleId, _memberToCheck);
    }
    



    

    function createSyntheticTokenPosition(ExpiringMultiPartyCreator.Params memory constructorParams) public returns (address _collateralTokenWhitelist, address _finderAddress, address _tokenFactoryAddress, address _timerAddress) {
        //@dev - Call from createContractViaNew() method
        TokenFactory tokenFactory;
        IdentifierWhitelist identifierWhitelist;
        Registry registry;
        AddressWhitelist addressWhitelist;
        Finder finder;
        Timer timer;

        (identifierWhitelist, registry, addressWhitelist, finder, tokenFactory, timer) = createContractViaNew.createContractViaNew();

        //@dev - Create ExpiringMultiParty
        identifierWhitelist.addSupportedIdentifier(constructorParams.priceFeedIdentifier);
        registry.addMember(1, EXPIRING_MULTIPARTY_CREATOR);
        addressWhitelist.addToWhitelist(constructorParams.collateralAddress);

        address _collateralTokenWhitelist = address(addressWhitelist);
        address _finderAddress = address(finder);
        address _tokenFactoryAddress = address(tokenFactory);
        address _timerAddress = address(timer);

        //ExpiringMultiPartyCreator expiringMultiPartyCreator = new ExpiringMultiPartyCreator(_finderAddress, _collateralTokenWhitelist, _tokenFactoryAddress, _timerAddress);

        // address EXPIRING_MULTIPARTY_ADDRESS = expiringMultiPartyCreator.createExpiringMultiParty(constructorParams);
        return (_collateralTokenWhitelist, _finderAddress, _tokenFactoryAddress, _timerAddress);
    }



    function _createToken(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint8 _tokenDecimals
    ) public returns (ExpandedIERC20 _newToken) {
        ExpandedIERC20 _newToken;  // Temporality
        //ExpandedIERC20 _newToken = tokenFactory.createToken(_tokenName, _tokenSymbol, _tokenDecimals);
        return _newToken;
    }
    

    function balanceOfContract() public view returns (uint _balanceOfContract) {
        return address(this).balance;
    }

}
