const { exec } = require("child_process");
const fs = require("fs");

const getProperty = require('../properties.js')

const home = getProperty('app.home');
const path_vtks = getProperty('app.path_vtks');
const time_limit = getProperty('app.time_limit');

class Simulacao {

    readDictU(){
        return new Promise((resolve, reject) =>{
            resolve(null);
        });
    }

    readDictNu(){
        return new Promise((resolve, reject) =>{
            resolve(null);
        });
    }

    readDictp(){
        return new Promise((resolve, reject) =>{
            resolve(null);
        });
    }
  
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

        
        await this.execShellCommand(`${home}api-openfoam/cases/'${this.name}'/SendVTK '${number}' ${home}`);
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
            if(data == null){
                resolve("OK");
            }else{
                fs.writeFile(file, data, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    
                    resolve("OK");
                });
            }    
            
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

        data = await this.readDictp();
        resp = await this.writeDict(data,`${home}api-openfoam/cases/${this.name}/0/p`);

        if(resp != "OK"){
            throw new Error("Erro ao Escrever Dicionario p!");
        } 
    }
}

module.exports = Simulacao;
