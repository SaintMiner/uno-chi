const Command = require('../classes/command.js');
const { MessageEmbed } = require('discord.js');

class TopCommand extends Command {

    constructor(client) {
        super(client, {
            slug: 'top', //how command can be executed
            permissions: [], //discord server permissions
            systemAdmin: false, //only system administrators can launch this command
        });
    }

    async executeCustom(message, args) {
        let voice_profiles = this.client.st