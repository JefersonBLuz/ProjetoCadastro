const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const handlebars = require("express-handlebars")
const path = require('path')
// Tables
const users = require('./Models/Users')
const families = require('./Models/Families')
const drivers = require('./Models/Drivers')
const multer = require("multer")
const session = require('express-session')

// npm install express body-parser express-handlebars express-session
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 dias 
}));

app.use(express.static(path.join(__dirname, "assets")));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.engine('hbs', handlebars.engine({
    defaultLayout: 'main',//arquivo principal em html
    // Habilitar dados para renderizar o each
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));

app.set('view engine', 'hbs');

// verificar se esta logado em todos urls, menos em sessionAllowPath[]
const router = express.Router();
const sessionAllowPath = ["", "/", "/login"]
app.use('/*', (req, res, next) => {
    if (sessionAllowPath.indexOf(req.baseUrl) === -1 && !req.session.isLoggedIn) return res.redirect("/#errorSession");
    next()
});
app.use('/', router);

app.get('/', (req, res) => {
    res.render("index")
})

app.post('/login', (req, res) => {
    users.findOne({ where: { user: req.body.user, password: req.body.password } }).then((result) => {
        if (result && result.user) {
            req.session.user = result.user
            req.session.isLoggedIn = true;
            req.session.save()
            res.redirect('/home')
        } else {
            res.redirect('/#errorLogin')
        }
    })
})
app.get('/logout', (req, res) => {
    req.session.isLoggedIn = false;
    req.session.save()
    res.redirect('/')
})
app.get('/home', (req, res) => {

    const bds = {
        families: null,
        drivers: null
    }
    families.findAll().then((post) => {
        bds.families = post
    });
    drivers.findAll().then((drivers) => {
        bds.drivers = drivers
    })
    res.render('logged', { bds });
})

app.get('/family', (req, res) => {

    res.render("signFamily")
})
app.get('/searchFamily', (req, res) => {

    families.findAll().then((post) => {
        res.render('searchFamily', { post: post })
    })
})
app.post('/search_familia', (req, res) => {

    const { Op, where } = require('sequelize');              // biblioteca de operadores
    const query = `${req.body.search}%`;// string de consulta
    families.findAll({ where: { nomeResponsavel: { [Op.like]: query } } })
        .then((post) => {
            res.render('searchFamily', { post: post })
        }).catch((error) => {
            res.render('error', { msg: error, rota: 'searchFamily' })
        })
})
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "assets/uploads")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })

