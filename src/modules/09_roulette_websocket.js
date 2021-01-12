const Module = require('../classes/module.js');

const WebSocketServer = require('websocket').server;
const http = require('http');

class RouletteWebsocket extends Module {
    constructor(client) {
        super(client, {
            name: 'RouletteWebsocket'
        });
        this.init();
        this.connections = [];
        this.players = [];
        this.tableBets = [];
    }

    init() {
        this.server = http.createServer((request, response) => {
            const { headers, method, url } = request;
            response.setHeader("Access-Control-Allow-Origin", "*");
            response.setHeader('Content-Type', 'application/json');
            response.setHeader("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS");
            response.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
            switch (url) {
                case '/auth':
                    // console.log((new Date()) + ' Received request for ' + request.url);
                    if (request.method == "POST") {
                        let body = [];
                        request.on('data', (chunk) => {
                            body.push(chunk);
                          }).on('end',async () => {
                            body = JSON.parse(Buffer.concat(body).toString());
                            // console.log(body.code);
                            // console.log(headers.code);
                            // console.log(body.code);
                            let player = this.players.find(player => player.code == body.code);
                            if (!player) {
                                response.writeHead(400);
                                response.write('Invalid code');
                                response.end();
                            } else {
                                response.writeHead(200);
                                await this.client.users.fetch(player.user_id).then(p => {
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
                default:
                    response.writeHead(404);
                    response.end();
            }
        });

        this.server.listen(this.client.server_port, () => {
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
                if (!Array.isArray(request.requestedProtocols) || !request.requestedProtocols[1] || request.requestedProtocols[0] != 'access_code') {
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
                            let gambleCommand = this.client.modules
                                .find(m => m.name == 'Commands').commands
                                .find(command => command.settings.slug == 'gamble');
                            // console.log(gambleCommand);
                            let res = gambleCommand.roulette(null, [null, data.place, data.bet], player.user_id, player.guild_id);
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

    sendMessageToAll(data) {
        this.connections.forEach((client) => {
            client.sendUTF(JSON.stringify(data));
        });
    }

    async sendConnectedPlayers () {
        let connectedPlayers = [];
        for await (const connection of this.connections) {
            await this.client.users.fetch(connection.player.user_id).then(u => {
                // console.log(u);
                connectedPlayers.push({
                    voicepoint: connection.player.voice_profile.voicepoint,
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
        setTimeout(this.sendConnectedPlayers(), 2000);        
    }
}

module.exports = RouletteWebsocket;