const Extension = require('@core/classes/extension');

const WebSocketServer = require('websocket').server;
const http = require('http');

class RouletteWebsocket extends Extension {
    constructor(client) {
        super(client, {
            name: 'RouletteWebsocket'
        });
        this.connections = [];
        this.players = [];
        this.tableBets = [];
        this.server = http.createServer((request, response) => {
            const { headers, method, url, message } = request;
            response.setHeader("Access-Control-Allow-Origin", "*");
            response.setHeader('Content-Type', 'application/json');
            response.setHeader("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS");
            response.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
            // const ur = new URL(headers.host+url);
            const { pathname, search, searchParams } = new URL(`http://${headers.host}${url}`);            
            let body = [];
            // console.log(new URL(href));
            switch (pathname) {
                case '/getvp':
                    if (request.method == 'GET') {
                        request.on('data', (chunk) => {
                            body.push(chunk);
                        }).on('end',async () => {
                            try {
                                body = JSON.parse(Buffer.concat(body).toString());
                            } catch (e) {
                                response.writeHead(400);
                                response.write('Not valid JSON');
                                response.end();
                                return;
                            }
                            
                            let user_id = body.user_id;
                            let guild_id = body.guild_id;                            

                            if (!user_id || !guild_id) {
                                response.writeHead(400);
                                response.write('Specify user_id and guild_id');
                                response.end();
                                return;
                            }
                            let voiceProfile = core.findVoiceProfile(user_id, guild_id);

                            if (!voiceProfile) {
                                response.writeHead(404);
                                response.write('Voice profile not found');
                                response.end();
                                return;
                            }
                            response.writeHead(200);
                            response.write(JSON.stringify(voiceProfile));
                            response.end();
                        });
                    } else{
                        response.writeHead(400);
                        response.write('This is GET method');
                        response.end();
                    }
                break;
                case '/vpadd':
                    if (request.method == 'POST') {
                        request.on('data', (chunk) => {
                            body.push(chunk);
                        }).on('end',async () => {
                            try {
                                body = JSON.parse(Buffer.concat(body).toString());
                            } catch (e) {
                                response.writeHead(400);
                                response.write('Not valid JSON');
                                response.end();
                                return;
                            }

                            let api_token = body.api_token;

                            if (core.configuration.api_token != api_token) {
                                response.writeHead(401);
                                response.write('Api token (╯°□°）╯︵ ┻━┻');
                                response.end();
                                return;
                            }

                            let user_id = body.user_id;
                            let guild_id = body.guild_id;
                            let voicepoints = body.voicepoints;

                            if (!user_id || !guild_id || !voicepoints) {
                                response.writeHead(400);
                                response.write('Specify user_id, guild_id and voicepoints');
                                response.end();
                                return;
                            }

                            if (isNaN(voicepoints)) {
                                response.writeHead(400);
                                response.write('Voicepoints must be a number');
                                response.end();
                                return;
                            }

                            let voiceProfile = core.findVoiceProfile(user_id, guild_id);

                            if (!voiceProfile) {
                                response.writeHead(404);
                                response.write('Voice profile not found');
                                response.end();
                                return;
                            }

                            voiceProfile.voicepoints += voicepoints;

                            response.writeHead(200);
                            response.write('Done!');
                            response.end();
                            
                        });
                    } else{
                        response.writeHead(400);
                        response.write('This is POST method');
                        response.end();
                    }
                break;
                case '/auth':
                    // console.log((new Date()) + ' Received request for ' + request.url);
                    if (request.method == "POST") {
                        request.on('data', (chunk) => {
                            body.push(chunk);
                        }).on('end',async () => {
                            body = JSON.parse(Buffer.concat(body).toString());
                            let player = this.players.find(player => player.code == body.code);
                            if (!player) {
                                response.writeHead(400);
                                response.write('Invalid code');
                                response.end();
                            } else {
                                response.writeHead(200);
                                await core.client.users.fetch(player.user_id).then(p => {
                                    let response_data = {
                                        voicepoint: player.voice_profile.voicepoint,
                                        tag: p.tag,
                                        avatar: p.avatar,
                                        user_id: p.id,
                                    }
                                    response.write(JSON.stringify(response_data));
                                });
                                response.end();
                            }
                        });
                    } else if(request.method == "OPTIONS") {
                        response.writeHead(200);
                        response.end();
                    } else {
                        response.writeHead(400);
                        response.write('This is POST method');
                        response.end();
                    }
                    
                break;
                case '/profiles':
                    // console.log((new Date()) + ' Received request for ' + request.url);
                    if (request.method == "GET") {
                        request.on('data', (chunk) => {
                            body.push(chunk);
                        }).on('end',async () => {
                            try {
                                body = JSON.parse(Buffer.concat(body).toString());
                            } catch (e) {
                                response.writeHead(400);
                                response.write('Not valid JSON');
                                response.end();
                                return;
                            }

                            let api_token = body.api_token;

                            if (core.configuration.api_token != api_token) {
                                response.writeHead(401);
                                response.write('Api token (╯°□°）╯︵ ┻━┻');
                                response.end();
                                return;
                            }
                            
                            response.writeHead(200);
                            // JSON.stringify(voiceProfile);
                            let voiceProfileExtension = core.getExtension('VoiceProfileExtension');
                            // voiceProfileExtension.fetchVoiceProfiles();
                            response.write(JSON.stringify(voiceProfileExtension.voiceProfiles));
                            response.end();
                            
                        });
                    } else if (request.method == "PATCH") {
                        request.on('data', (chunk) => {
                            body.push(chunk);
                        }).on('end',async () => {
                            try {
                                body = JSON.parse(Buffer.concat(body).toString());
                            } catch (e) {
                                response.writeHead(400);
                                response.write('Not valid JSON');
                                response.end();
                                return;
                            }

                            let api_token = body.api_token;

                            if (core.configuration.api_token != api_token) {
                                response.writeHead(401);
                                response.write('Api token (╯°□°）╯︵ ┻━┻');
                                response.end();
                                return;
                            }

                            let user_id = body.user_id;
                            let guild_id = body.guild_id;

                            if (!user_id || !guild_id) {
                                response.writeHead(400);
                                response.write('Specify user_id and guild_id');
                                response.end();
                                return;
                            }

                            let voiceProfileExtension = core.getExtension('VoiceProfileExtension');
                            let profile = voiceProfileExtension.findVoiceProfile(user_id, guild_id);

                            if (!profile) {
                                response.writeHead(404);
                                response.write('User profile not found');
                                response.end();
                                return;
                            }

                            let values = [];

                            let isError = false;
                            let errorText = "";                            

                            console.log(profile);

                            let defaultKeys = ['experience', 'level', 'pray_date', 'pray_streak', 'voicepoints'];                            

                            if (body.pray_date) {
                                body.pray_date = new Date(body.pray_date);
                            }

                            defaultKeys.forEach(key => {
                                if (body[key]) {
                                    if (isNaN(body[key])) {
                                        isError = true;
                                        errorText += `Not valid ${key}\n`;
                                    } else {
                                        if (key != 'pray_date') {
                                            body[key] = +body[key];
                                        }
                                    }
                                }
                            });
                            
                            if (isError) {
                                response.writeHead(400);
                                response.write(errorText);
                                response.end();
                                return;
                            }

                            defaultKeys.forEach(key => {
                                if (body[key] || body[key] === 0) {
                                    profile[key] = body[key];
                                }
                            });
                            
                            console.log(profile);
                            
                            response.writeHead(200);
                            response.write('Done');
                            response.end();                            
                        });
                        
                    } else {
                        response.writeHead(400);
                        response.write('This is GET or PATCH method');
                        response.end();
                    }
                    
                break;
                default:
                    response.writeHead(404);
                    response.end();
            }
        });

        this.server.listen(core.configuration.server_port, () => {
            // console.log((new Date()) + ` Server is listening on port ${this.client.server_port}`);
        });
        
        this.wsServer = new WebSocketServer({
            httpServer: this.server,
            autoAcceptConnections: false
        });

        this.wsServer.on('request', (request) => {
            // if (!originIsAllowed(request.origin)) {
            //     // Make sure we only accept requests from an allowed origin
            //     request.reject();
            //     console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
            //     return;
            // }
            
            try {
                if (!Array.isArray(request.requestedProtocols) 
                    || !request.requestedProtocols[1] 
                    || request.requestedProtocols[0] != 'access_code'
                ) {
                    return request.reject(1002, 'Invalid requestedProtocols');
                }
                // console.log(request);
                let code = request.requestedProtocols[1].toUpperCase();
                let player = this.players.find(player => player.code == code);
                // console.log(player)
                if (!player) {
                    return request.reject(1002, 'Invalid code');
                }
                
                let connection = request.accept('access_code', request.origin);
                connection.player = player;
                this.connections.push(connection);
                this.sendConnectedPlayers();
                connection.on('message', (message) => {
                    let data = JSON.parse(message.utf8Data);
                    let key = Object.keys(data)[0].toLowerCase();
                    switch (key) {
                        case 'bet':
                            data = data.bet;
                            let gambleExtension = core.getExtension('GambleExtension');
                            let res = gambleExtension.roulette(null, [null, data.place, data.bet], player.user_id, player.guild_id);
                            this.tableBets = res;
                            this.sendMessageToAll({bets: this.tableBets});
                        break;
                    }
                });
                connection.on('close', (reasonCode, description) => {
                    this.connections.splice(this.connections.indexOf(connection), 1);
                    this.sendConnectedPlayers();
                });
            } catch (e) {
                console.error(e);
                return e;
            }
        });
    }

    commands() {
        return [
            require('./commands/auth'),
        ]
    }

    sendMessageToAll(data) {
        this.connections.forEach((client) => {
            client.sendUTF(JSON.stringify(data));
        });
    }

    async sendConnectedPlayers () {
        let connectedPlayers = [];
        for await (const connection of this.connections) {
            await core.client.users.fetch(connection.player.user_id).then(u => {
                connectedPlayers.push({
                    voicepoint: connection.player.voice_profile.voicepoints,
                    username: u.username,   
                    tag: u.discriminator,
                    avatar: u.avatar,
                    user_id: connection.player.user_id,
                });
            });
        }
        this.sendMessageToAll({players: connectedPlayers});
        this.sendMessageToAll({bets: this.tableBets});
    }

    sendStartRoulette (number) {
        this.tableBets = [];
        this.sendMessageToAll({spin: number});
        setTimeout(() => {
            this.sendConnectedPlayers()
        }, 2000);        
    }
}

module.exports = RouletteWebsocket;