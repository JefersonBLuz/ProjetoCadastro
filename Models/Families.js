const db = require('./db');

const families = db.sequelize.define('families', {
    nomeResponsavel: {
        type: db.Sequelize.STRING,
    },
    cpfResponsavel: {
        type: db.Sequelize.STRING
    },
    quantidadeFamilia: {
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

// families.sync({ force: true });

module.exports = families;