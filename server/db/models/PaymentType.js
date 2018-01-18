const Sequelize = require('sequelize');
const db = require('../index');

const PaymentType = db.define('PaymentType', {
    platform: {
        type: Sequelize.ENUM('STRIPE', 'PAYPAL'),
        allowNull: false
    },
    authkey: {
        type: Sequelize.STRING,
        allowNull: false
    },
    isDefault: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
})
module.exports = PaymentType