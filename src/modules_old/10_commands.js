const Module = require('../classes/module.js');
const decache = require('decache');

class CommandsModule extends Module {
    
    commands = [];

    constructor(client) {
        super(client, {
            name: 'Commands module'
        });
        this.loadCommands();
        this.commandCatcher();
    }

    commandCatcher() {
        this.client.on('message', async message => {
            if (!message.guild) return;
            if (message.author.id != this.client.user.id && !message.author.bot) {
                if (message.content.startsWith(this.client.prefix)) {
                    let args = message.content.toLowerCase().slice(this.client.prefix.length).trim().split(/ +/g);
                    let commandSlug = args[0];
                    let command = this.getCommand(commandSlug);
                    if (command) {
                        command.execute(message, args.slice(1), this.client.modules);
                    } else if (this.client.unrecognizedCommand) {
                        message.channel.send(__('UNRECOGNIZED_COMMAND'));
                    }
                }
            }
        });
    }

    getCommand(slug) {
        return this.commands.find(command => command.slug.toLowerCase() == slug || command.aliases.includes(slug));
    }

    loadCommands() {
        console.log('\t\tLoading commands...');
        let commandDir =  '../commands';
        let normalizedPath = require("path").join(__dirname, commandDir);
        let count = 0;
        require("fs").readdirSync(normalizedPath).forEach((file) => {
            if(file.endsWith(`.js`)){
                let command = new (require(`${commandDir}/${file}`))(this.client);
                decache(file);
                this.commands.push(command);
                count++;            
            }
        });
        console.log(`\t\tLoaded ${count} commands...`);
        console.log(`\t\tRegistering [${this.name}] commands...`);
        this.client.commands = [];
        // this.commands.forEach(cmd => {
        //     let element = {
        //         slug: cmd.settings.slug,
        //         description: cmd.settings.description,
        //         alias: cmd.settings.alias,
        //         hidden: cmd.settings.hidden,
        //     }
        //     this.client.commands[`commands-${element.slug}`] = element;
        // })
        console.log('\t\tRegistered...');
    }
}

module.exports = CommandsModule;
