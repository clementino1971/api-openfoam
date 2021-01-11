const router = require('express').Router();
const Cavity = require('../../classes/Cavity');
const Elbow = require('../../classes/Elbow');

router.get('/', async(req,res,next) =>{
	res.send({"py": "tá on!"})
});

router.post('/', async(req,res,next) => {
      
    try{
        const data = req.body;

        let simulacao;

        switch (data.name) {
            case 'elbow':
                simulacao = new Elbow(data);
                break;
            
            case 'cavity':
                simulacao = new Cavity(data);
                break;    

            default:
                throw new Error("Case Não está definido!" + data.name);
        }

        
        await simulacao.setParameters()
        const number = await simulacao.run()
        simulacao.delete(number);
        res.status(201);
        res.send({"simulation" : simulacao, "number": number});
    }catch(erro){
        next(erro);
    }  
});

module.exports = router;
