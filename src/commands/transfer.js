const { MessageMentions, Collection } = require('discord.js');
const Command = require('../classes/command.js');

class TemplateCommand extends Command {

    constructor(client) {
        super(client, {
            slug: 'transfer', //how command can be executed
            description: '', //command description
            alias: [], //command alias
            hidden: true, //if commands should be hidden from help
            permissions: [], //discord server permissions
            onlyOwner: false, //only owner can launch this command
            whitelistedUsers: [], //whitelisted users that can execute this command

            //your variable port
            systemAdmin: false, //only system administrators can launch this command
        });
    }

    executeCustom(message, args) {
        //
        // Author: nedius
        //
        // Description: 
        //      Command to cheat transfer command implementation... without implementing it,
        //      this code does not need for data verifying, because it's emulates already existing commands.
        //      Still this command will be available to server administators only! Despite not having restrictions!!!
        //
        // How convertions works:
        //      !!transfer @from @to count
        //      =>
        //      !!vpadd @from -count
        //      !!vpadd @to +count
        // 
        // Test command:
        //      !ttransfer <@!546708536600690689> <@!379778712868225042> 10

        // saving original message content
        let originalContent = message.content,
            originalMentions = message.mentions,
            newUserColection,
            newMentionsFromScratch;

        // changing message content to vpadd command and taking away precious voice points from first mention person
        message.content = `${this.client.prefix}vpadd ${args[0]} ${-Math.abs(args[2])}`

        // creating fake message mentions
        // finding first mentioned user and creating collection
        newUserColection = new Collection(message.mentions.members.filter(user => user.toString() === args[0]));
        // creating new Message mention from previous collection
        newMentionsFromScratch = new MessageMentions(message, newUserColection, null, null, null);
        // putting collection into cache because vpadd command using it rather then mentions.users
        newMentionsFromScratch._members = newUserColection;
        // overriding message mentions
        message.mentions = newMentionsFromScratch;

        // sending fake message event
        this.client.emit('message', message);

        // resetting variables and partialy restoring original message
        newUserColection = null;
        newMentionsFromScratch = null;
        message.mentions = originalMentions;

        // changing message content to vpadd command and giving precious voice points to second mention person
        message.content = `${this.client.prefix}vpadd ${args[1]} ${Math.abs(args[2])}`

        // doing same stuff as before
        newUserColection = new Collection(message.mentions.members.filter(user => user.toString() === args[1]));
        newMentionsFromScratch = new MessageMentions(message, newUserColection, null, null, null);
        newMentionsFromScratch._members = newUserColection;
        message.mentions = newMentionsFromScratch;
        
        // again sending fake message event
        this.client.emit('message', message);

        // restoring original message content
        message.content = originalContent;
        message.mentions = originalMentions;
    }
}

module.exports = TemplateCommand;