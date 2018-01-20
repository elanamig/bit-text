'use strict'
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../index');
const User = require ('./User');
const Transaction = require ('./Transaction');
const PaymentType = require ('./PaymentType');
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
    },
    display: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }
})

Message.findAllByUserId = (userId, isPayer, isPayee) => {
    let where;
    //if no payee/payer flag is specified or both are specified, include both
    if (! (isPayee && isPayer) || (isPayee && isPayer)) where = { [Op.or]: [{payerId: userId},{payeeId: userId}]}
    else if (isPayee) where = { payeeId: userId}
    else if (isPayer) where = { payerId: userId }
    
    return Message.findAll({
        where, 
        order: [['createdAt', 'DESC']],
        include: [
            {model: User, as: 'payer' , attributes: ['fullName', 'email', 'phone']},
            {model: Transaction, include: [
                {model: PaymentType, as: 'paymentType', attributes: ['platform']}
            ], where: {payeeId: userId}
            }
        ],
    })
}

Message.findAllPayee = (userId) => {
    return Message.findAll ({ 
        where: {
            payeeId: userId, 
            payerId: {
                [Op.not]: null
            },
            display: true
        },
        include: [
            {model: User, as: 'payer' , attributes: ['fullName', 'email', 'phone']},
            {model: Transaction, include: [
                {model: PaymentType, as: 'paymentType', attributes: ['platform']}
            ], where: {payeeId: userId}
            }
        ],
        order: [['createdAt', 'DESC']]
    })
}

Message.findAllPayer = (userId) => {
    return Message.findAll ({ 
        where: {
            payerId: userId, 
            payeeId: {
                [Op.not]: null
            },
            display: true
        },
        include: [
            {model: User, as: 'payee' , attributes: ['fullName', 'email', 'phone']},
            {model: Transaction, include: [
                {model: PaymentType, as: 'paymentType', attributes: ['platform']}
            ], where: {payerId: userId}, required: false
            }
        ],
        order: [['createdAt', 'DESC']]
    })
}

Message.findByIdAndUserId = (id, userId) => {
    return Message.findOne ({
        where: {
            id,
            [Op.or]: [{payerId: userId},{payeeId: userId}]
        }
    })
}

Message.removeFromView = (userId, id, payee) => {
    const where = payee?{
        id,
        payeeId: userId
    }:{
        id,
        payerId: userId
    }
    return Message.update({display:false},{where}).then(msg => {
        console.log("updated message to display false?", msg);
        return msg;
    })
}
module.exports = Message;