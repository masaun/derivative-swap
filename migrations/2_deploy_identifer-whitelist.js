const IdentiferWhitelist = artifacts.require("IdentifierWhitelist");

//@dev - Import from exported file
var walletAddressList = require('./walletAddress/walletAddress.js');


module.exports = async function(deployer, network, accounts) {
    // Initialize owner address if you want to transfer ownership of contract to some other address
    let ownerAddress = walletAddressList["WalletAddress1"];

    await deployer.deploy(IdentiferWhitelist).then(async function(identiferWhitelist) {
        if(ownerAddress && ownerAddress!="") {
            console.log(`=== Transfering ownerhip to address ${ownerAddress} ===`)
            await identiferWhitelist.transferOwnership(ownerAddress);
        }
    });
};
