pragma solidity ^0.6.0;

import "./McObjects.sol";


contract McEvents {

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
