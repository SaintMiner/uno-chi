const random = require('random');
const seedrandom = require('seedrandom');

const { transaction, show, update } = require('../../voice-level-extension/rest');

async function pray(message) {    

    let profile = await show(message.guild.id, message.member.id);
    
    if (profile) {        
        random.use(seedrandom(`nleebsu-${new Date().getTime()}`));
        let pray = random.int(0, 500);
        let now = new Date();
        let userTimezoneOffset = now.getTimezoneOffset() * 60000;
        now = new Date(now - userTimezoneOffset);
        let last_pray_date = new Date(profile.pray.date);
        if (new Date(last_pray_date).setHours(0, 0, 0, 0) != new Date(now).setHours(0, 0, 0, 0)) {
            if (profile.pray.date) {
                const diffTime = Math.abs(now - last_pray_date);
                const diffDays = diffTime / (1000 * 60 * 60 * 24); 
                if (diffDays <= 2) {
                    profile.pray.date = now.getTime();
                    profile.pray.streak++;
                } else if (diffDays > 2) {
                    profile.pray.date = now.getTime();
                    profile.pray.streak = 1;
                }
            } else {
                profile.pray.date = now.getTime();
                profile.pray.streak = 1;
                if (message.author.id == "379778712868225042") {
                    message.channel.send('Знаешь я крайне польщена, что другой бог молится мне...');
                }
            }
            // profile.voicepoints += (pray + profile.pray_streak*10);
            await update(profile);

            await transaction({
                from: "self",
                to: {
                    user_id: profile.user_id,
                    guild_id: profile.guild_id,
                },
                amount: (pray + profile.pray.streak*10),
                reason: `pray | streak ${profile.pray.streak}`,
            });
            return message.channel.send(`Держи ${pray} и ${profile.pray.streak*10} за ежедневные молитвы!`);
        } else {
            return message.channel.send('Ты сегодня уже получил своё.');
        }
    } else {
        message.channel.send('Извини я тебя не услышала. Когда станешь частью системы можем поговорить');
    }
}

const command = {
    slug: 'pray',
    execute: pray,
    channels: ['command', 'roulette']
}

module.exports = command;