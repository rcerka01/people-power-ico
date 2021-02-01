const PeoplePowerToken = artifacts.require("PeoplePowerToken");

module.exports = function (deployer) {
  deployer.deploy(PeoplePowerToken, 100000000000);
};
