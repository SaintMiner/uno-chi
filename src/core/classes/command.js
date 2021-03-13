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
    
    @attribute {isHidden} - boolean | Hide command from help list
    @attribute {isPrivate} - boolean | allows only .env configured admins or command whitelisted users execute this command

*/

class Command {
    constructor(settings) {
        this.loadSettings(settings);        
    }

    execute(message, args, overage) {
        let guild = core.findGuild(message.guild.id);
        if (!guild) return;
        
        let hasGuildPermission = false;
        
        if (!this.extensions.length) {
            hasGuildPermission = true;
        }

        this.extensions.forEach(extension => {
            if (core.extensionManager.extensions.get(extension).isPublic) {
                hasGuildPermission = true;
            }
        })

        if (guild.extensions && !hasGuildPermission) {                   
            hasGuildPermission = this.extensions.some(extension => {
                if (guild.extensions) {
                    if (guild.extensions[extension]) {                  
                        return guild.extensions[extension].has == 'true';
                    }
                }
            });
        }
                        
        if (!hasGuildPermission) {
            return message.channel.send(`Your guild does't have permission for this command! Сontact with your administrators.`);
        }
        
        if (!message.member.hasPermission(this.permissions)) {
            return message.channel.send(__('YOU_DONT_HAVE_PERMISSION'));
        }

        if (this.isPrivate) {
            if (!this.canExecutePrivate(message.author.id)) {
                return message.channel.send(__('YOU_DONT_HAVE_PERMISSION'))
            };
        }

        if (!this.canExecutePrivate(message.author.id)) {
            let isRightChannel = this.checkChannel(message, guild);
            
            if (!isRightChannel) {
                return;
            }
        }
                
        if (this.executeCustom) {            
            this.executeCustom(message, args, overage);
        }
    }
    
    canExecutePrivate(user_id) {
        let isSysAdmin = core.configuration.systemAdministrators.some(user => user == user_id);
        let isWhiteListed = this.whiteListedUsers.some(user => user == user_id);
        return isSysAdmin || isWhiteListed;
    }

    loadSettings(settings) {
        this.rawSettings = settings;
        this.slug = settings.slug;
        this.description = settings.description || 'COMMAND_NO_DESCRIPTION';
        this.aliases = Array.isArray(settings.aliases) ? settings.aliases.map(v => v.toLowerCase()) : [];
        this.permissions = Array.isArray(settings.permissions) ? settings.permissions : [];
        this.whiteListedUsers = Array.isArray(settings.whiteListedUsers) ? settings.whiteListedUsers : [];
        this.usages = Array.isArray(settings.usages) ?
            settings.usages.map(usage => `\`${core.configuration.prefix}\``) :
            [`\`${core.configuration.prefix}${this.slug}\``];
        this.isHidden = settings.isHidden || false;
        this.isPrivate = settings.isPrivate || false;
        this.category = settings.category || 'Uncategorized';
        this.executeCustom = settings.execute;
        this.extensions = settings.extensions || [];
        this.channels = settings.channels || [];
        if (Array.isArray(settings.childrens)) {
            this.childrens = settings.childrens.map(children => new Command(children));
        } else {
            this.childrens = [];
        }
        this.executeCustom = settings.execute;
    }

    checkChannel(message, guild) {
        if (this.channels.length) {
            let messageChannel = message.channel.id;
            let isSetted = false;
            
            this.channels.forEach(channel => {
                if (Object.keys(guild.channels).includes(channel)) {
                    if (guild.channels[channel] != '0') {
                        isSetted = true;
                    }
                }
            });

            if (isSetted) {
                const filtered = Object.keys(guild.channels)
                    .filter(key => this.channels.includes(key))
                    .reduce((obj, key) => {
                        return {
                        ...obj,
                        [key]: guild.channels[key]
                        };
                    }, {});
                    
                if (!Object.values(filtered).includes(messageChannel)) {
                    let channels = Object.values(filtered).map(channel => `<#${channel}>`).join(' or ');
                    message.channel.send('You => '+channels);
                    return false;
                }
            }
            
            
        }
        return true;
    }

    // getCommandHelp() {        
    //     let help = new MessageEmbed()
    //         .setColor("#580ad6")
    //         .setTitle(this.slug)
    //         .addFields(
    //             { name: 'Usage', value: this.usages},
    //             { name: 'Description', value: __(this.description)},
    //         )
    //         .setTimestamp();
    //     if (this.aliases.length) {
    //         // help.addField('Aliases', this.aliases.map(alias => `\`${this.client.prefix}${alias}\``));
    //     }
    //     return help;
    // }

    // dropError(message, errorText) {
    //     message.channel.send(errorText);
    // }

    // reply(text) {
    //     this.message.channel.send(text);
    // }
}

module.exports = Command;