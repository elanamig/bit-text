const db = require ("./server/db");
const User = require("./server/db/models/User");
const Message = require("./server/db/models/Message");

const users = [
    {
        fullName: 'Elana Abelev',
        email: 'elanamig@gmail.com',
        phone: '9174594647',
        password: '12345678',
        countryCode: '1'
    },
    {
        fullName: 'Snow FoSho',
        email: 'snowfosho1@gmail.com',
        phone: '9174592589',
        password: '12345678',
        countryCode: '1'
    }
]


const seed = () => {
    const usersPromise = users.map(user => User.create(user));
    
    return Promise.all (usersPromise)
    .then( (userData) => {
        console.log("Users created");
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