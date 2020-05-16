var StakeholderRegistry = artifacts.require("StakeholderRegistry");
var IERC20 = artifacts.require("IERC20");
var CreateContractViaNew = artifacts.require("CreateContractViaNew");
var Registry = artifacts.require("Registry");
var ExpiringMultiPartyLib = artifacts.require("ExpiringMultiPartyLib");
var ExpiringMultiPartyCreator = artifacts.require("ExpiringMultiPartyCreator");

//@dev - Import from exported file
var tokenAddressList = require('./tokenAddress/tokenAddress.js');
var contractAddressList = require('./contractAddress/contractAddress.js');
var walletAddressList = require('./walletAddress/walletAddress.js');

const _collateralAddress = tokenAddressList["Kovan"]["DAI"];   // DAI address on Kovan
const _createContractViaNew = CreateContractViaNew.address;
const _registry = Registry.address;
const _expiringMultiPartyCreator = ExpiringMultiPartyCreator.address;
const _finder = contractAddressList["Kovan"]["UMA"]["Finder"];

const depositedAmount = web3.utils.toWei("0.1");    // 2.1 DAI which is deposited in deployed contract. 


module.exports = async function(deployer, network, accounts) {
    // Deployer address
    const deployerAddress = accounts[0];

    // Initialize owner address if you want to transfer ownership of contract to some other address
    let ownerAddress = walletAddressList["WalletAddress1"];

    //@dev - Add Role to EMPCreator contractAddress
    //     - enum RoleType { Invalid, Exclusive, Shared }
    const registry = await Registry.deployed();
    await registry.addMember(1, _expiringMultiPartyCreator, { from: deployerAddress });  //@dev - 1 is "Exclusive" Role
    //await registry.addMember(2, _expiringMultiPartyCreator, { from: deployerAddress });  //@dev - 2 is "Shared" Role

    const params = { expirationTimestamp: "1590969600",      // "1588291200" is 2020-06-01T00:00:00.000Z
                     collateralAddress: _collateralAddress, 
                     priceFeedIdentifier: web3.utils.utf8ToHex("UMATEST"), 
                     syntheticName: "Test UMA Token", syntheticSymbol: "UMATEST", 
                     collateralRequirement: { rawValue: web3.utils.toWei("1.5") },  //@notice - assigned value must be greater than "1"
                     disputeBondPct: { rawValue: web3.utils.toWei("0.1") }, 
                     sponsorDisputeRewardPct: { rawValue: web3.utils.toWei("0.1") }, 
                     disputerDisputeRewardPct: { rawValue: web3.utils.toWei("0.1") }, 
                     minSponsorTokens: { rawValue: web3.utils.toWei("0.01") }, 
                     timerAddress: '0x0000000000000000000000000000000000000000' }
    //const expiringMultiPartyLib = await ExpiringMultiPartyLib.deployed();
    //console.log(`=== expiringMultiPartyLib deployed ===: ${expiringMultiPartyLib}`)
    //await expiringMultiPartyLib.deploy(params);
    //const expiringMultiPartyCreator = await ExpiringMultiPartyCreator.deployed();
    //await expiringMultiPartyCreator.createExpiringMultiParty(params);

    await deployer.deploy(StakeholderRegistry,
                          _collateralAddress,  // ERC20 address
                          _createContractViaNew, 
                          _expiringMultiPartyCreator,
                          _registry,
                          _finder)
                  .then(async function(stakeholderRegistry) {
                       if(ownerAddress && ownerAddress!="") {
                           console.log(`=== Transfering ownerhip to address ${ownerAddress} ===`)
                           await stakeholderRegistry.transferOwnership(ownerAddress);
                       }
                  });

    const stakeholderRegistry = await StakeholderRegistry.deployed();

    await registry.addMember(1, stakeholderRegistry.address);
    console.log("- Granted StakeholderRegistry contract right to register itself with DVM");
    await stakeholderRegistry.initialize();
    console.log("- StakeholderRegistry is registered");




    const iERC20 = await IERC20.at(_collateralAddress);  // _collateralAddress is ERC20 address

    //@dev - Transfer 2.1 DAI from deployer's address to contract address in advance
    await iERC20.transfer(stakeholderRegistry.address, depositedAmount);
};
