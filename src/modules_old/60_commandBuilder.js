const Module = require('../classes/module.js');

class CommandBuilder extends Module {
    constructor(client) {
        super(client, {
            name: 'CommandBuilder'
        });
    }
    
    example()
    {
        let commands = [
            {
                slug: 'command',
                execution: () => {},
                subcommands: [
                    {
                        slug: 'command',
                        execution: () => {},
                        params: ['param1', 'param2'],
                        validation: [
                            {
                                param: 'param1',
                                validation: (param) => {return true}
                            }
                        ]
                    }
                ]
            }
        ]
    }
}

module.exports = CommandBuilder;