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
    }

    init() {
        this.server = http.createServer((request, response) => {
            const { headers, method, url } = request;
            switch (url) {
                case '/auth':
                    console.log((new Date()) + ' Received request for ' + request.url);
                    if (request.method == "POST") {
                        let body = [];
                        request.on('data', (chunk) => {
                            body.push(chunk);
                          }).on('end',async () => {
                            body = JSON.parse(Buffer.concat(body).toString());
                            // console.log(body.code);
                            // console.log(headers.code);
                            console.log(body.code);
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
            console.log((new Date()) + ` Server is listening on port ${this.client.server_port}`);
        });
        
        this.wsServer = new WebSocketServer({
            httpServer: this.server,
            autoAcceptConnections: false
        });

        this.wsServer.on('request', function(request) {
            // if (!originIsAllowed(request.origin)) {
            //     // Make sure we only accept requests from an allowed origin
            //     request.reject();
            //     console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
            //     return;
            // }
              
            var connection = request.accept('json', request.origin);
            console.log((new Date()) + ' Connection accepted.');
            this.connections.push(connection);
            connection.on('message', (message) => {
                // console.log(message)
                this.connections.forEach(function(client) {
                    if (message.type === 'utf8') {
                        // console.log('Received Message: ' + message.utf8Data);
                        client.sendUTF(JSON.stringify(message));
                    }
                });
            });
            connection.on('close', function(reasonCode, description) {
                console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
            });
        });
    }
}

module.exports = RouletteWebsocket;