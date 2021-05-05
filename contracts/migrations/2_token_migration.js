const Arktoken = artifacts.require("Arktoken");

module.exports = function (deployer) {
  deployer.deploy(Arktoken);
};
