const Sequelize = require('sequelize');
const db = require('../index');
const PaymentType = require ('./PaymentType');

const User = db.define('User', {
    countryCode: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    fullName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }

});

User.findByEmail = function (email) {
    return User.findOne ({
        where: {email}
    })
}

User.findByPhoneAndPlatform = function (phone, platform) {
    console.log("in user phone and platform", phone, platform);
    return User.findOne ({
        where: {phone}
    }).then (user => {
        console.log("user in promise", user?'user is not null':user)
        if (!user) return null;
        return PaymentType.findByUserIdAndPlatform(user.id, platform)
        .then (paymentType => {
            console.log("looking up payment type for user id", user.id);
            user['paymentType'] = paymentType;
            return user;
        }).catch(console.log)
    })
    .catch (console.log);
}


module.exports = User;