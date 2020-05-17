const AddressWhitelist = artifacts.require("AddressWhitelist");

//@dev - Import from exported file
var walletAddressList = require('./walletAddress/walletAddress.js');


module.exports = async function(deployer, network, accounts) {
    const deployerAddress = accounts[0];
    
    // Initialize owner address if you want to transfer ownership of contract to some other address
    let ownerAddress = walletAddressList["WalletAddress1"];

    await deployer.deploy(AddressWhitelist, { from: deployerAddress });
    // await deployer.deploy(AddressWhitelist).then(async function(addressWhitelist) {
    //     if(ownerAddress && ownerAddress!="") {
    //         console.log(`=== Transfering ownerhip to address ${ownerAddress} ===`)
    //         await addressWhitelist.transferOwnership(ownerAddress);
    //     }
    // });
};
