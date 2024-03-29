const random = require('random');
const seedrandom = require('seedrandom');
const { gambleDice } = require('../dice');

const { transaction, show } = require('../../voice-level-extension/rest');

async function gambleRPS(message, args, overage) {
    
    random.use(seedrandom(`nleebsu-${new Date().getTime()}`));

    
    let profile = await show(message.guild.id, message.author.id);
    let bet = +overage[0];
    let userChoose = overage[1];

    if (!profile) return core.sendLocalizedError(message, `YOU_DONT_HAVE_PROFILE`);
    if (isNaN(bet)) return core.sendLocalizedError(message, `BET_MUST_BE_A_NUMBER`);
    if (bet > 10000) return core.sendLocalizedError(message, `MAX_10000`);
    if (!userChoose) return core.sendLocalizedError(message, `RPS_MUST_BE_DEFINED`);
    if (bet <= 0) return core.sendLocalizedError(message, `MINIMAL_BET_1`);
    if (profile.voicepoints < bet) return core.sendLocalizedError(message, `NOT_ENOUGH_VOICEPOINTS`);
    let availabledChoises = ['🖐️', '✊', '✌️', 'r', 'p', 's'];
    if (!availabledChoises.includes(userChoose)) return core.sendLocalizedError(message, `RPS_NOT_CORRECT`);

    let botChoose = random.int(1, 3);
    let botChooseEmoji;
    if (botChoose == 1) botChooseEmoji = '🖐️';
    if (botChoose == 2) botChooseEmoji = '✊';
    if (botChoose == 3) botChooseEmoji = '✌️';
    
    switch (userChoose) {
        case "r":
        case "✊":
            userChoose = 2;
            break;

        case "p":
            case "🖐️":
            userChoose = 1;
            break;
        
        case "s":
        case "✌️":
            userChoose = 3;
            break;
    }
    
    let won = __(
        { 
            phrase: `{{botChoose}} You won {{bet}}`,
            locale: core.getGuildLanguage(message.guild.id) 
        },
        {
            bet: bet,
            botChoose: botChooseEmoji
        }
    );

    let lose = __(
        { 
            phrase: `{{botChoose}} You lose {{bet}}`,
            locale: core.getGuildLanguage(message.guild.id) 
        },
        {
            bet: bet,
            botChoose: botChooseEmoji
        }
    );

    let draw = __(
        { 
            phrase: `{{botChoose}} Draw`,
            locale: core.getGuildLanguage(message.guild.id) 
        },
        {
            botChoose: botChooseEmoji
        }
    );
    
    let state = getState(userChoose, botChoose);

    if (state == "win") {
        // profile.voicepoints += bet;
        await transaction({
            from: "self",
            to: {
                user_id: profile.user_id,
                guild_id: profile.guild_id,
            },
            amount: bet,
            reason: "RPS win",
        });
        message.channel.send(won);
    } else if (state == "lose") {
        // profile.voicepoints -= bet;
        await transaction({
            from: {
                user_id: profile.user_id,
                guild_id: profile.guild_id,
            },
            to: "self",
            amount: bet,
            reason: "RPS lose",
        });
        message.channel.send(lose);
    } else if (state == "draw") {
        message.channel.send(draw);
    }

}

function getState(userChoose, botChoose) {
    if (userChoose == botChoose) return "draw";
    if (userChoose+1 == botChoose || (userChoose == 3 && botChoose == 1)) return "win";
    return "lose";
}

let rps = {
    slug: 'rps',
    execute: gambleRPS,
    channels: ['roulette']
}

let dice = {
    slug: 'dice',
    execute: gambleDice,
    channels: ['roulette']
}

let command = {
    slug: 'gamble',    
    childrens: [ dice, rps ],
}

module.exports = command;