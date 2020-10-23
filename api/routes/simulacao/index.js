const router = require('express').Router();
const { exec } = require("child_process");
const fs = require("fs");
const Simulacao = require('../../classes/Simulacao').Simulacao;
const Elbow = require('../../classes/Simulacao').Elbow;

router.post('/', async(req,res,next) => {
      
    try{
        console.log(req.body)
        const data = req.body;
        const simulacao = new Elbow(data);
        const number = await simulacao.run()
        aeait = simulacao.setParameters()
        res.status(201);
        res.send({"simulation" : simulacao , "number" : number});
    }catch(erro){
        next(erro);
    }  
});

module.exports = router;