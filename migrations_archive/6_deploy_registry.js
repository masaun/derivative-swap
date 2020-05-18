const Registry = artifacts.require("Registry");
const Finder = artifacts.require("Finder");
const { interfaceName } = require("../utils/Constants.js");


module.exports = async function(deployer, network, accounts) {
    const deployerAddress = accounts[0];

    await deployer.deploy(Registry, { from: deployerAddress });
    const registry = Registry.address;

    const finder = await Finder.deployed();
    await finder.changeImplementationAddress(web3.utils.utf8ToHex(interfaceName.Registry), registry, {
        from: deployerAddress
    });

};
