const Simulacao = require('./Simulacao');
const fs = require("fs");

const getProperty = require('../properties.js')

const home = getProperty('app.home');

class FlowInPoreSpace extends Simulacao{
    constructor({name,solver,parameters}){
        super();
        this.name = name;
        this.solver = solver;
        this.parameters = parameters;
    }

    readDictp(){
        return new Promise((resolve, reject) =>{
            fs.readFile(`${home}api-openfoam/cases/${this.name}/0/p`, 'utf8', (err,data) => {
                if (err) {
                    return reject(err);
                }
                
                let array = data.toString().split("\n");

                // Inlet 5
                let linha = array[30].split(" ");
                linha[linha.length - 1] = this.parameters.p.toString() + ";";
                array[30] = linha.join(' ');

                resolve(array.join("\n"));
            });
        });
    }

    readDictNu(){
        return new Promise((resolve, reject) =>{
            fs.readFile(`${home}api-openfoam/cases/${this.name}/constant/transportProperties`, 'utf8', (err,data) => {
                if (err) {
                    return reject(err);
                }
                
                let array = data.toString().split("\n");

                let linha = array[19].split(" ");
                linha[linha.length - 1] = this.parameters.nu.toString() + ";";
                array[19] = linha.join(' ');

                resolve(array.join("\n"));
            });
        });
    }
} 

module.exports = FlowInPoreSpace;