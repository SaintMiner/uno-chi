const extensions = require('../extensions');
const Basic = require('./classes/basic');
const ExtensionLoader = require('./extension-loader');

class ExtensionManager extends Basic {

    extensions = new Map();

    initialize() {
        this.extensionLoader = new ExtensionLoader();
        let extensions = this.extensionLoader.initialize();

        extensions = extensions.sort((a , b) => {
            if (a.order > b.order) return 1;
            if (a.order < b.order) return -1;
        });        
        
        extensions.forEach(extension => this.addExtension(extension.extension));
    }

    addExtension(extension) {
        this.extensions.set(extension.name, new extension());
    }

}

module.exports = ExtensionManager;