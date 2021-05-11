const LatinArkContract = artifacts.require("LatinArkContract");

module.exports = function (deployer) {
  deployer.deploy(LatinArkContract);
};
