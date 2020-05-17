pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

// SyntheticToken from UMA
import "./uma/contracts/financial-templates/expiring-multiparty/ExpiringMultiPartyCreator.sol";
//import "./uma/contracts/financial-templates/expiring-multiparty/ExpiringMultiParty.sol";
//import "./uma/contracts/financial-templates/expiring-multiparty/Liquidatable.sol";
import "./uma/contracts/oracle/implementation/Registry.sol";


/***
 * @notice - This contract is that ...
 **/
contract ExpiringMultiPartyViaNew {
    using SafeMath for uint;

    ExpiringMultiPartyCreator public expiringMultiPartyCreator;

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


    function createEMPCreator() 
        public 
        returns (bool _msgSenderHoldsRole, bool _addressThisHoldsRole, bool _expiringMultiPartyCreatorHoldsRole) 
    {
        Registry registry = new Registry();
        registry.addMember(1, msg.sender);
        registry.addMember(1, address(this));

        ExpiringMultiPartyCreator expiringMultiPartyCreator = new ExpiringMultiPartyCreator(finderAddress, collateralTokenWhitelist, tokenFactoryAddress, timerAddress);
        registry.addMember(1, address(expiringMultiPartyCreator));

        return (registry.holdsRole(1, msg.sender),
                registry.holdsRole(1, address(this)),
                registry.holdsRole(1, address(expiringMultiPartyCreator)));
    }

    function createEMP(ExpiringMultiPartyCreator.Params memory params) 
        public 
        returns (bool) 
    {
        expiringMultiPartyCreator.createExpiringMultiParty(params);
    }

}
