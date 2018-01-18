const Sequelize = require('sequelize');
const db = require('../index');

const Transaction = db.define('Transaction', {
    status: {
        type: Sequelize.ENUM('Rejected', 'Completed', 'In-Progress', 'Refund-Pending', 'Refunded')
    },
    comments: {
        type: Sequelize.TEXT
    },
    amount: {
        type: Sequelize.STRING
    }
})
module.exports = Transaction;