const random = require('random');
const seedrandom = require('seedrandom');

function gambleRoll(message, args, overage) {
    const voiceProfileExtension = core.getExtension('VoiceProfileExtension');
    let betRoll = +overage[0];
    let profile = voiceProfileExtension.findVoiceProfile(message.author.id, message.guild.id);
    
    random.use(seedrandom(`nleebsu-${new Date().getTime()}`));

    if (isNaN(betRoll)) return;
    if (betRoll < 100) return;
    if (!profile) return;
    if (profile.voicepoints < betRoll) return;

    let userRoll = random.int(1, betRoll);
    let botRoll = random.int(1, betRoll);
    
    message.channel.send(`Твой бросок ${userRoll}\nМой бросок: ${botRoll}`);

    if (userRoll > botRoll) {
        profile.voicepoints += betRoll;
        message.channel.send(`Ты выйграл ${betRoll}`);
    } else if (userRoll < botRoll) {
        profile.voicepoints -= betRoll;
        message.channel.send(`Ты проиграл ${betRoll}`);
    }

}

function gambleRPS(message, args, overage) {
    const voiceProfileExtension = core.getExtension('VoiceProfileExtension');
    random.use(seedrandom(`nleebsu-${new Date().getTime()}`));

    let multiplier = 2;
    let profile = voiceProfileExtension.findVoiceProfile(message.author.id, message.guild.id);
    let bet = +overage[0];
    let userChoose = overage[1];

    if (!profile) return;
    if (!userChoose) return;
    if (isNaN(bet)) return;
    if (bet <= 0) return;
    if (profile.voicepoints < bet) return;
    if (userChoose != '🖐️' && userChoose != '✊' && userChoose != '✌️') return;

    let botChoose = random.int(1, 3);
    if (botChoose == 1) botChoose = '🖐️';
    if (botChoose == 2) botChoose = '✊';
    if (botChoose == 3) botChoose = '✌️';

    message.channel.send(botChoose);

    if (botChoose == '🖐️' && userChoose == '✌️') {
        profile.voicepoints += bet*multiplier;
    } else if (botChoose == '🖐️' && userChoose == '✊') {
        profile.voicepoints -= bet;
    }

    if (botChoose == '✌️' && userChoose == '✊') {
        profile.voicepoints += bet*multiplier;
    } else if (botChoose == '✌️' && userChoose == '🖐️') {
        profile.voicepoints -= bet;
    }

    if (botChoose == '✊' && userChoose == '🖐️') {
        profile.voicepoints += bet*multiplier;
    } else if (botChoose == '✊' && userChoose == '✌️') {
        profile.voicepoints -= bet;
    }


    
}

let rps = {
    slug: 'rps',
    execute: gambleRPS
}

let roll = {
    slug: 'roll',
    execute: gambleRoll
}

let command = {
    slug: 'gamble',    
    childrens: [ roll, rps ],
}

module.exports = command;