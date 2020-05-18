var ExpiringMultiPartyViaNew = artifacts.require("ExpiringMultiPartyViaNew");

var ExpiringMultiPartyLib = artifacts.require("ExpiringMultiPartyLib");
var Finder = artifacts.require("Finder");
var AddressWhitelist = artifacts.require("AddressWhitelist");
var TokenFactory = artifacts.require("TokenFactory");
var Registry = artifacts.require("Registry");


//@dev - Import from exported file
var tokenAddressList = require('./tokenAddress/tokenAddress.js');
var contractAddressList = require('./contractAddress/contractAddress.js');
var walletAddressList = require('./walletAddress/walletAddress.js');

const DAI = tokenAddressList["Kovan"]["DAI"];   // DAI address on Kovan
const FINDER = contractAddressList["Kovan"]["UMA"]["Finder"];
//const ADDRESS_WHITELIST = contractAddressList["Kovan"]["UMA"]["AddressWhitelist"];
const TOKEN_FACTORY = contractAddressList["Kovan"]["UMA"]["TokenFactory"];
const TIMER = '0x0000000000000000000000000000000000000000';
//const REGISTRY = contractAddressList["Kovan"]["UMA"]["Registry"];

// const constructorParams = { expirationTimestamp: "1590969600",      // "1588291200" is 2020-06-01T00:00:00.000Z
//                             withdrawalLiveness: "1000",
//                             collateralAddress: DAI,
//                             finderAddress: FINDER,
//                             tokenFactoryAddress: TOKEN_FACTORY,                             
//                             priceFeedIdentifier: web3.utils.utf8ToHex("UMATEST"), 
//                             syntheticName: "Test UMA Token", 
//                             syntheticSymbol: "UMATEST", 
//                             liquidationLiveness: "1000",
//                             collateralRequirement: { rawValue: web3.utils.toWei("1.5") },  //@notice - assigned value must be greater than "1"
//                             disputeBondPct: { rawValue: web3.utils.toWei("0.1") }, 
//                             sponsorDisputeRewardPct: { rawValue: web3.utils.toWei("0.1") }, 
//                             disputerDisputeRewardPct: { rawValue: web3.utils.toWei("0.1") }, 
//                             minSponsorTokens: { rawValue: web3.utils.toWei("0.01") }, 
//                             timerAddress: '0x0000000000000000000000000000000000000000' }


module.exports = async function(deployer, network, accounts) {

    // Add collateralToken(=DAI) into whitelists.
    await deployer.deploy(AddressWhitelist);
    const collateralCurrencyWhitelist = await AddressWhitelist.deployed();
    await collateralCurrencyWhitelist.addToWhitelist(DAI);
    console.log('=== pass ===')

    await deployer.deploy(ExpiringMultiPartyLib);
    await deployer.link(ExpiringMultiPartyLib, ExpiringMultiPartyViaNew);

    await deployer.deploy(ExpiringMultiPartyViaNew, 
                          FINDER, 
                          AddressWhitelist.address, 
                          TOKEN_FACTORY, 
                          TIMER);
    //await deployer.deploy(ExpiringMultiPartyViaNew, constructorParams);

    // Add Role 
    await deployer.deploy(Registry);
    const _roleId = 1
    const registry = await Registry.deployed();
    await registry.addMember(_roleId, ExpiringMultiPartyViaNew.address);
    console.log("- Granted ExpiringMultiPartyViaNew contract right to register itself with DVM");

    const checkRole2 = await registry.holdsRole(_roleId, ExpiringMultiPartyViaNew.address);
    console.log("=== checkRole of ExpiringMultiPartyViaNew.sol ===", checkRole2);  // [Result]: True
};
