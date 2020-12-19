const { client } = require("./modules/commands");

module.exports = function(client) {
    console.log('Initialising modules...');
    var normalizedPath = require("path").join(__dirname, 'modules');
    require("fs").readdirSync(normalizedPath).forEach((file) => {        
       new (require(`./modules/${file}`))(client);
    });
}
