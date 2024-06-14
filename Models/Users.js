const db = require('./db');

const users = db.sequelize.define('users', {
    user: {
        type: db.Sequelize.STRING
    },
    password: {
        type: db.Sequelize.STRING
    }
});

// users.sync({ force: true });
users.create({
    user: 'admin',
    password: 'admin'
})

module.exports = users;