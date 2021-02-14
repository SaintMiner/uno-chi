const Basic = require('./classes/basic');
const Command = require('./classes/command');

const { info } = require('pretty-console-logs');

class CommandManager extends Basic {

    commands = [];
    
    initialize() {
        core.client.on('message', async message => {
            if (!message.guild) return;
            if (message.author.bot) return;
            if (!message.content.startsWith(core.configuration.prefix)) return;

            let commandment = message.content
                .toLowerCase()
                .slice(core.configuration.prefix.length)
                .trim()
                .split(/ +/g)
                .filter(part => !!part);
            
            if (!commandment.length) return;
            
            let instruction = this.getExecutionInstruction(message.content);
            this.callCommand(message, instruction);
        });
    }

    addCommand(command) {
        if (!command.slug) return;
        this.commands.push(command);
    }

    callCommand(message, instruction, parent = null) {
        let slug = instruction.commandment[0];
        instruction.commandment = instruction.commandment.slice(1);
        
        let command = null;
        if (instruction.commandment[0]) {
            let list = parent ? parent.childrens : this.commands;
            command = list.find(command => command.slug == slug) || {childrens: []};
            return this.callCommand(message, instruction, command);
        } else if (parent) {
            command = parent.childrens.find(command => command.slug == slug);
            if (!command) {
                command = parent;
            }
        } else {
            command = this.commands.find(command => command.slug == slug);
        }

        if (command) {
            command.execute(message, instruction.args);
        }
    }

    mergeAll() {
        this.commands = this.merge(this.commands);
        info(`[${this.name}] (${this.getCommandCount(this.commands)}) commands loaded`);
    }

    getCommandCount(commands, count = 0) {
        commands.forEach(command => {
            count++;
            count += this.getCommandCount(command.childrens);
        });
        return count;
    }

    merge(commands) {
        let slugs = [...new Set(commands.map(command => command.slug))];
        let merged = [];

        slugs.forEach(slug => {
            let filtered = commands.filter(command => command.slug == slug && slug);
            
            let unique = filtered.find(command => command.slug == slug);
            if (!unique) return;

            let tempSettings = {};
            Object.assign(tempSettings, unique.rawSettings);
            tempSettings.childrens = [];
            let temp = new Command(tempSettings);
            
            let rawChildrens = [];
            filtered.forEach(command => rawChildrens = rawChildrens.concat(command.childrens));
            temp.childrens = this.merge(rawChildrens);
            
            let extensions = [];
            filtered.forEach(command => extensions = extensions.concat(command.extensions));
            temp.extensions = extensions;

            merged.push(temp);
        });    

        return merged;
    }

    getExecutionInstruction(string) {
        let args = {};
        let argumentPrefix = '-';

        let parts = string.slice(core.configuration.prefix.length)
            .trim()
            .split(/ +/g)
            .filter(part => !!part);
            
        let argumentsIndex = parts.findIndex(part => part.startsWith(argumentPrefix));

        if (argumentsIndex > -1) {
            let rawArguments = parts.splice(argumentsIndex);
            let selectedAttribute = null;
            rawArguments.forEach(arg => {
                if (arg.startsWith(argumentPrefix)) {
                    selectedAttribute = arg.substring(1);
                    args[selectedAttribute] = null;
                } else if (selectedAttribute) {
                    if (!Array.isArray(args[selectedAttribute])) {
                        args[selectedAttribute] = [];
                    }
                    args[selectedAttribute].push(arg);
                }
            });            
        }

        let commandment = parts.map(part => part.toLowerCase());

        return {commandment, args};
    }
}

module.exports = CommandManager;