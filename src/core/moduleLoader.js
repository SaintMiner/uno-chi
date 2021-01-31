const fs = require('fs');
const path = require('path'); 
const glob = require('glob');
const decache = require('decache');

const { info, warn, error } = require('pretty-console-logs');

const modulesDirectory = '../modules';
const pathToModules = path.join(__dirname, modulesDirectory);

const ModuleClass = require('@core/classes/module');

class ModuleLoader {
    constructor() {
        this.badge = '[Module loader] ';
        this.modules = new Map();

        info(this.badge, 'Starting module loader...');
    }

    //Loads modules from modules directory
    loadModules() {
        info(this.badge, 'Loading modules...');

        
        if (!fs.existsSync(pathToModules)){
            warn(this.badge, 'Modules directory does not exist!');
            warn(this.badge, 'Creating directory...');
            fs.mkdir(pathToModules, (err) => { 
                if (err) { 
                    return error(this.badge, err); 
                } 
                info(this.badge, 'Created successfully');
            }); 
        }
        
        glob.sync( `${pathToModules}/*.js` ).forEach(( file ) => {
            let module = new (require(path.resolve( file )));

            //Checks if the required is module
            if (!(module instanceof ModuleClass)) return;
            
            if (!this.modules.has(module.name)) {
                this.modules.set(module.name, module);
            } else {
                warn(this.badge, `Module with class name "${module.name}" already exists. Using first!`);
            }
        });

        this.modules =  new Map([...this.modules].sort((a , b) => {
            if (a[1].order > b[1].order) return 1;
            if (a[1].order < b[1].order) return -1;
        }));
        
        info(this.badge, `Loaded [${this.modules.size}] modules`);        
        
    }

    async initModules() {
        info(this.badge, 'Initialising modules...');

        for await (let module of this.modules.values()) {
            info(`[${module.name}] Initialising`);
            await module.init();
        }
        
    }
}

module.exports = ModuleLoader;