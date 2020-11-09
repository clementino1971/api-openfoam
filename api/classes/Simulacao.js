const { exec } = require("child_process");
const fs = require("fs");

const path_vtks = "/home/thailsson/Projetos/test/";
const time_limit = 5;

class Simulacao {
  
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

    async delete(number){
        setTimeout(() =>{
           this.execShellCommand(`rm -r ${path_vtks}${number}`)
        }   
        , time_limit*60000);
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

    async writeDict(data,file){
        return new Promise((resolve, reject) =>{
            fs.writeFile(file, data, (err) => {
                if (err) {
                    return reject(err);
                }
                
                resolve("OK");
            });
        });
    }

    async setParameters(){
        let data = await this.readDictU();
        let resp = await this.writeDict(data,`./cases/${this.name}/0/U`);
        
        if(resp != "OK"){
            return "Erro ao Escrever Dicionario U!";
        }     

        data = await this.readDictNu();
        resp = await this.writeDict(data,`./cases/${this.name}/constant/transportProperties`);

        if(resp != "OK"){
            return "Erro ao Escrever Dicionario nu!";
        } 
    }
}

module.exports = Simulacao;