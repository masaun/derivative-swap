const TokenFactory = artifacts.require("TokenFactory");

module.exports = async function(deployer, network, accounts) {
    const deployerAddress = accounts[0];

    await deployer.deploy(TokenFactory, { from: deployerAddress });
};
