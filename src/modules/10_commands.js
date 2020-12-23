const Module = require('../classes/module.js');

class CommandsModule extends Module {
    
    commands = [];
    

    constructor(client) {
        super(client, {
            name: 'Commands'
        });
        this.loadCommands();
        this.commandCather();
    }

    commandCather() {
        this.client.on('message', message => {
            if (message.author.id != this.client.user.id && !message.author.bot) {
                if (message.content.startsWith(this.client.prefix)) {
                    let args = message.content.slice(this.client.prefix.length).trim().split(/ +/g);
                    let commandSlug = args[0];
                    let command = this.commands.find(c => c.settings.slug == commandSlug);
                    if (command) {
                        command.execute(message, args.slice(1), this.client.modules);
                    } else {
                        message.channel.send('Unrecognized command');
                    }
                }
            }
        });
    }
8
    loadCommands() {                
        console.log('Loading commands...');
        let commandDir =  '../commands';
        let normalizedPath = require("path").join(__dirname, commandDir);
        require("fs").readdirSync(normalizedPath).forEach((file) => {
            console.log(this.client.user.id);
            let command = new (require(`${commandDir}/${file}`))(this.client);
            this.commands.push(command);            
        });
    }
}

module.exports = CommandsModule;