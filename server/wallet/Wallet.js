const WalletTable = require('../db/models').Wallet;

class Wallet {
    constructor () {
        this.net = 0;
    }
    receivePayment(amount, platform,transactionId) {
        this.net += amount;
        this.store(amount, platform, transactionId, false)
    }
    sendPayment(amount, platform, transactionId) {
        this.net -= amount;
        this.store(amount, platform, transactionId, true)
    }
    store(amount, platform, transactionId, isDebit) {
        WalletTable.create({amount, platform, transactionId, isDebit}).then(() => console.log('GREAT SUCCESS'))
    }
}

module.exports = Wallet;



//this wallet does two things;

//1. Track current net account balance of master account;
//This balance should ALWAYS be zero. Whatever is paid on one end should be transferred out on the other

//2. This will also track the transactions with logs of the exchanges. 

