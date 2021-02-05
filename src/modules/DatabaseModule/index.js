const ExpressCassandra = require('express-cassandra');

const { info, warn, error, log } = require('pretty-console-logs');

const Module = require('@core/classes/module');

class DatabaseModule extends Module {
    constructor() {
        super(1);
    }

    init() {
        let configuration = core.getConfiguration();
        info(`[${this.name}] Connecting to database...`);
        this.connection = ExpressCassandra.createClient({
            clientOptions: {
                contactPoints: configuration.database.contactPoints,
                protocolOptions: { port: 9042 },
                keyspace: configuration.database.keyspace,
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
        info(`[${this.name}] Connected to database`);
        core.getConnection = () => this.getConnection();
    }
    
    getConnection() {
        return this.connection;
    }
}

module.exports = DatabaseModule