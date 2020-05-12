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
import "./uma/contracts/oracle/implementation/IdentifierWhitelist.sol";
import "./uma/contracts/oracle/implementation/Registry.sol";
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
        //@dev - 1. we will create synthetic tokens from that contract.
        IERC20 collateralToken = dai;
        address collateralTokenAddress = DAI_ADDRESS;

        //await collateralToken.allocateTo(accounts[0], web3.utils.toWei("10000"));
        collateralToken.approve(EXPIRING_MULTIPARTY_CREATOR_ADDRESS, 150000000000000000);  // 0.15 Ether

        // @dev - 2. We can now create a synthetic token position
        //expiringMultiPartyCreator.createExpiringMultiParty(constructorParams);
    }


    function createContractViaNew(ExpiringMultiPartyCreator.Params memory constructorParams) public returns (IdentifierWhitelist identifierWhitelist, address EXPIRING_MULTIPARTY_ADDRESS) {
        IdentifierWhitelist identifierWhitelist = new IdentifierWhitelist();
        identifierWhitelist.addSupportedIdentifier(constructorParams.priceFeedIdentifier);

        Registry registry = new Registry();
        registry.addMember(1, EXPIRING_MULTIPARTY_CREATOR_ADDRESS);

        AddressWhitelist addressWhitelist = new AddressWhitelist();
        addressWhitelist.addToWhitelist(constructorParams.collateralAddress);

        address EXPIRING_MULTIPARTY_ADDRESS = expiringMultiPartyCreator.createExpiringMultiParty(constructorParams);

        return (identifierWhitelist, EXPIRING_MULTIPARTY_ADDRESS);
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
