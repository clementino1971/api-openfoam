const PropertiesReader = require('properties-reader');
const prop = PropertiesReader('api-openfoam/app.properties');

getProperty = (pty) => {return prop.get(pty);}

module.exports = getProperty;