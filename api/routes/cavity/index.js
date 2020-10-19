const router = require('express').Router();
const { exec } = require("child_process");
const fs = require("fs");
const Simulacao = require('../../classes/Simulacao');

router.post('/', async(req,res,next) => {
      
    try{
        const data = req.body;
        const cavity = new Simulacao(data);
        await cavity.run()
        res.status(201);
        res.send(cavity);
    }catch(erro){
        next(erro);
    }  
});

module.exports = router;