const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('config')

app.use(bodyParser.json());

const router = require('./routes/cavity');
app.use('/api/cavity', router);

app.use((erro, req, res, next) => {
    let status = 400;

    res.status(status);
    res.send({mensagem: erro.message})
});

app.listen(config.get('api.porta'), () => console.log("Pai Tá ON!!"));
