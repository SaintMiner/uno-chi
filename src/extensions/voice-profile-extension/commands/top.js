const { MessageEmbed } = require('discord.js');

function topVoicePoints(message) {
    const voiceProfileExtension = core.getExtension('VoiceProfileExtension');
    if (!voiceProfileExtension) return;
    
    let profiles = voiceProfileExtension.voiceProfiles.filter(profile => profile.guild_id == message.guild.id);

    profiles = profiles.sort((a, b) => {
        if (a.voicepoints < b.voicepoints) return 1;
        if (a.voicepoints > b.voicepoints) return -1;
    })

    let embed = new MessageEmbed()
        .setColor("#580ad6")
        .setTitle(`Локальный топ`)
        .setDescription('ВойсПоинты')
        .setTimestamp();
    let place = 1;

    profiles.some(profile => {
        let member = message.guild.members.resolve(profile.user_id);
        if (member) {
            embed.addField(`#${place} ${member.user.tag}`, `${profile.voicepoints} VP`);
            place++;
        }

        return place > 5;
    });
    
    message.channel.send(embed);
}

function topVoiceLevel(message) {
    const voiceProfileExtension = core.getExtension('VoiceProfileExtension');
    if (!voiceProfileExtension) return;
    
    let profiles = voiceProfileExtension.voiceProfiles.filter(profile => profile.guild_id == message.guild.id);

    profiles = profiles.sort((a, b) => {
        if (a.level < b.level) return 1;
        if (a.level > b.level) return -1;
        if (a.experience < b.experience) return 1;
        if (a.experience > b.experience) return -1;
    })

    let place = 1;
    let embed = new MessageEmbed()
        .setColor("#580ad6")
        .setTitle(`Локальный топ`)
        .setDescription('Голосовая система')
        .setTimestamp();

    profiles.some(profile => {
        let member = message.guild.members.resolve(profile.user_id);
        if (member) {
            let nextLevel = (10+profile.level)*10*profile.level*profile.level;
            let percentage = Math.floor(profile.experience/nextLevel*100);
            embed.addField(`#${ place } ${ member.user.tag }`, `Уровень ${ profile.level } (${ profile.experience } XP) (${ percentage }%)`);
            place++;
        }

        return place > 5;
    });
    
    message.channel.send(embed);
}

function topTime(message) {
    const voiceProfileExtension = core.getExtension('VoiceProfileExtension');
    if (!voiceProfileExtension) return;
    
    let profiles = voiceProfileExtension.voiceProfiles.filter(profile => {
        if (profile.guild_id == message.guild.id && profile.time_spents) {
            if (profile.time_spents.global) {
                return true;
            }
        }        
    });

    profiles = profiles.sort((a, b) => {
        if (a.time_spents.global < b.time_spents.global) return 1;
        if (a.time_spents.global > b.time_spents.global) return -1;        
    })

    let embed = new MessageEmbed()
        .setColor("#580ad6")
        .setTitle(`Локальный топ`)
        .setDescription('Общее время')
        .setTimestamp();
    let place = 1;

    profiles.some(profile => {
        let member = message.guild.members.resolve(profile.user_id);
        if (member) {
            let totalSeconds = profile.time_spents.global;
            let days = Math.floor(totalSeconds / (3600 * 24));
            totalSeconds %= 60 * 60 * 24;
            let hours = (`0` + (Math.floor(totalSeconds / 3600))).slice(-2);
            totalSeconds %= 3600;
            let minutes = (`0` + (Math.floor(totalSeconds / 60))).slice(-2);
            let seconds = (`0` + (totalSeconds % 60)).slice(-2);
            let timeString =`${days} Дней ${hours}:${minutes}:${seconds}`;
            embed.addField(`#${place} ${member.user.tag}`, `Общее время проведённое на сервере ${timeString}`);
            place++;
        }

        return place > 5;
    });
    
    message.channel.send(embed);
}

const textlevel = {
    slug: 'textlevel',
    execute: null,
}

const time = {
    slug: 'time',
    execute: topTime,
    channels: ['command', 'roulette']
}

const voicelevel = {
    slug: 'voicelevel',
    execute: topVoiceLevel,
    channels: ['command', 'roulette']
}

const voicepoints = {
    slug: 'voicepoints',
    execute: topVoicePoints,
    channels: ['command', 'roulette']
}

const command = {
    slug: 'top',
    execute: topVoiceLevel,
    childrens: [ voicepoints, voicelevel, time ],
    channels: ['command', 'roulette']
}

module.exports = command