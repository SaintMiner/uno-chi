function roll(message, temp, args) {
    let roll = 0;        
    let rollMessage = '';
    if (args.length) {
        let rollRequest = args.join(' ');
        let rolls = rollRequest.match(/(d\d+)|(\s)|(\d+)/g);
        // for formula dice processing | like 2d5+2d6 d7+8+7
        // let rolls = rollRequest.match(/(d\d+)|(\s)|(\d+)|(\+)|(\-)|(\*)|(\/)/g);
        let rollsResult = [];
        let rollSum = 0;
        let multiplier = null;
        let multiplierSum = 0;
        let temp = 0;
        try {
            rolls.forEach((r, index) => {
                if (r) {
                    if (r.includes('d')) {
                        if (index && multiplier) {
                            rollsResult.splice(index-1, 1);
                            for (let i = 1; i <= multiplier; i++) {
                                let dice = +r.replace('d', '');
                                if (dice > 10000) {
                                    throw message.channel.send('Dice can\'t be more than 10000');                                
                                }
                                temp = Math.floor(Math.random() * dice) + 1;
                                rollsResult.push(temp);
                                // multiplierSum += rollsResult[rollsResult.length-1];
                                // console.log(`temp: ${temp}`);
                                // console.log(`multiplierSum: ${multiplierSum}`);
                                // if (i == multiplier) {
                                //     rollsResult.push(multiplierSum);
                                //     multiplierSum = 0;
                                // }
                            }
                        } else {
                            rollsResult.push(Math.floor(Math.random() * +r.replace('d', '')) + 1);
                        }
                    } else {
                        if (+r > 100) {
                            throw message.channel.send('Multiplier can\'t be more than 100');                            
                        }
                        rollsResult.push(+r);
                        multiplier = +r;
                    }
                    // if (r.includes(/(\s)|(\+)|(\-)|(\*)|(\/)/g)) {
                    //     multiplier = null;
                    // }
                }
            });
        } catch (e) {
            return e;
        }
        // console.log(rollsResult);
        rollsResult.forEach(r => {
            rollMessage += `${r} `;
            rollSum += +r;
        });
        rollMessage += `[${rollSum}]`;
    } else {
        roll = Math.floor(Math.random() * 6) + 1;
        rollMessage += `${roll} [${roll}]`;
    }
    message.channel.send(`\`\`\`${rollMessage}\`\`\``);
}

const command = {
    slug: 'roll',
    execute: roll
}

module.exports = command;