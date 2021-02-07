const fs = require('fs');
const path = require('path'); 
const glob = require('glob');
const decache = require('decache');

const { info, warn, error } = require('pretty-console-logs');

const Basic = require('./classes/basic');
const Extension = require('./classes/extension');

const extensionsDirectory = '../extensions';
const pathToExtensions = path.join(__dirname, extensionsDirectory);


class ExtensionLoader extends Basic {
    

    initialize() {
        let extensions = require(pathToExtensions);
        if (!Array.isArray(extensions)) return warn(`[${this.name}] Extensions file is not an array!`);

        extensions = extensions.filter(extension => this.isValidExtension(extension.extension));

        extensions = extensions.map(extension => {
            if (isNaN(extension.order)) extension.order = Infinity;
            return extension;
        });

        info(`[${this.name}] (${extensions.length}) extensions loaded`);        

        return extensions;
    }

    isValidExtension(extension) {
        let isValid = true;
        
        if (!(extension.prototype)) isValid = false;
        if (!(extension.prototype instanceof Extension)) isValid = false;

        return isValid;
    }
    
}

module.exports = ExtensionLoader;