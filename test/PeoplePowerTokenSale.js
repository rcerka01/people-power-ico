const PeoplePowerToken = artifacts.require("PeoplePowerToken");
const PeoplePowerTokenSale = artifacts.require("PeoplePowerTokenSale");

contract('PeoplePowerTokenSale',  function(accounts) {

    var tokenInstance;
    var tokenSaleInstance;
    var setPrice = 1000000;
    var admin = accounts[0];
    var buyer = accounts[1];
    var numberOfTokens = 10;
    var tokensAvailable = 50000000000;
    var tokensUnavailable = tokensAvailable + 1;

    it('Initialise sale contract', function() {
        return PeoplePowerTokenSale.deployed()
            .then(function(instance) {
                tokenSaleInstance = instance;
                return tokenSaleInstance.address;
            }).then(function(address){
                assert.notEqual(address, 0x0, 'has contract address')
                return tokenSaleInstance.tokenContract();
            }).then(function(address){
                assert.notEqual(address, 0x0, 'has token contract address')
                return tokenSaleInstance.tokenPrice()
            }).then(function(price) {
                assert.equal(price, setPrice, 'returns correct token price')
            })
    })

    it('Can buy tokens', function() { 
        return PeoplePowerToken.deployed()
            .then(function(instance) {
                tokenInstance = instance;
                return PeoplePowerTokenSale.deployed()
            }).then(function(instance) {
                tokenSaleInstance = instance;
                return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, { from: admin });
            }).then(function(receipt) {
                let value = numberOfTokens * setPrice;
                return tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer, value: value});
            }).then(function(receipt){
                assert.equal(receipt.logs.length, 1, 'one event');
                assert.equal(receipt.logs[0].event, 'Sell', 'Sell event exist');
                assert.equal(receipt.logs[0].args._buyer, buyer, 'logs sender');
                assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs amount');
                return tokenSaleInstance.tokensSold();
            }).then(function(amount) {
                assert.equal(amount.toNumber(), numberOfTokens, 'set correct amount of tokens sold')
                return tokenInstance.balanceOf(buyer);
            }).then(function(balance) {
                assert.equal(balance.toNumber(), numberOfTokens, 'buyer balance increments correctly')
                return tokenInstance.balanceOf(tokenSaleInstance.address);
            }).then(function(balance) {
                assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens), 'selers balance decrements correctly';
                let value = tokensUnavailable * setPrice;
                return tokenSaleInstance.buyTokens(tokensUnavailable, { from: buyer, value: value });
            }).then(assert.fail).catch(function(error) {
                assert(error.message.indexOf('revert') >= 0, "can not buy more tokens than available")
                return tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer, value: 1});   
            })
            .then(assert.fail).catch(function(error) {
                assert(error.message.indexOf('revert') >= 0, "amount sent cannot be less than token price") 
            })            
    })    
    
    it('End token sale', function() { 
        return PeoplePowerToken.deployed()
            .then(function(instance) {
                tokenInstance = instance;
                return PeoplePowerTokenSale.deployed()
            }).then(function(instance) {
                tokenSaleInstance = instance;
                return tokenSaleInstance.endSale({ from: buyer });
            }).then(assert.fail).catch(function(error) {
                assert(error.message.indexOf('revert') >= 0, "can be called from admin account only") 
                return tokenSaleInstance.endSale({ from: admin });
            }).then(function(receipt) {
                return tokenInstance.balanceOf(admin)
            }).then(function(balance) {
                assert.equal(balance.toNumber(), 99999999990, 'return all remaining balance to admin');
                return tokenSaleInstance.tokenPrice()
            }).then(assert.fail).catch(function(error){})            
    })
});
