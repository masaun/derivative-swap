var CreateContractViaNew = artifacts.require("CreateContractViaNew");

module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(CreateContractViaNew);
};
