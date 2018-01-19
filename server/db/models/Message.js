'use strict'
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../index');

const Message = db.define('Message', {
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

Message.findAllByUserId = (userId, isPayer, isPayee) => {
    let where;
    //if no payee/payer flag is specified or both are specified, include both
    if (! (isPayee && isPayer) || (isPayee && isPayer)) where = { [Op.or]: [{payerId: userId},{payeeId: userId}]}
    else if (isPayee) where = { payeeId: userId}
    else if (isPayer) where = { payerId: userId }
    
    return Message.findAll({where, order: [['createdAt', 'DESC']]})
}

Message.findByIdAndUserId = (id, userId) => {
    return Message.findOne ({
        where: {
            id,
            [Op.or]: [{payerId: userId},{payeeId: userId}]
        }
    })
}

module.exports = Message;