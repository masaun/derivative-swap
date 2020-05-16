const Finder = artifacts.require("Finder");

module.exports = async function(deployer, network, accounts) {
    const deployerAddress = accounts[0];

    await deployer.deploy(Finder, { from: deployerAddress });
};
