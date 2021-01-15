// const Module = require('../classes/module.js');

// class CommandsModule extends Module {
    
//     commands = [];
    

//     constructor(client) {
//         super(client, {
//             name: 'Commands'
//         });
//         this.loadCommands();
//         this.commandCather();
//     }

//     commandCather() {
//         this.client.on('message', message => {
//             if (!message.guild) return;
//             if (message.author.id != this.client.user.id && !message.author.bot) {
//                 if (message.content.startsWith(this.client.prefix)) {
//                     let args = message.content.toLowerCase().slice(this.client.prefix.length).trim().split(/ +/g);
//                     let commandSlug = args[0];
//                     let command = this.commands.find(c => c.settings.slug.toLowerCase() == commandSlug);
//                     if (command) {
//                         command.execute(message, args.slice(1), this.client.modules);
//                     } else {
//                         if (this.client.unrecognized_command) {
//                             message.channel.send('Unrecognized command');
//                         }
//                     }
//                 }
//             }
//         });
//     }
// 8
//     loadCommands() {                
//         console.log('Loading commands...');
//         let commandDir =  '../commands';
//         let normalizedPath = require("path").join(__dirname, commandDir);
//         require("fs").readdirSync(normalizedPath).forEach((file) => {
//             let command = new (require(`${commandDir}/${file}`))(this.client);
//             this.commands.push(command);            
//         });
//     }
// }

// module.exports = CommandsModule;

const Module = require('../classes/module.js');
const decache = require('decache');

class CommandsModule extends Module {
    
    commands = [];

    constructor(client) {
        super(client, {
            name: 'Commands module'
        });
        this.loadCommands();
        this.commandCather();
    }

    // initModule() {
    //     // 
    // }

    commandCather() {
        this.client.on('message', async message => {
            if (!message.guild) return;
            if (message.author.id != this.client.user.id && !message.author.bot) {
                if (message.content.startsWith(this.client.prefix)) {
                    let args = message.content.toLowerCase().slice(this.client.prefix.length).trim().split(/ +/g);
                    let commandName = args[0];
                    let command = this.commands.find(c => c.settings.slug.toLowerCase() == commandName);
                    if (command) {
                        command.execute(message, args.slice(1), this.client.modules);
                    } else if (command = this.commands.find(c => c.settings.alias.includes(commandName))) {
                        command.execute(message, args.slice(1), this.client.modules);
                    } else {
                        for(let key in this.client.commandList){
                            let c = this.client.commandList[key];
                            if(c.slug.toLowerCase() == commandName)
                                return;
                            if(c.alias.includes(commandName))
                                return;
                        }
                        if(this.client.broadcastError){
                            message.channel.send(`Unrecognized command`);
                        }
                    }
                }
            }
        });
    }

    loadCommands() {
        console.log('\t\tLoading commands...');
        let commandDir =  '../commands',
            normalizedPath = require("path").join(__dirname, commandDir),
            count = 0;
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
        this.commands.forEach(cmd => {
            let element = {
                slug: cmd.settings.slug,
                description: cmd.settings.description,
                alias: cmd.settings.alias,
                hidden: cmd.settings.hidden,
            }
            this.client.commandList[`commands-${element.slug}`] = element;
        })
        console.log('\t\tRegistered...');
    }
}

module.exports = CommandsModule;
