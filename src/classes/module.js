class Module {

    #name;
    $client;
    
    constructor(client, settings) {
        this.name = settings.name;
        this.client = client;
        this.initModule();
    }

    initModule() {
        console.log(`Initialising ${this.name} module...`);
    }
}

module.exports = Module;