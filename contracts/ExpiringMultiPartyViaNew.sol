pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

// SyntheticToken from UMA
import "./uma/contracts/financial-templates/expiring-multiparty/ExpiringMultiPartyCreator.sol";
//import "./uma/contracts/financial-templates/expiring-multiparty/ExpiringMultiParty.sol";
//import "./uma/contracts/financial-templates/expiring-multiparty/Liquidatable.sol";

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


    function createEMP(ExpiringMultiPartyCreator.Params memory params) public returns (bool) {
        ExpiringMultiPartyCreator expiringMultiPartyCreator = new ExpiringMultiPartyCreator(finderAddress, collateralTokenWhitelist, tokenFactoryAddress, timerAddress);
        expiringMultiPartyCreator.createExpiringMultiParty(params);
    }

}
