const random = require('random');
const seedrandom = require('seedrandom');
const { gambleDice } = require('../dice');

function gambleRPS(message, args, overage) {
    const voiceProfileExtension = core.getExtension('VoiceProfileExtension');
    random.use(seedrandom(`nleebsu-${new Date().getTime()}`));

    let multiplier = 2;
    let profile = voiceProfileExtension.findVoiceProfile(message.author.id, message.guild.id);
    let bet = +overage[0];
    let userChoose = overage[1];

    if (!profile) return core.sendLocalizedError(message, `YOU_DONT_HAVE_PROFILE`);
    if (isNaN(bet)) return core.sendLocalizedError(message, `BET_MUST_BE_A_NUMBER`);
    if (!userChoose) return core.sendLocalizedError(message, `RPS_MUST_BE_DEFINED`);
    if (bet <= 0) return core.sendLocalizedError(message, `MINIMAL_BET_1`);
    if (profile.voicepoints < bet) return core.sendLocalizedError(message, `NOT_ENOUGH_VOICEPOINTS`);
    if (userChoose != '🖐️' && userChoose != '✊' && userChoose != '✌️') return core.sendLocalizedError(message, `RPS_NOT_CORRECT`);

    let botChoose = random.int(1, 3);
    if (botChoose == 1) botChoose = '🖐️';
    if (botChoose == 2) botChoose = '✊';
    if (botChoose == 3) botChoose = '✌️';

    let won = __(
        { 
            phrase: `{{botChoose}} You won {{bet}}`,
            locale: core.getGuildLanguage(message.guild.id) 
        },
        {
            bet: bet,
            botChoose: botChoose
        }
    );

    let lose = __(
        { 
            phrase: `{{botChoose}} You lose {{bet}}`,
            locale: core.getGuildLanguage(message.guild.id) 
        },
        {
            bet: bet,
            botChoose: botChoose
        }
    );

    let draw = __(
        { 
            phrase: `{{botChoose}} Draw`,
            locale: core.getGuildLanguage(message.guild.id) 
        },
        {
            botChoose: botChoose
        }
    );

    if (botChoose == '🖐️' && userChoose == '✌️') {
        profile.voicepoints += bet*multiplier;
        message.channel.send(won);
    } else if (botChoose == '🖐️' && userChoose == '✊') {
        profile.voicepoints -= bet;
        message.channel.send(lose);
    } else if (botChoose == userChoose && '🖐️' == userChoose && '🖐️' == botChoose) {
        message.channel.send(draw);
    }

    if (botChoose == '✌️' && userChoose == '✊') {
        profile.voicepoints += bet*multiplier;
        message.channel.send(won);
    } else if (botChoose == '✌️' && userChoose == '🖐️') {
        profile.voicepoints -= bet;
        message.channel.send(lose);
    } else if (botChoose == userChoose && '✌️' == userChoose && '✌️' == botChoose) {
        message.channel.send(draw);
    }

    if (botChoose == '✊' && userChoose == '🖐️') {
        profile.voicepoints += bet*multiplier;
        message.channel.send(won);
    } else if (botChoose == '✊' && userChoose == '✌️') {
        profile.voicepoints -= bet;
        message.channel.send(lose);
    } else if (botChoose == userChoose && '✊' == userChoose && '✊' == botChoose) {
        message.channel.send(draw);
    }


    
}

let rps = {
    slug: 'rps',
    execute: gambleRPS
}

let dice = {
    slug: 'dice',
    execute: gambleDice
}

let command = {
    slug: 'gamble',    
    childrens: [ dice, rps ],
}

module.exports = command;