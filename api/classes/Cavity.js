const Simulacao = require('./Simulacao');
const fs = require("fs");
const getProperty = require('../properties.js')

const home = getProperty('app.home');

class Cavity extends Simulacao{
    constructor({name,solver,parameters}){
        super();
        this.name = name;
        this.solver = solver;
        this.parameters = parameters;
    }

    readDictU(){
        return new Promise((resolve, reject) =>{
            fs.readFile(`${home}api-openfoam/cases/${this.name}/0/U`, 'utf8', (err,data) => {
                if (err) {
                    return reject(err);
                }
                
                let array = data.toString().split("\n");

                // Inlet 5
                let linha = array[25].split(" ");
                linha[linha.length - 3] = linha[linha.length - 3][0] + this.parameters.U.toString();
                array[25] = linha.join(' ');

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

                // Inlet 5
                let linha = array[17].split(" ");
                let n = linha[linha.length - 1].length;
                linha[linha.length - 1] = this.parameters.nu.toString() + linha[linha.length - 1][n-1];
                array[17] = linha.join(' ');

                resolve(array.join("\n"));
            });
        });
    }
} 

module.exports = Cavity;