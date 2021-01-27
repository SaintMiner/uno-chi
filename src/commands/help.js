const Command = require('../classes/command.js');
const { MessageEmbed } = require('discord.js');
const { __ } = require('i18n');

/** 
    @settings
    @attribute {slug} - string | How command can be executed
    @attribute {description} - string | About command in detailed help
    @attribute {category} - string | Splits in command list by category
    
    @attribute {usages} - array of string | Shows in help how to use the command - prefix in start will be added automaticaly
    @attribute {aliases} - array of strings | execute aliases
    @attribute {permissions} - array of strings | discord server permissions | https://discord.js.org/#/docs/main/stable/class/Permissions
    @attribute {whiteListedUsers} - array of strings, | list of whitelisted users id
    
    @attribute {isHidden} - boolean | Hide command in help list
    @attribute {isPrivate} - boolean | allows only .env configured admins or command whitelisted users execute this command

*/

class HelpCommand extends Command {

    constructor(client) {
        super(client, {
            slug: 'help',
            description: 'COMMAND_HELP_DESCRIPTION',
            category: 'Misc',
            aliases: ['helpme'],
            usages: ['help', 'help <command>'],
            permissions: [],
            whiteListedUsers: [],
            isHidden: false,
            isPrivate: false,
        });        
    }

    executeCustom(message, args) {
        this.commands = this.client.modules.find(m => m.name == 'Commands module').commands;
        if (args[0]) {
            this.sendCommandDetalization(args[0]);
        } else {
            this.sendCommandList();
        }
    }

    sendCommandList() {
        let commandList = new MessageEmbed()
            .setColor('#580ad6')
            .setTitle('Command list')
            .setDescription(`Для детализации \`${this.client.prefix}${this.slug} <комманда>\``)
            .setTimestamp();        
        let categories = [...new Set(this.commands.filter(command => !command.isHidden).map(command => command.category))];

        categories.forEach(category => {
            let list = '';
            this.commands
                .filter(command => command.category == category && !command.isHidden)
                .forEach(command => list += `\`${command.slug}\` `);
            commandList.addField(category, list);
        });
        return this.reply(commandList);
    }

    sendCommandDetalization(slug) {
        let command = this.commands.find(command => command.slug == slug || command.aliases.includes(slug));
        if (command) this.reply(command.getCommandHelp());
    }
}

module.exports = HelpCommand;