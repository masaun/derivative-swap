pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

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



/***
 * @notice - This contract is that ...
 **/
contract ExpiringMultiPartyViaNew is McStorage, McConstants {
    using SafeMath for uint;

    ExpiringMultiPartyCreator public expiringMultiPartyCreator;

    address DAI_ADDRESS = 0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa; // Kovan
    address finderAddress;
    address collateralTokenWhitelist;
    address tokenFactoryAddress;
    address timerAddress;

    //constructor(Liquidatable.ConstructorParams memory params) public {}
    constructor(
        address _finderAddress,
        address _collateralTokenWhitelist,
        address _tokenFactoryAddress,
        address _timerAddress
    ) public {
        //expiringMultiPartyCreator = ExpiringMultiPartyCreator(_finderAddress, _collateralTokenWhitelist, _tokenFactoryAddress, _timerAddress);

        finderAddress = _finderAddress;
        collateralTokenWhitelist = _collateralTokenWhitelist;
        tokenFactoryAddress = _tokenFactoryAddress;
        timerAddress = _timerAddress;
    }


    function createEMPCreator() public returns (bool) {
        // AddressWhitelist addressWhitelist = new AddressWhitelist();
        // Finder finder = new Finder();
        // TokenFactory tokenFactory = new TokenFactory();
        // Timer timer = new Timer();

        // finderAddress = address(finder);
        // collateralTokenWhitelist = address(addressWhitelist);
        // tokenFactoryAddress = address(tokenFactory);
        // timerAddress = address(timer);

        // addressWhitelist.addToWhitelist(DAI_ADDRESS);


        Registry registry = new Registry();
        registry.addMember(1, msg.sender);
        registry.addMember(1, address(this));

        ExpiringMultiPartyCreator expiringMultiPartyCreator = new ExpiringMultiPartyCreator(finderAddress, collateralTokenWhitelist, tokenFactoryAddress, timerAddress);
        registry.addMember(1, address(expiringMultiPartyCreator));

        emit CreateEMPCreator(registry.holdsRole(1, msg.sender),
                              registry.holdsRole(1, address(this)),
                              registry.holdsRole(1, address(expiringMultiPartyCreator))
        );
    }

    function createEMP(ExpiringMultiPartyCreator.Params memory params) 
        public 
        returns (bool) 
    {
        expiringMultiPartyCreator.createExpiringMultiParty(params);
    }

}
