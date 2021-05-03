const ArkToken = artifacts.require("ArkToken");

module.exports = function (deployer) {
  deployer.deploy(ArkToken);
};
