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
        let voice_profiles = this.client.storage['voice_profiles']
            .filter(voice_profile => voice_profile.guild_id == message.guild.id);
        let text_profiles = this.client.storage['text_profiles']
            .filter(text_profile => text_profile.guild_id == message.guild.id);
        if (voice_profiles.length) {
            let top = voice_profiles.sort((a, b) => {
                if (a.level < b.level) return 1;
                if (a.level > b.level) return -1;
                if (a.experience < b.experience) return 1;
                if (a.experience > b.experience) return -1;
            });

            let info = new MessageEmbed()
                .setColor("#580ad6")
                .setTitle(`Локальный топ`)
                .setDescription('Голосовая система')
                .setTimestamp();
            top = top.slice(0, 5);
            await this.client.guilds.fetch(message.guild.id).then(async guild => {
                await top.forEach(async (profile, index) => {
                    await guild.members.fetch(profile.user_id).then(m => {
                        info.addField(`#${index+1} ${m.user.tag}`, `Уровень ${profile.level} (${profile.experience} XP)`);
                    });
                    if (index == top.length-1) message.channel.send(info); //REFACTORING
                });
            });
        }

        if (text_profiles.length) {
            let top = text_profiles.sort((a, b) => {
                if (a.level < b.level) return 1;
                if (a.level > b.level) return -1;
                if (a.experience < b.experience) return 1;
                if (a.experience > b.experience) return -1;
            });

            let info = new MessageEmbed()
                .setColor("#580ad6")
                .setTitle(`Локальный топ`)
                .setDescription('Текстовая система')
                .setTimestamp();
            top = top.slice(0, 5);
            await this.client.guilds.fetch(message.guild.id).then(async guild => {
                await top.forEach(async (profile, index) => {
                    await guild.members.fetch(profile.user_id).then(m => {
                        info.addField(`#${index+1} ${m.user.tag}`, `Уровень ${profile.level} (${profile.experience} XP)`);
                    });
                    if (index == top.length-1) message.channel.send(info); //REFACTORING
                });
            });
        }
    }
}

module.exports = TopCommand;