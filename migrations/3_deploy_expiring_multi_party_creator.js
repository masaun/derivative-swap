const Finder = artifacts.require("Finder");
const ExpiringMultiPartyCreator = artifacts.require("ExpiringMultiPartyCreator");
const ExpiringMultiPartyLib = artifacts.require("ExpiringMultiPartyLib");
const AddressWhitelist = artifacts.require("AddressWhitelist");
const TokenFactory = artifacts.require("TokenFactory");
//const { getKeysForNetwork, deploy, enableControllableTiming } = require("../../common/MigrationUtils.js");
const Timer = artifacts.require("Timer");


//@dev - Import from exported file
var tokenAddressList = require('./tokenAddress/tokenAddress.js');
var contractAddressList = require('./contractAddress/contractAddress.js');
var walletAddressList = require('./walletAddress/walletAddress.js');

const _addressWhitelist = contractAddressList["Kovan"]["UMA"]["AddressWhitelist"];
const _finder = contractAddressList["Kovan"]["UMA"]["Finder"];
const _tokenFactory = contractAddressList["Kovan"]["UMA"]["TokenFactory"];
const _timer = "0x0000000000000000000000000000000000000000";
const _expiringMultiPartyLib = contractAddressList["Kovan"]["UMA"]["ExpiringMultiPartyLib"];


module.exports = async function(deployer, network, accounts) {
    // Initialize owner address if you want to transfer ownership of contract to some other address
    let ownerAddress = walletAddressList["WalletAddress1"];

    const deployerAddress = accounts[0];
    //const keys = getKeysForNetwork(network, accounts);
    const controllableTiming = _timer;

    // Deploy whitelists.
    const collateralCurrencyWhitelist = await AddressWhitelist.at(_addressWhitelist);
    const finder = await Finder.at(_finder);
    const tokenFactory = await TokenFactory.at(_tokenFactory);
    //const expiringMultiPartyLib = ExpiringMultiPartyLib.at(_expiringMultiPartyLib);

    // Deploy EMPLib and link to EMPCreator.
    await deployer.deploy(ExpiringMultiPartyLib);
    await deployer.link(ExpiringMultiPartyLib, ExpiringMultiPartyCreator);

    await deployer.deploy(ExpiringMultiPartyCreator,
                          finder.address,
                          collateralCurrencyWhitelist.address,
                          tokenFactory.address,
                          controllableTiming,
                          { from: deployerAddress }).then(async function(expiringMultiPartyCreator) {
        if(ownerAddress && ownerAddress!="") {
            console.log(`=== Transfering ownerhip to address ${ownerAddress} ===`)
            await expiringMultiPartyCreator.transferOwnership(ownerAddress);
        }
    });
};
