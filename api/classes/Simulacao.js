const { exec } = require("child_process");
const fs = require("fs");

class Simulacao {
    /*constructor({name,solver}){
        this.name = name;
        this.solver = solver;
    }*/

    async run(){
        console.log(this.name);

        await this.execShellCommand(`./cases/'${this.name}'/Allrun`);
        const resp = await this.checkSucess();

        if(resp !== 'End'){
            throw new Error("Erro ao rodar simulação");
        }

        let number =  Math.floor(Math.random() * 1000000000);

        await this.execShellCommand(`./cases/'${this.name}'/SendVTK '${number}'`);
        await this.execShellCommand(`./cases/'${this.name}'/Allclean`);

        return number;
    }

    execShellCommand(cmd) {
        return new Promise((resolve, reject) => {
         exec(cmd, (error, stdout, stderr) => {
          if (error) {
           reject(error);
          }
          resolve(stdout ? stdout : stderr);
         });
        });
    }

    checkSucess(){
        return new Promise((resolve, reject) =>{
            fs.readFile(`./cases/${this.name}/log.${this.solver}`, 'utf8', (err,data) => {
                if (err) {
                    return reject(err);
                }
                data = data.split(" ");
                data = data[data.length-1];
                data = data.split("\n")[2];
    
                resolve(data);
            });
        });
    }
}

class Elbow extends Simulacao{
    constructor({name,solver,parameters}){
        super();
        this.name = name;
        this.solver = solver;
        this.parameters = parameters;
    }

    async setParameters(){
        const resp = await this.setVelocity();
        console.log(resp);
    }

    setVelocity(){
        return new Promise((resolve, reject) =>{
            fs.readFile(`./cases/${this.name}/0/U`, 'utf8', (err,data) => {
                if (err) {
                    return reject(err);
                }
        
                resolve(data);
            });
        });
    }
} 

module.exports = {
    Simulacao: Simulacao,
    Elbow: Elbow
};