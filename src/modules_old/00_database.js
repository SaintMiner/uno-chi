const Module = require('../classes/module.js');
var ExpressCassandra = require('express-cassandra');

class DatabaseModule extends Module {
    constructor(client) {
        super(client, {
            name: 'Database'
        });
        this.kek = 'kek';
        this.connectDatabase();
        this.loadModels();
        this.loadFunctions();
    }

    connectDatabase() {
        this.client.database.connection = this.connection = ExpressCassandra.createClient({
            clientOptions: {
                contactPoints: this.client.database.contactPoints,
                protocolOptions: { port: 9042 },
                keyspace: this.client.database.keyspace,
                queryOptions: {consistency: ExpressCassandra.consistencies.one}
            },
            ormOptions: {
                udts: {
                    time_spent: {
                        name: 'text',
                        time: 'int',
                    },
                },
                defaultReplicationStrategy : {
                    class: 'SimpleStrategy',
                    replication_factor: 3
                },
                migration: 'alter',
            }
        });
    }

    loadModels() {
        this.client.models = [];
        this.client.storage = [];
        var normalizedPath = require("path").join(__dirname, '../models');
        console.log('Loading database models...');
        let files = require("fs").readdirSync(normalizedPath);
        
        for (const file of files) {
            let modelData = require(`../models/${file}`);       
            let Model =  this.connection.loadSchema( modelData.name,  modelData);
            this.client.models.push(Model);
            //migrate tables in database
            
            
            
            Model.syncDB((err, result) => { 

                if (err) throw err;
                Model.execute_query(`SELECT * FROM ${modelData.table_name}`, [], (err, res) => {
                    if(err) throw err;
                    //fetch data from database to client local storage
                    this.client.storage[modelData.table_name] = Object.assign([], res.rows);
                });                
            });

            
        }
    }

    loadFunctions() {
        this.client.getVoiceProfile = (user_id, guild_id) => this.getVoiceProfile(user_id, guild_id);
        this.client.getVoiceProfileFromMessage = (message) => this.getVoiceProfileFromMessage(message);
    }

    getVoiceProfile(user_id, guild_id) {
        let profile = this.client.storage['voice_profiles']
            .find(voice_profile => voice_profile.guild_id == guild_id && voice_profile.user_id == user_id);
        return profile;
    }

    getVoiceProfileFromMessage(message) {
        return this.getVoiceProfile(message.author.id, message.guild.id);
    }
}

module.exports = DatabaseModule;