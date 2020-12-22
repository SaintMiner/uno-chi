module.exports = function(client) {
    console.log('Initialising modules...');
    client.modules = [];
    var normalizedPath = require("path").join(__dirname, 'modules');
    require("fs").readdirSync(normalizedPath).forEach((file) => {        
       client.modules.push(new (require(`./modules/${file}`))(client));
    });
}
