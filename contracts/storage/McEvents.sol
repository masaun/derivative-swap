pragma solidity ^0.6.0;

import "./McObjects.sol";


contract McEvents {

    event CreateEMPCreator(
        bool _msgSenderHoldsRole, 
        bool _addressThisHoldsRole, 
        bool _expiringMultiPartyCreatorHoldsRole
    );


    /***
     * @dev - Example
     **/
    event Example(
        uint256 indexed Id, 
        uint256 exchangeRateCurrent,
        address msgSender,
        uint256 approvedValue    
    );

}
