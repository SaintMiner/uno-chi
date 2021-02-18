const { MessageEmbed } = require('discord.js');

function action(message) {
    let member = message.mentions.members.first();
    if (!member) {
        member = message.member;
    }

    let voiceProfile = core.findVoiceProfile(member.id, member.guild.id);
    let textProdile;

    let title = __(
        { 
            phrase: `User stats {{tag}}`,
            locale: core.getGuildLanguage(message.guild.id) 
        },
        {
            tag: member.user.tag
        }
    );
    let embed = new MessageEmbed()
        .setColor("#580ad6")
        .setThumbnail(member.user.avatarURL())
        .setTitle(title)            
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

        let stats = __(
            { 
                phrase: `Level {{level}} ({{experience}}} XP)
                Progress to the next level: {{progress}}%
                Time spent: {{time_spents}}
                Voice Points: {{voicepoints}}
                `,
                locale: core.getGuildLanguage(message.guild.id) 
            },
            {
                level: voiceProfile.level,
                experience: Math.floor(voiceProfile.experience),
                progress: Math.floor(voiceProfile.experience/nextLevel*100),
                time_spents: timeString,
                voicepoints: voiceProfile.voicepoints
            }
        );
        // let stats =
        // `Уровень ${voiceProfile.level} (${Math.floor(voiceProfile.experience)} XP)
        // Прогресс до след. уровня: ${Math.floor(voiceProfile.experience/nextLevel*100)}%
        // Времени затрачено: ${timeString}
        // Voice Points: ${voiceProfile.voicepoints}
        // `;
        
        embed.addField(__('VOICE'), stats);
    } else {
        embed.addField(__('VOICE'), __('DATA_MISSING'));
    }

    if (textProdile) {
        
    } else {
        embed.addField(__('TEXT'), __('DATA_MISSING'));
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
