pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

// SyntheticToken from UMA
import "./uma/contracts/financial-templates/expiring-multiparty/ExpiringMultiParty.sol";
import "./uma/contracts/financial-templates/expiring-multiparty/Liquidatable.sol";

/***
 * @notice - This contract is that ...
 **/
contract ExpiringMultiPartyViaNew {
    using SafeMath for uint;

    //constructor(Liquidatable.ConstructorParams memory params) public {}
    constructor() public {}


    function createEMP(Liquidatable.ConstructorParams memory params) public returns (bool) {
        ExpiringMultiParty expiringMultiParty = new ExpiringMultiParty(params);
    }

}
