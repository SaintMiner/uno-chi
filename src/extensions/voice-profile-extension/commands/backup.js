function backup(message) {
    core.getExtension('VoiceProfileExtension').backup();
}

const command = {
    slug: 'backup',
    execute: backup,
    isPrivate: true,
}

module.exports = command;