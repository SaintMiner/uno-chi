const { MessageEmbed } = require('discord.js');

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

class Command {
    constructor(client, settings) {
        this.client = client;
        this.loadSettings(settings);        
    }

    execute(message, args) {
        this.message = message;

        if (this.isPrivate) {
            if (!this.canExecutePrivate(this.message.author.id)) {
                return this.reply(__('YOU_DONT_HAVE_PERMISSION'))
            };
        }
        
        if (!message.member.hasPermission(this.permissions)) {
            return this.reply(__('YOU_DONT_HAVE_PERMISSION'));
        }
        
        this.executeCustom(message, args);
        
        this.message = null;
    }

    executeCustom(message, args) {
        message.channel.send('The useless command');
    }
    
    canExecutePrivate(user_id) {
        return this.whiteListedUsers.find(user => user == user_id) || this.client.systemAdministrators.find(user => user == user_id);
    }

    loadSettings(settings) {
        this.slug = settings.slug;
        this.description = settings.description || 'COMMAND_NO_DESCRIPTION';
        this.aliases = Array.isArray(settings.aliases) ? settings.aliases.map(v => v.toLowerCase()) : [];
        this.permissions = Array.isArray(settings.permissions) ? settings.permissions : [];
        this.whiteListedUsers = Array.isArray(settings.whiteListedUsers) ? settings.whiteListedUsers : [];
        this.usages = Array.isArray(settings.usages) ? settings.usages.map(usage => `\`${this.client.prefix}${usage}\``) : [`\`${this.client.prefix}${this.slug}\``];
        this.isHidden = settings.isHidden || false;
        this.isPrivate = settings.isPrivate || false;
        this.category = settings.category || 'Uncategorized';
    }

    getCommandHelp() {        
        let help = new MessageEmbed()
            .setColor("#580ad6")
            .setTitle(this.slug)
            .addFields(
                { name: 'Usage', value: this.usages},
                { name: 'Description', value: __(this.description)},
            )
            .setTimestamp();
        if (this.aliases.length) {
            help.addField('Aliases', this.aliases.map(alias => `\`${this.client.prefix}${alias}\``));
        }
        return help;
    }

    dropError(message, errorText) {
        message.channel.send(errorText);
    }

    reply(text) {
        this.message.channel.send(text);
    }
}

module.exports = Command;