const fs = require('fs');
const path = require('path'); 
const glob = require('glob');

const { info, warn, error } = require('pretty-console-logs');
const decache = require('decache');

const modulesDirectory = '/modules';
const pathToModules = path.join(__dirname, modulesDirectory);

class ModuleLoader {
    constructor(client) {
        this.badge = '[Module loader] ';
        this.client = client;
        this.client.modules = new Map();
        this.moduleCount = 0;
        info(this.badge, 'Starting module loader...');
    }

    loadModules() {
        info(this.badge, 'Loading modules...');

        //checks and creates modules directory
        if (!fs.existsSync(pathToModules)){
            warn(this.badge, 'Modules directory does not exist!');
            info(this.badge, 'Creating directory...');
            fs.mkdir(pathToModules, (err) => { 
                if (err) { 
                    return error(this.badge, err); 
                } 
                info(this.badge, 'Created successfully');
            }); 
        }
            
        glob.sync( `${pathToModules}/*.js` ).forEach(( file ) => {
            let module = require(path.resolve( file ));
            this.moduleCount++;
            info(module);
        });
    }
}

module.exports = ModuleLoader;