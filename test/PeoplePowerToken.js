const PeoplePowerToken = artifacts.require("PeoplePowerToken");

contract('PeoplePowerToken',  function(accounts) {

    var tokenInstance;
    var fromAccount;
    var toAccount;
    var spenderAccount; 

    it('Initialise correct atributes', function() {
        return PeoplePowerToken.deployed()
            .then(function(instance) {
                tokenInstance = instance;
                return tokenInstance.name();
            }).then(function(name){
                assert.equal(name, "People Power", 'Initialize corect name')
                return tokenInstance.symbol();
            }).then(function(symbol){
                assert.equal(symbol, "PPD", 'Initialize corect symbol')
                return tokenInstance.version();
            }).then(function(version){
                assert.equal(version, "v1.0", 'Initialize corect version')
            })  
    })

    it('Sets total supply of tokens', function() {
        return PeoplePowerToken.deployed()
            .then(function(instance) {
                tokenInstance = instance;
                return tokenInstance.totalSupply();
            }).then(function(totalSupply){
                assert.equal(totalSupply.toNumber(), 100000000000, 'Supply set to 100 bilion')
                return tokenInstance.balanceOf(accounts[0]);
            }).then(function(adminBalance){
                assert.equal(adminBalance.toNumber(), 100000000000, 'Initial supply alocated to admin address')
            })
    })

    it('transfers token', function() {
        return PeoplePowerToken.deployed()
        .then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.transfer.call(accounts[1], 100000000001)
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, "error message contains revert")
            return tokenInstance.transfer.call(accounts[1], 25000, {from: accounts[0]})
        }).then(function(success){
            assert.equal(success, true, 'returns correct boolean')
            return tokenInstance.transfer(accounts[1], 25000, {from: accounts[0]})
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, 'one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'Transfer event exist');
            assert.equal(receipt.logs[0].args._from, accounts[0], 'logs sender');
            assert.equal(receipt.logs[0].args._to, accounts[1], 'logs reciever');
            assert.equal(receipt.logs[0].args._value, 25000, 'logs amount');
            return tokenInstance.balanceOf(accounts[1])
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 25000, 'amount transfered correctly');
            return tokenInstance.balanceOf(accounts[0])
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 99999975000, 'amount recieved correctly');
        })                              
    })

    it('approve transfer tokens', function() {
        return PeoplePowerToken.deployed()
        .then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.approve.call(accounts[1], 100)
        }).then(function(success){
            assert.equal(success, true, 'returns correct boolean')
            return tokenInstance.approve(accounts[1], 100, { from: accounts[0] })
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, 'one event');
            assert.equal(receipt.logs[0].event, 'Approval', 'Approval event exist');
            assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs transfer authorized by');
            assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs transver authoraized to');
            assert.equal(receipt.logs[0].args._value, 100, 'logs amount');
            return tokenInstance.allowance(accounts[0], accounts[1])
        }).then(function(allowance) {
            assert.equal(allowance.toNumber(), 100, 'set allowance for account')
        })                             
    })

    it('handles delegated transfer', function() {
        return PeoplePowerToken.deployed()
        .then(function(instance) {
            tokenInstance = instance;
            fromAccount = accounts[2]
            toAccount = accounts[3]
            spenderAccount = accounts[4]
            return tokenInstance.transfer(fromAccount, 100, { from: accounts[0] })
        }).then(function(receipt){
            return tokenInstance.approve(spenderAccount, 10, { from: fromAccount })
        }).then(function(receipt){
            return tokenInstance.transferFrom(fromAccount, toAccount, 999, { from: spenderAccount })
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, "error message contains revert")
            return tokenInstance.transferFrom(fromAccount, toAccount, 21, { from: spenderAccount })
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, "not transfering amount larger than approved")
            return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, { from: spenderAccount })
        }).then(function(success){
            assert.equal(success, true, 'returns correct boolean')
            return tokenInstance.transferFrom(fromAccount, toAccount, 10, { from: spenderAccount })
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, 'one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'Transfer event exist');
            assert.equal(receipt.logs[0].args._from, fromAccount, 'logs sender');
            assert.equal(receipt.logs[0].args._to, toAccount, 'logs reciever');
            assert.equal(receipt.logs[0].args._value, 10, 'logs amount');
            return tokenInstance.balanceOf(fromAccount)
        }).then(function(balance){
            assert.equal(balance, 90, 'deducts balance correctly')
            return tokenInstance.balanceOf(toAccount)
        }).then(function(balance){
            assert.equal(balance, 10, 'adds balance correctly')
            return tokenInstance.allowance(fromAccount, spenderAccount)
        }).then(function(allowance) {
            assert.equal(allowance.toNumber(), 00, 'deduct correct mount from allowance')
        })               
    })
});
 