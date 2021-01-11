const { exec } = require("child_process");
const fs = require("fs");


const home = "/home/clementino1971_2013/";
//const home = "/home/thailsson/Projetos/server/";
const path_vtks = "test/";
const time_limit = 15;//minutes

class Simulacao {
  
    async run(){
        console.log(this.name);
        try{
            await this.execShellCommand(`${home}api-openfoam/cases/'${this.name}'/Allclean`);
        }catch (error){
            
        }
        

        try {
            await this.execShellCommand(`${home}api-openfoam/cases/'${this.name}'/Allrun`);
        } catch (error) {
            throw new Error("Erro ao rodar simulação." 
            +"Provavelmente os parametros inseridos parecem não ser fisicamente compatíveis com o problema!");
        }

        let resp = await this.checkSucess();

        if(resp == undefined || resp !== 'End'){
            await this.execShellCommand(`${home}api-openfoam/cases/'${this.name}'/Allclean`);
            throw new Error("Erro ao rodar simulação." 
            +"Provavelmente os parametros inseridos parecem não ser fisicamente compatíveis com o problema!");
        }

        let number =  Math.floor(Math.random() * 1000000000);

        
        await this.execShellCommand(`${home}api-openfoam/cases/'${this.name}'/SendVTK '${number}'`);
        await this.execShellCommand(`${home}api-openfoam/cases/'${this.name}'/Allclean`);

        return number;
    }

    async delete(number){
        setTimeout(() =>{
           this.execShellCommand(`rm -r ${home}${path_vtks}${number}`)
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
            fs.readFile(`${home}api-openfoam/cases/${this.name}/log`, 'utf8', (err,data) => {
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
        let resp = await this.writeDict(data,`${home}api-openfoam/cases/${this.name}/0/U`);
        
        if(resp != "OK"){
            throw new Error("Erro ao Escrever Dicionario U!");
        }     

        data = await this.readDictNu();
        resp = await this.writeDict(data,`${home}api-openfoam/cases/${this.name}/constant/transportProperties`);

        if(resp != "OK"){
            throw new Error("Erro ao Escrever Dicionario nu!");
        } 
    }
}

module.exports = Simulacao;
