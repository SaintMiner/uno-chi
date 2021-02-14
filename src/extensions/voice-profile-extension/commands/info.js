const { MessageEmbed } = require('discord.js');

function action(message) {
    const voiceProfileExtension = core.getExtension('VoiceProfileExtension');
    let member = message.mentions.members.first();
    if (!member) {
        member = message.member;
    }

    let voiceProfile = core.findVoiceProfile(member.id, member.guild.id);
    let textProdile;


    let embed = new MessageEmbed()
        .setColor("#580ad6")
        .setThumbnail(member.user.avatarURL())
        .setTitle(`Статистика пользователя ${member.user.tag}`)            
        .setTimestamp();

    if (member.nickname) {
        embed.setDescription(`${member.nickname}`)
    }
    
    if (voiceProfile) {
        let nextLevel = (10+voiceProfile.level)*10*voiceProfile.level*voiceProfile.level;
        let totalSeconds = voiceProfile.time_spents.global ? voiceProfile.time_spents.global : 0;
        let days = Math.floor(totalSeconds / (3600 * 24));
        totalSeconds %= 60 * 60 * 24;
        let hours = (`0` + (Math.floor(totalSeconds / 3600))).slice(-2);
        totalSeconds %= 3600;
        let minutes = (`0` + (Math.floor(totalSeconds / 60))).slice(-2);
        let seconds = (`0` + (totalSeconds % 60)).slice(-2);
        let timeString =`${days} Дней ${hours}:${minutes}:${seconds}`;
        let stats =
        `Уровень ${voiceProfile.level} (${Math.floor(voiceProfile.experience)} XP)
        Прогресс до след. уровня: ${Math.floor(voiceProfile.experience/nextLevel*100)}%
        Времени затрачено: ${timeString}
        Voice Points: ${voiceProfile.voicepoints}
        `;
        
        embed.addField('Голосовой', stats);
    } else {
        embed.addField('Голосовой', 'Данные отсутсвуют');
    }

    if (textProdile) {
        
    } else {
        embed.addField('Текстовый', 'Данные отсутсвуют');
    }


    message.channel.send(embed);
}

const command = {
    slug: 'info',
    description: 'String',
    category: 'String',

    usages: [],
    aliases: [],
    permissions: [],
    whiteListedUsers: [],

    isHidden: false,
    isPrivate: false,

    execute: action,
    childrens: [],
}

module.exports = command;
