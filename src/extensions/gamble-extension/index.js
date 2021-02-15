const random = require('random');
const seedrandom = require('seedrandom');
const { MessageEmbed } = require('discord.js');
const { info, warn, error, log } = require('pretty-console-logs');

const Extension = require('@core/classes/extension');
const rouletteCommand = require('./commands/gamble-roulette');

class GambleExtension extends Extension {
    
    constructor() {
        super();
        
        this.isPublic = false;

        this.rouletteData = require('./json/roulette.json');
        this.multipliers = this.rouletteData.multipliers;
        this.places = Object.keys(this.multipliers);
        this.commandHelp = `\`>gamble roulette [${this.places.join('|').replace('number', 'number[0-36]')}] [ставка]\``;
        this.bets = [];

        this.rouletteLaunched = false;
        this.rouletteCooldown = false;
        this.rouletteStarted = false;
        this.rouletteSecondsBeforeLauch = 16;
        this.rouletteLaunchTime = this.rouletteSecondsBeforeLauch * 1000;
        this.rouletteCooldownTime = 10 * 1000;
        this.rouletteWheel = null;

        this.voiceProfileExtension = core.getExtension('VoiceProfileExtension');
        this.guildExtension = core.getExtension('GuildExtension');
    }

    commands() {
        return [
            rouletteCommand,
        ]
    }

    roulette(message, args, user_id, guild_id) {
        if (!this.voiceProfileExtension || !this.guildExtension) return;
        let voice_profile = this.voiceProfileExtension.findVoiceProfile(user_id, guild_id);
        if (!voice_profile) return message.channel.send('Ты кто?');
        if (!this.validateRouletteBet(message, args, voice_profile)) return 'Validation error';
        
        if (!this.rouletteLaunched) {
            if (message) {
                message.channel.send(`Рулетка будет запущена через ${this.rouletteSecondsBeforeLauch} секунд`);
            }
            this.rouletteLaunched = true;
            this.bets = [];
            this.rouletteWheel = setTimeout(() => {
                this.startRoulette(message, args)
                this.rouletteLaunched = false;
            }, this.rouletteLaunchTime);
        }

        
        voice_profile.voicepoints -= args[2];
        

        this.bets.push({
            guild_id: guild_id,
            user_id: user_id,
            place: args[1],
            bet: args[2]
        });
        let table = this.bets.map(bet => { return {bet: bet.place, user_id: bet.user_id}});
        return [...new Set(table)];
    };

    startRoulette(message, args) {
        random.use(seedrandom(`nleebsu-${new Date().getTime()}`));
        let number = random.int(0, 36);
        core.getExtension('RouletteWebsocket').sendStartRoulette(number);
        let isZero = false;
        let isDoubleZero = false;
        let isEven = false;
        if (!number) {
            isZero = true;
            if (random.int(0, 1)) {
                isDoubleZero = true;
            }
        } else {
            if (!(number % 2)) {
                isEven = true;
            }
        }
        let result = this.rouletteData[`${number}`];
        let winners = [];
        // console.log(result);

        winners = winners.concat(this.bets.filter(bet => bet.place == number));
        winners.forEach(bet => bet.place = "number");
        result.sectors.forEach(sector => {
            winners = winners.concat(this.bets.filter(bet => bet.place == sector));
        });
        winners = winners.concat(this.bets.filter(bet => bet.place == result.color));

        if (!isZero) {
            if (isEven) {
                winners = winners.concat(this.bets.filter(bet => bet.place == 'even'));
            } else {
                winners = winners.concat(this.bets.filter(bet => bet.place == 'odd'));
            }
        }
        
        
        let guilds = [...new Set(this.bets.map(bet => bet.guild_id))];
        
        let colorSquare;
        switch (result.color) {
            case 'red': colorSquare = '🟥'; break;
            case 'black': colorSquare = '⬛'; break;
            case 'green': colorSquare = '🟩'; break;
        }
        guilds.forEach(checkingGuild => {
            core.client.guilds.fetch(checkingGuild).then(guild => {
                if (guild) {
                    const currentGuild = this.guildExtension.findGuild(guild.id);
                    if (currentGuild.channels.roulette) {
                        core.client.channels.fetch(currentGuild.channels.roulette).then(async c => {
                            if (c) {
                                c.send(`Выпало: \`${colorSquare} ${number} [${result.sectors.join(' ')}]\``);
                                const guildWinners = winners.filter(winner => winner.guild_id == guild.id);
                                
                                if (guildWinners.length) {
                                    
                                    let info = new MessageEmbed()
                                        .setColor("#580ad6")
                                        .setTitle(`Победные ставки`)
                                        .setTimestamp();
                                    for await (const profile of guildWinners) {
                                        let voice_profile = this.voiceProfileExtension.findVoiceProfile(profile.user_id, profile.guild_id);                                            
                                        let prize = profile.bet * this.multipliers[profile.place];
                                        voice_profile.voicepoints += prize;
                                        await guild.members.fetch(profile.user_id).then(m => {
                                            info.addField(`${m.user.tag}`, `Поставил: \`${profile.bet}\` Получил: \`${prize}\``);
                                        }).catch(err => error(err));
                                    }
                                    c.send(info);
                                } else {
                                    c.send('Победителей нет)');
                                }
                            }
                        }).catch(e => console.error);
                    }
                }
            }).catch(e => console.error);   
        });
    }

    validateRouletteBet(message, args, voice_profile) {
        let bet = +args[2];
        let place = args[1];
        if (!place || !bet) {
            message.channel.send('Укажи место ставки и ставку!');
            message.channel.send(this.commandHelp);
            return;
        }

        if (!Number.isInteger(bet)) {
            message.channel.send('Ставка только целое число!');
            return;
        }

        if ( (Number.isNaN(+place) && !this.places.includes(place)) || +place < 0 || +place > 36) {
            message.channel.send('Такое место недоступно на столе!');
            message.channel.send(this.commandHelp);
            return;
        }

        if (bet < 1) {
            message.channel.send('Ставка не меньше 1!');
            return;
        }
        
        if (voice_profile.voicepoints == 0) {
            message.channel.send('У тебя ничего не осталось o/');
            return;
        }

        if (voice_profile.voicepoints < bet) {
            message.channel.send('Не хватает, ставь меньше!');
            return;
        }
        
        return true;
    }

}

module.exports = GambleExtension