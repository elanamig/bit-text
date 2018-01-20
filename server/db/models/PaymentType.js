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
    console.log("PaymentType - find by userId and platform")
    if (platform) {
        console.log("PaymentPlatform:  looking up user by platform");
        return PaymentType.findOne ({
            where: { userId, platform: platform.toUpperCase()}
        }).catch(err => null)
    } else {
        console.log("PaymentPlatform:  looking up user by default");
        return PaymentType.findOne ({
            where: {userId, isDefault: true}
        }).catch (err => null)
    }
}
module.exports = PaymentType