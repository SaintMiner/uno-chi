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
        console.log('Loading database models...');
        let files =require("fs").readdirSync(normalizedPath);
        for (const file of files) {
            let modelData = require(`../models/${file}`);            
            let Model =  this.connection.loadSchema( modelData.name,  modelData);
            this.client.models.push(Model);
            //migrate tables in database
            Model.syncDB((err, result) => { 
                if (err) throw err;
                // Model.execute_query(`SELECT * FROM ${modelData.table_name}`, [], (err, res) => {
                //     if(err) throw err;
                //     //fetch data from database to client local storage
                //     this.client.storage[modelData.table_name] = Object.assign([], res.rows);
                // });
            });            
            Model.stream({}, {raw: true}, (reader) => {
                let row, data = [];
                while (row = reader.readRow()) {
                    data.push(row);
                }                
            }, function(err){
                console.log(`All [${modelData.name}] model data fetched!`);
            })
        }
        // await test.forEach(async (file) =>  {      
        //     let modelData = await require(`../models/${file}`);
        //     let Model = await this.connection.loadSchema(modelData.name, modelData);
        //     //migrate tables in database
        //     Model.syncDB((err, result) => { 
        //         if (err) throw err;
        //         Model.execute_query(`SELECT * FROM ${modelData.table_name}`, [], (err, res) => {
        //             if(err) throw err;
        //             //fetch data from database to client local storage
        //             this.client.storage[modelData.table_name] = Object.assign([], res.rows);
        //         });
        //     });            
        //     this.client.models.push(Model);
        // });

    }

    saveData(model, data) {
        console.log(data);
        console.log(model);
    }

}

module.exports = DatabaseModule;