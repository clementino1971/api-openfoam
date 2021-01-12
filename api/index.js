const express = require('express');
const app = express();
const cors = require('cors')

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    app.use(cors());
    next();
});


const bodyParser = require('body-parser');

app.use(bodyParser.json());

const router = require('./routes/simulacao');
app.use('/api/simulacao', router);

app.get('/', (req, res) => {
    res.send({"py": "tá on!"})
});

app.use((erro, req, res, next) => {
    let status = 400;

    res.status(status);
    res.send({mensagem: erro.message})
});

app.listen(3030, () => console.log("Pai Tá ON!!"));
