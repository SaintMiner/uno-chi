const { MessageEmbed } = require('discord.js');

const { levelTop, timeTop, pointsTop } = require('../../voice-level-extension/rest');

async function topVoicePoints(message) {
    let profiles = await pointsTop(message.guild.id);

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

async function topVoiceLevel(message) {    
    let profiles = await levelTop(message.guild.id);
    let embed = new MessageEmbed()
        .setColor("#580ad6")
        .setTitle(`Локальный топ`)
        .setDescription('Голосовая система')
        .setTimestamp();

    let place = 1;
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

async function topTime(message) {    
    let profiles = await timeTop(message.guild.id);

    let embed = new MessageEmbed()
        .setColor("#580ad6")
        .setTitle(`Локальный топ`)
        .setDescription('Общее время')
        .setTimestamp();
    let place = 1;
    
    profiles.some(profile => {
        let member = message.guild.members.resolve(profile.user_id);
        if (member) {
            let totalSeconds = profile.timespent.global;
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