app.post('/signFamily', upload.single('imagem'), (req, res) => {

    const imagem = req.file.originalname
    families.create({
        nomeResponsavel: req.body.nomeResponsavel,
        cpfResponsavel: req.body.cpfResponsavel,
        quantidadeFamilia: req.body.quantidadeFamilia,
        cep: req.body.cep,
        logradouro: req.body.logradouro,
        bairro: req.body.bairro,
        numero: req.body.numero,
        complemento: req.body.complemento,
        fileimg: imagem
    }).then(() => {
        res.render('sucessfull', { msg: 'Cadastrado com sucesso' })
    }).catch((erro) => {
        res.render('error', { msg: erro, rota: 'family' })
    })
})
app.get("/familia/:id", (req, res) => {  //testar a parte de edição

    families.findOne({ where: { id: req.params.id } })
        .then((post) => {
            res.render('editFamily', { post: post })
        }).catch(() => {
            res.redirect('/home')
        })
});
app.post('/familia', (req, res) => {

    families.findOne({ where: { id: req.body.id } }).then((post) => {
        post.nomeResponsavel = req.body.nomeResponsavel
        post.cpfResponsavel = req.body.cpfResponsavel
        post.quantidadeFamilia = req.body.quantidadeFamilia
        post.cep = req.body.cep
        post.logradouro = req.body.logradouro
        post.bairro = req.body.bairro
        post.numero = req.body.numero
        post.complemento = req.body.complemento
        post.save().then(() => { res.render('sucessfull', { msg: 'Atualizado com sucesso' }) })
    }).catch((error) => { res.render('error', { msg: error, rota: ('condutor/' + req.body.id) }) })
})
app.get("/delete_familia/:id", (req, res) => {

    families.destroy({ where: { 'id': req.params.id } })
        .then(() => {
            res.render('sucessfull', { msg: 'Condutor excluido com sucesso' })
        })
        .catch((erro) => {
            res.render('error', { msg: erro, rota: 'searchDrivers' })
        })
})
app.get('/drivers', (req, res) => {
    res.render("signDrivers")
})
app.post('/signDrivers', upload.single('imagem'), (req, res) => {
    const imagem = req.file.originalname
    drivers.create({
        nomeCondutor: req.body.nomeCondutor,
        cpfCondutor: req.body.cpfCondutor,
        cnh: req.body.cnh,
        cep: req.body.cep,
        logradouro: req.body.logradouro,
        bairro: req.body.bairro,
        numero: req.body.numero,
        complemento: req.body.complemento,
        fileimg: imagem
    }).then(() => {
        res.render('sucessfull', { msg: 'Cadastrado com sucesso' })
    }).catch((erro) => {
        res.render('error', { msg: erro, rota: 'drivers' })
    })
})
app.get("/condutor/:id", (req, res) => //testar a parte de edição
{
    drivers.findOne({ where: { id: req.params.id } })
        .then((post) => {
            res.render('editDrivers', { post: post })
        }).catch(() => {
            res.redirect('/home')
        })
});
app.post('/condutor', (req, res) => {
    drivers.findOne({ where: { id: req.body.id } }).then((post) => {
        post.nomeCondutor = req.body.nomeCondutor
        post.cpfCondutor = req.body.cpfCondutor
        post.cnh = req.body.cnh
        post.cep = req.body.cep
        post.logradouro = req.body.logradouro
        post.bairro = req.body.bairro
        post.numero = req.body.numero
        post.complemento = req.body.complemento
        post.save().then(() => { res.render('sucessfull', { msg: 'Atualizado com sucesso' }) })
    }).catch((error) => { res.render('error', { msg: error, rota: ('condutor/' + req.body.id) }) })
})
app.get("/delete_condutor/:id", (req, res) => {
    drivers.destroy({ where: { 'id': req.params.id } })
        .then(() => {
            res.render('sucessfull', { msg: 'Condutor excluido com sucesso' })
        })
        .catch((erro) => {
            res.render('error', { msg: erro, rota: 'searchDrivers' })
        })
})
app.get('/searchDrivers', (req, res) => {
    drivers.findAll().then((post) => {
        res.render('searchDrivers', { post: post })
    })
})
app.post('/search_drivers', (req, res) => {
    const { Op } = require('sequelize');              // biblioteca de operadores
    const query = `${req.body.search}%`;// string de consulta
    drivers.findAll({ where: { nomeCondutor: { [Op.like]: query } } })
        .then((post) => {
            res.render('searchDrivers', { post: post })
        }).catch((error) => {
            res.render('error', { msg: error, rota: 'searchDrivers' })
        })
})

app.get('/config', (req, res) => {
    res.render("signUsers")
})

app.post('/signUsers', (req, res) => {
    if (req.body.password == req.body.password1) {
        users.create({
            user: req.body.user,
            password: req.body.password
        }).then(() => {
            res.render('sucessfull', { msg: 'Cadastrado com sucesso' })
        }).catch((erro) => {
            res.render('error', { msg: erro, rota: 'drivers' })
        })
    } else {
        res.render('error', { msg: 'Senhas diferentes', rota: 'config' })
    }
})





require('dotenv').config()
app.listen(process.env.PORT, () => {
    console.log(`Conectado!\nURL: http://localhost:${process.env.PORT}`)
})