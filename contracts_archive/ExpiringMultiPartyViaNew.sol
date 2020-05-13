pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/math/SafeMath.sol";

// // Use original Ownable.sol
// import "./lib/OwnableOriginal.sol";

// // Storage
// import "./storage/McStorage.sol";
// import "./storage/McConstants.sol";

// // SyntheticToken from UMA
// import "./uma/contracts/financial-templates/implementation/TokenFactory.sol";  // Inherit SyntheticToken.sol
// import "./uma/contracts/financial-templates/implementation/ExpiringMultiPartyCreator.sol";
// import "./uma/contracts/financial-templates/implementation/TokenFactory.sol";
// import "./uma/contracts/oracle/implementation/IdentifierWhitelist.sol";
// import "./uma/contracts/oracle/implementation/Registry.sol";
// import "./uma/contracts/oracle/implementation/Finder.sol";
// import "./uma/contracts/common/implementation/AddressWhitelist.sol";

// Original Contract
import "./StakeholderRegistry.sol";


/***
 * @notice - This contract is that ...
 **/
contract ExpiringMultiPartyViaNew is StakeholderRegistry {
    using SafeMath for uint;

    address EXPIRING_MULTIPARTY_ADDRESS;

    constructor() public {}


    function expiringMultiPartyViaNew(ExpiringMultiPartyCreator.Params memory constructorParams) public returns (address EXPIRING_MULTIPARTY_ADDRESS) {
        address collateralTokenWhitelist;
        address finderAddress;
        address tokenFactoryAddress;
        address timerAddress;

        //@dev - Call from createContractViaNew() method
        (collateralTokenWhitelist, finderAddress, tokenFactoryAddress, timerAddress) = createSyntheticTokenPosition(constructorParams);

        ExpiringMultiPartyCreator expiringMultiPartyCreator = new ExpiringMultiPartyCreator(finderAddress, collateralTokenWhitelist, tokenFactoryAddress, timerAddress);

        address EXPIRING_MULTIPARTY_ADDRESS = expiringMultiPartyCreator.createExpiringMultiParty(constructorParams);
        return EXPIRING_MULTIPARTY_ADDRESS;
    }

}
