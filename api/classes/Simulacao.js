const { exec } = require("child_process");
const fs = require("fs");

class Simulacao {
    constructor({name,solver}){
        this.name = name;
        this.solver = solver;
    }

    async run(){
        await this.execShellCommand(`./cases/'${this.name}'/Allrun`);
        const resp = await this.checkSucess();

        console.log("SAIU\n");

        if(resp !== 'End'){
            throw new Error("Erro ao rodar simulação");
        }
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

module.exports = Simulacao;