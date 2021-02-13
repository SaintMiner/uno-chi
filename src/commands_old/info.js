const Command = require('../classes/command.js');
const { MessageEmbed } = require('discord.js');
class InfoCommand extends Command {
    
    constructor(client) {
        super(client, {
            slug: 'info',
            description: 'COMMAND_INFO_DESCRIPTION',
            category: 'Misc',
            aliases: ['i'],
            usages: ['info', 'info <@who>'],
            permissions: [],
            whiteListedUsers: [],
            isHidden: false,
            isPrivate: false,
        });
    }

    executeCustom(message, args) {
        let mention = message.mentions.users.first();
        let chekingUser = {};
        chekingUser.user = mention ? mention : message.author;
        chekingUser.member = mention ? message.mentions.members.first() : message.member;

        chekingUser.voice_profile = this.client.storage['voice_profiles']
            .find(voice_profile => voice_profile.guild_id == message.guild.id && voice_profile.user_id == chekingUser.user.id);
        chekingUser.text_profile = this.client.storage['text_profiles']
            .find(text_profile => text_profile.guild_id == message.guild.id && text_profile.user_id == chekingUser.user.id);

        let info = new MessageEmbed()
            .setColor("#580ad6")
            .setThumbnail(chekingUser.user.avatarURL())
            .setTitle(`Статистика пользователя ${chekingUser.user.tag}`)            
            .setTimestamp();

        if (chekingUser.member.nickname) {
            info.setDescription(`${chekingUser.member.nickname}`)
        }

        if (chekingUser.voice_profile) {
            let nextLevel = (10+chekingUser.voice_profile.level)*10*chekingUser.voice_profile.level*chekingUser.voice_profile.level;
            let totalSeconds = chekingUser.voice_profile.time_spent
            let days = Math.floor(totalSeconds / (3600 * 24));
            totalSeconds %= 60 * 60 * 24;
            let hours = (`0` + (Math.floor(totalSeconds / 3600))).slice(-2);
            totalSeconds %= 3600;
            let minutes = (`0` + (Math.floor(totalSeconds / 60))).slice(-2);
            let seconds = (`0` + (totalSeconds % 60)).slice(-2);
            let timeString =`${days} Дней ${hours}:${minutes}:${seconds}`;
            let stats 
            = `Уровень ${chekingUser.voice_profile.level} (${chekingUser.voice_profile.experience} XP)
             Прогресс до след. уровня: ${Math.floor(chekingUser.voice_profile.experience/nextLevel*100)}%
             Времени затрачено: ${timeString}
             Voice Points: ${chekingUser.voice_profile.voicepoint}
             `;
            info.addField('Голосовой', stats);
        }
        
        if (chekingUser.text_profile) {
            let nextLevel = chekingUser.text_profile.level*20+(chekingUser.text_profile.level-1)*20;
            let stats 
            = `Уровень ${chekingUser.text_profile.level} (${chekingUser.text_profile.experience} XP)
             Прогресс до след. уровня: ${Math.floor(chekingUser.text_profile.experience/nextLevel*100)}%
             Всего сообщений: ${chekingUser.text_profile.message_count}`;
            info.addField('Текстовый', stats);
        }


        message.channel.send(info);
    }
}

module.exports = InfoCommand;