const Timer = artifacts.require("Timer");

module.exports = async function(deployer, network, accounts) {
    const deployerAddress = accounts[0];

    await deployer.deploy(Timer, { from: deployerAddress });
};
