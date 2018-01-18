'use strict'
const Sequelize = require('sequelize');
const db = require('../index');

module.exports = db.define('Message', {
    sender: {
        type: Sequelize.STRING,
        allowNull: false
    },
    recipient: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: true
    }
})