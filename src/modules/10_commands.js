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
            if (!message.guild) return;
            if (message.author.id != this.client.user.id && !message.author.bot) {
                if (message.content.startsWith(this.client.prefix)) {
                    let args = message.content.toLowerCase().slice(this.client.prefix.length).trim().split(/ +/g);
                    let commandSlug = args[0];
                    let command = this.commands.find(c => c.settings.slug.toLowerCase() == commandSlug);
                    if (command) {
                        command.execute(message, args.slice(1), this.client.modules);
                    } else {
                        if (this.client.unrecognized_command) {
                            message.channel.send('Unrecognized command');
                        }
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
            let command = new (require(`${commandDir}/${file}`))(this.client);
            this.commands.push(command);            
        });
    }
}

module.exports = CommandsModule;