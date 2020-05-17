var ExpiringMultiParty = artifacts.require("ExpiringMultiParty");
var Finder = artifacts.require("Finder");
var TokenFactory = artifacts.require("TokenFactory");


//@dev - Import from exported file
var tokenAddressList = require('./tokenAddress/tokenAddress.js');
var contractAddressList = require('./contractAddress/contractAddress.js');
var walletAddressList = require('./walletAddress/walletAddress.js');

const DAI_ADDRESS = tokenAddressList["Rinkeby"]["DAI"];   // DAI address on Kovan
const FINDER_ADDRESS = contractAddressList["Kovan"]["UMA"]["Finder"];
const TOKEN_FACTORY_ADDRESS = contractAddressList["Kovan"]["UMA"]["TokenFactory"];

const constructorParams = { expirationTimestamp: "1590969600",      // "1588291200" is 2020-06-01T00:00:00.000Z
                            withdrawalLiveness: "1000",
                            collateralAddress: DAI_ADDRESS,
                            finderAddress: FINDER_ADDRESS,
                            tokenFactoryAddress: TOKEN_FACTORY_ADDRESS,                             
                            priceFeedIdentifier: web3.utils.utf8ToHex("UMATEST"), 
                            syntheticName: "Test UMA Token", 
                            syntheticSymbol: "UMATEST", 
                            liquidationLiveness: "1000",
                            collateralRequirement: { rawValue: web3.utils.toWei("1.5") },  //@notice - assigned value must be greater than "1"
                            disputeBondPct: { rawValue: web3.utils.toWei("0.1") }, 
                            sponsorDisputeRewardPct: { rawValue: web3.utils.toWei("0.1") }, 
                            disputerDisputeRewardPct: { rawValue: web3.utils.toWei("0.1") }, 
                            minSponsorTokens: { rawValue: web3.utils.toWei("0.01") }, 
                            timerAddress: '0x0000000000000000000000000000000000000000' }



module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(ExpiringMultiParty, constructorParams);


};
