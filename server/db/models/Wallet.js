const Sequelize = require('sequelize');
const db = require('../index');

const Wallet = db.define('Wallet', {
    amount: {
        type: Sequelize.STRING,
        allowNull: false
    },
    platform: {
        type: Sequelize.STRING,
        allowNull: false
    },
    isDebit: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
})
module.exports = Wallet;