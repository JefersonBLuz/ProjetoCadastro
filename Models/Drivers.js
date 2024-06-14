const db = require('./db');

const drivers = db.sequelize.define('drivers', {
    nomeCondutor: {
        type: db.Sequelize.STRING
    },
    cpfCondutor: {
        type: db.Sequelize.INTEGER
    },
    cnh: {
        type: db.Sequelize.INTEGER
    },
    cep: {
        type: db.Sequelize.INTEGER
    },
    logradouro: {
        type: db.Sequelize.STRING
    },
    bairro: {
        type: db.Sequelize.STRING
    },
    numero: {
        type: db.Sequelize.INTEGER
    },
    complemento: {
        type: db.Sequelize.STRING
    },
    fileimg: {
        type: db.Sequelize.STRING
    }
});

// drivers.sync({ force: true });

module.exports = drivers;