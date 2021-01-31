const _deploy_contracts = require("../migrations/2_deploy_contracts");

const PeoplePowerToken = artifacts.require("PeoplePowerToken");

contract('PeoplePowerToken',  function(accounts) {

    it('Sets total supply of tokens', function() {
        return PeoplePowerToken.deployed()
            .then(function(instance) {
                return instance.totalSupply();
            })
            .then(function(totalSupply){
                assert.equal(totalSupply.toNumber(), 100000000000, 'Supply set to 100 bilion')
            })
    })

});
