const Module = require('../classes/module.js');
var ExpressCassandra = require('express-cassandra');

class DatabaseModule extends Module {
    constructor(client) {
        super(client, {
            name: 'Database'
        });
        this.connectDatabase();
        this.loadModels();
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
                defaultReplicationStrategy : {
                    class: 'SimpleStrategy',
                    replication_factor: 3
                },
                migration: 'safe',
            }
        });
    }

    loadModels() {
        this.client.models = [];
        this.client.storage = [];
        var normalizedPath = require("path").join(__dirname, '../models');
        require("fs").readdirSync(normalizedPath).forEach(async (file) => {      
            let modelData =  require(`../models/${file}`);
            let Model = this.connection.loadSchema(modelData.name, modelData);
            await Model.syncDB(function(err, result) { //migrate/update tables in database
                if (err) throw err;
            });
            Model.execute_query(`SELECT * FROM ${modelData.table_name}`, [], (err, res) => {
                if(err) throw err;
                this.client.storage[modelData.table_name] = res.rows;
            });
            this.client.models.push(Model);
        });
    }

}

module.exports = DatabaseModule;