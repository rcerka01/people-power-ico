const PeoplePowerToken = artifacts.require("PeoplePowerToken");

module.exports = function (deployer) {
  deployer.deploy(PeoplePowerToken);
};
