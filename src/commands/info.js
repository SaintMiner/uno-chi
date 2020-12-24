const Command = require('../classes/command.js');
const { MessageEmbed } = require('discord.js');
class InfoCommand extends Command {
    
    constructor(client) {
        super(client, {
            slug: 'info', //how command can be executed
            permissions: [], //discord server permissions
            systemAdmin: false, //only system administrators can launch this command
        });
    }

    executeCustom(message, args) {
        let author = {};
        author.voice_profile = this.client.storage['voice_profiles']
            .find(voice_profile => voice_profile.guild_id == message.guild.id && voice_profile.user_id == message.author.id);
        author.text_profile = this.client.storage['text_profiles']
            .find(text_profile => text_profile.guild_id == message.guild.id && text_profile.user_id == message.author.id);    
        let info = new MessageEmbed()
            .setColor("#580ad6")
            .setThumbnail(message.author.avatarURL())
            .setTitle(`Статистика пользователя ${message.author.tag}`)            
            .setTimestamp();

        if (message.member.nickname) {
            info.setDescription(`${message.member.nickname}`)
        }

        if (author.voice_profile) {
            let nextLevel = (10+author.voice_profile.level)*10*author.voice_profile.level*author.voice_profile.level;
            let stats 
            = `Уровень ${author.voice_profile.level} (${author.voice_profile.experience} XP)
             Прогресс до след. уровня: ${Math.floor(author.voice_profile.experience/nextLevel*100)}%`;
            info.addField('Голосовой', stats);
        }

        if (author.text_profile) {
            let nextLevel = author.text_profile.level*20+(author.text_profile.level-1)*20;
            let stats 
            = `Уровень ${author.text_profile.level} (${author.text_profile.experience} XP)
             Прогресс до след. уровня: ${Math.floor(author.text_profile.experience/nextLevel*100)}%
             Всего сообщений: ${author.text_profile.message_count}`;
            info.addField('Текстовый', stats);
        }


        message.channel.send(info);
    }
}

module.exports = InfoCommand;