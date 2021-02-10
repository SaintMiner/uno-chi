const ExpressCassandra = require('express-cassandra');

const { info } = require('pretty-console-logs');

const Extension = require('@core/classes/extension');

class DatabaseExtension extends Extension {
    constructor() {
        super();
        let configuration = core.configuration;
        
        info(`[${this.name}] Connecting to database...`);
        this.connection = ExpressCassandra.createClient({
            clientOptions: {
                contactPoints: configuration.database.contactPoints,
                protocolOptions: { port: 9042 },
                keyspace: configuration.database.keyspace,
                queryOptions: {consistency: ExpressCassandra.consistencies.one}
            },
            ormOptions: {
                defaultReplicationStrategy : {
                    class: 'SimpleStrategy',
                    replication_factor: 3
                },
                migration: 'alter',
            }
        });
        info(`[${this.name}] Connected to database`);

        core.getConnection = () => this.getConnection();
    }
    
    getConnection() {
        return this.connection;
    }
}

module.exports = DatabaseExtension