const Registry = artifacts.require("Registry");

module.exports = async function(deployer, network, accounts) {
    const deployerAddress = accounts[0];

    await deployer.deploy(Registry, { from: deployerAddress });
};
