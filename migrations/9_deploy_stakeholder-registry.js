var StakeholderRegistry = artifacts.require("StakeholderRegistry");
var IERC20 = artifacts.require("IERC20");
var CreateContractViaNew = artifacts.require("CreateContractViaNew");
var Registry = artifacts.require("Registry");
var ExpiringMultiPartyCreator = artifacts.require("ExpiringMultiPartyCreator");

//@dev - Import from exported file
var tokenAddressList = require('./tokenAddress/tokenAddress.js');
var contractAddressList = require('./contractAddress/contractAddress.js');
var walletAddressList = require('./walletAddress/walletAddress.js');

const _collateralAddress = tokenAddressList["Kovan"]["DAI"];                            // DAI address on Kovan
const _createContractViaNew = CreateContractViaNew.address;
const _registry = Registry.address;
const _expiringMultiPartyCreator = ExpiringMultiPartyCreator.address;

const depositedAmount = web3.utils.toWei("0.1");    // 2.1 DAI which is deposited in deployed contract. 


module.exports = async function(deployer, network, accounts) {
    // Deployer address
    const deployerAddress = accounts[0];

    // Initialize owner address if you want to transfer ownership of contract to some other address
    let ownerAddress = walletAddressList["WalletAddress1"];

    // Add Role to EMPCreator contractAddress
    const registry = await Registry.at(_registry);
    await registry.addMember(1, _expiringMultiPartyCreator, { from: deployerAddress });  //@dev - 1 is "Owner" Role
    await registry.addMember(1, _collateralAddress, { from: deployerAddress });          //@dev - 1 is "Owner" Role


    await deployer.deploy(StakeholderRegistry,
                          _collateralAddress,  // ERC20 address
                          _createContractViaNew, 
                          _expiringMultiPartyCreator,
                          _registry
          ).then(async function(stakeholderRegistry) {
        if(ownerAddress && ownerAddress!="") {
            console.log(`=== Transfering ownerhip to address ${ownerAddress} ===`)
            await stakeholderRegistry.transferOwnership(ownerAddress);
        }
    });

    const stakeholderRegistry = await StakeholderRegistry.deployed();

    const iERC20 = await IERC20.at(_collateralAddress);  // _collateralAddress is ERC20 address

    //@dev - Transfer 2.1 DAI from deployer's address to contract address in advance
    await iERC20.transfer(stakeholderRegistry.address, depositedAmount);
};
