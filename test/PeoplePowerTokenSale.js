const PeoplePowerTokenSale = artifacts.require("PeoplePowerTokenSale");

contract('PeoplePowerTokenSale',  function(accounts) {

    var tokenSaleInstance;
    var setPrice = 1000000;

    it('Initialise sale contract', function() {
        return PeoplePowerTokenSale.deployed()
            .then(function(instance) {
                tokenSaleInstance = instance;
                return tokenSaleInstance.address;
            }).then(function(address){
                assert.notEqual(address, 0x0, 'Has contract address')
                return tokenSaleInstance.tokenContract();
            }).then(function(address){
                assert.notEqual(address, 0x0, 'Has token contract address')
                return tokenSaleInstance.tokenPrice()
            }).then(function(price) {
                assert.equal(price, setPrice, 'Returns correct token price')
            })
    })
});
