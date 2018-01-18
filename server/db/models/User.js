const Sequelize = require('sequelize');
const db = require('../index');

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

module.exports = User;