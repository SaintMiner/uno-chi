const decache = require('decache');

module.exports = function(client) {
    console.log('Initialising modules...');
    client.modules = [];
    let normalizedPath = require("path").join(__dirname, '/modules')
        count = 0;
    require("fs").readdirSync(normalizedPath).forEach((file) => {
        if(file.endsWith(`.js`)){

            client.modules.push(new (require(`${normalizedPath}/${file}`))(client));
            decache(file);
            count++;
        }
    });
    console.log(`Initialised ${count} modules...`);
}