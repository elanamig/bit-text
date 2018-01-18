const db = require ("./server/db");
const User = require("./server/db/models/User");
const Message = require("./server/db/models/Message");
const PaymentType = require('./server/db/models/PaymentType');
const users = [
    {
        fullName: 'Elana Abelev',
        email: 'elanamig@gmail.com',
        phone: '9174594647',
        password: '12345678',
        countryCode: '+1'
    },
    {
        fullName: 'Shmuel Lotman',
        email: 'shmuel.lotman@gmail.com',
        phone: '4142436597',
        password: '12345678',
        countryCode: '+1'
    }
]
const paymentType = [
    {
        platform: 'PAYPAL',
        authkey: 'elanamig@gmail.com',
        isDefault: 'true'
    },
    {
        platform: 'STRIPE',
        authkey: 'pk_test_wAVx4RwXFouYPAPajD91zzHb',
        isDefault: 'false'
    },
    {
        platform: 'PAYPAL',
        authkey: 'shmuel.lotman@gmail.com',
        isDefault: 'true'
    },
    {
        platform: 'STRIPE',
        authkey: 'pk_test_cgPI7VB68cXDrymX5rksQCyW',
        isDefault: 'false'
    }
]

const seed = () => {
    const usersPromise = users.map(user => User.create(user));
     Promise.all (usersPromise)
    .then( (userData) => {
        const paymentPromise = paymentType.map(type => PaymentType.create(type))
        console.log("Users created");
        Promise.all(paymentPromise)
        .then((payments) => {
            let userArr = [];
            payments.forEach((payment, i) => {
                if(i < 2) {
                    userArr.push(payment.setUser(userData[0]))
                } else {
                    userArr.push(payment.setUser(userData[1]))
                }
            })
            Promise.all(userArr).then(() => console.log('we done here?'))
        }).catch(errFunc)
    })
    .catch(errFunc) ;
}

const errFunc = (err) =>  {
    console.log('Error while seeding');
    console.log(err.stack);
  }

const main = () => {
    console.log('Syncing db...');
    db.sync({ force: true })
      .then(() => {
        console.log('Seeding databse...');
        return seed();
      })
      .catch(errFunc)
      .then(() => {
        db.close();
        return null;
      });
  };

  main();