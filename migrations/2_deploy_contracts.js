const PeoplePowerToken = artifacts.require("PeoplePowerToken");
const PeoplePowerTokenSale = artifacts.require("PeoplePowerTokenSale");

module.exports = function (deployer) {
  deployer.deploy(PeoplePowerToken, 100000000000).then(function() {
    let tokenPrice = 1000000;
    return deployer.deploy(PeoplePowerTokenSale, PeoplePowerToken.address, tokenPrice);
  });
};
