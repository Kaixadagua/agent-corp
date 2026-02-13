/**
 * Barrel exports para componentes
 * Facilita importação centralizada
 * 
 * @module components
 */

// Importar todos os componentes automaticamente
const fs = require('fs');
const path = require('path');

const components = {};

// Ler todos os arquivos .jsx do diretório
const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const name = path.basename(file, '.jsx');
  components[name] = require(`./${file}`);
});

module.exports = components;
