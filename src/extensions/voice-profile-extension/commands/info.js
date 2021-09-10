const { MessageEmbed } = require('discord.js');

const { show } = require('../../voice-level-extension/rest');

async function action(message) {
    let member = message.mentions.members.first();
    if (!member) {
        member = message.member;
    }

    let voiceProfile = await show(member.guild.id, member.id);    
    let textProfile = core.findTextProfile(member.id, member.guild.id);
    let lang = core.getGuildLanguage(message.guild.id);
    if (textProfile.isTemplate) {
        textProfile = null;
    }

    let title = __(
        { 
            phrase: `User stats {{tag}}`,
            locale: lang 
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
        let timeString =`${days} ${__({phrase: 'DAYS', locale: lang})} ${hours}:${minutes}:${seconds}`;
        let stats = __(
            { 
                phrase: `Level {{level}} ({{experience}}) XP)
                Progress to the next level: {{progress}}%
                Time spent: {{time_spents}}
                Voice Points: {{voicepoints}}
                `,
                locale: lang
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
        
        embed.addField(__({phrase: 'VOICE', locale: lang}), stats);
    } else {
        embed.addField(__({phrase: 'VOICE', locale: lang}), __('DATA_MISSING'));
    }

    if (textProfile) {
        let textNextLevel = textProfile.level*20+(textProfile.level-1)*20;
        let stats = __(
            { 
                phrase: `Level {{level}} ({{experience}}) XP)
                Progress to the next level: {{progress}}%
                Message count: {{message_count}}
                `,
                locale: lang
            },
            {
                level: textProfile.level,
                experience: Math.floor(textProfile.experience),
                progress: Math.floor(textProfile.experience/textNextLevel*100),
                message_count: textProfile.message_count
            }
        );
        embed.addField(__({phrase: 'TEXT', locale: lang}), stats);
    } else {
        embed.addField(__({phrase: 'TEXT', locale: lang}), __('DATA_MISSING'));
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
    channels: ['command', 'roulette']
}

module.exports = command;
