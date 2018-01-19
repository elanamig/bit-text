const Sequelize = require('sequelize');
const db = require('../index');

const PaymentType = db.define('PaymentType', {
    platform: {
        type: Sequelize.ENUM('STRIPE', 'PAYPAL', 'DWOLLA'),
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

PaymentType.findByUserIdAndPlatform = function (userId, platform) {
    if (platform) {
        return PaymentType.findOne ({
            where: { userId, platform: platform.toUpperCase()}
        })
    } else {
        return PaymentType.findOne ({
            where: {userId, isDefault: true}
        })
    }
}
module.exports = PaymentType