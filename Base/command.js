class Command {


    constructor (client, {
        name = null,
        description = 'No description provided',
        category = 'Miscellaneous',
        usage = 'No usage provided',
        enabled = true,
        guildOnly = false,
        aliases = newArray(),
        permLevel = 'user'
    }) {
        this.client = client;
        this.conf = {enabled, guildOnly, aliases, permLevel };
        this.help = { name, descripotion, category, usage};
    }
}

modeule.exports = Command;