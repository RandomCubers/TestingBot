const Discord = require('discord.js');
const client = new Discord.Client();

var prefix = '!mb';
var blacklist = [];
var embed_author = 'Moderation Bot';
var embed_footer = 'Powered By Admin Magic Near You';

const fs = require('fs');
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./Commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles){
    const command = require(`./Commands/${file}`);

    client.commands.set(command.name, command);
}

client.on('ready', ()=> {
    console.log('This bot is online')

    client.user.setActivity('with a BANHAMMER')
})

client.on('message', message => {

    var sender = message.author;
    var msg = message.content.toLowerCase();
    var mentions = message.mentions.users.first();
    
    let foundInText = false;
    let perms_a = false;
    let args = message.content.toLowerCase().slice(prefix.length).split(" ");

    if (message.author.bot) return;

    if (message.member.hasPermission('ADMINISTRATOR', explicit = true)) perms_a = true;

    if (msg.startsWith(prefix)) {
        switch(args[1]) {
            case 'ping':
                client.commands.get('ping').execute(message, args)
                break;
            case 'help':
                let embed = new Discord.MessageEmbed()
            
                embed.setTitle('Commands')
                embed.setAuthor('Moderation Bot')
                embed.setColor('#3EEAEE')
                embed.setDescription(prefix + ' help: Find the commands this bot uses \n' + prefix + ' kick "user": Kicks the "user" \n' + prefix + ' ban "user" "# of days": Bans the "user" for "# of days" \n' + prefix + ' purge "# of lines": Deletes "# of lines" from the most recent messages \n' + prefix + ' ping: Receive a message from the Moderation Bot :) \n' + prefix + ' setprefix: Changes the prefix this bot uses \n' + prefix + ' blacklist ("Add", "Remove", "View", or "Clear": Add, remove, view, or clear the blacklist \n')
                embed.setFooter('Powered By The Admin Magic Near You')
        
                message.channel.send(embed)     
                break;
            case 'setprefix':
                if (!args[2]) return message.channel.send('Please define a new prefix')
                if (perms_a === true) {
                    prefix = args[2];
                    message.channel.send('Changed Prefix To ' + prefix)
                } else {
                    message.reply('You do not have the permissions to do this')
                }
                break;
            case 'kick':
                if (mentions == null) return message.channel.send('Please define the user')
                if (perms_a === true) {
                    const member = message.guild.member(mentions);
                
                    member
                        .kick()
                        .then( () => {
                            message.reply('Successfully kicked ' + mentions);
                        })
                        .catch(err => {
                            message.reply('An error has occured')
                        })
                } else {
                    message.reply('You do not have permission to do this')
                }
                break;
            case 'ban': 
                if (mentions == null) return message.channel.send('Please define the user')
                if (!args[3]) return message.channel.send('Please define the number of days')

                if (perms_a === true) {
                    const member = message.guild.member(mentions);
                    
                    member
                        .ban(args[3])
                        .then( () => {
                            message.reply('Successfully used the ban hammer on ' + mentions);
                        }).catch(err => {
                            message.reply('An error has occured')
                        })
                } else {
                    message.play('You do not have permission to do this')
                }
                break;
            case 'purge':
                if (!args[2]) return message.channel.send('Please specify the number of lines to delete')
                if (args[3] > 101) return message.channel.send('Puge must be equal to or less than 100')
                if (perms_a === true) {
                    message.channel.bulkDelete(args[2]);
                } else {
                    message.reply('You do not have permission to do this')
                }
                break;
            case 'blacklist':
                if (!args[2]) return message.channel.send('Please choose to add, remove, or check the blacklist')
                if (args[2] == 'add') {

                    var bl_index = blacklist.indexOf(args[3])
                    
                    let in_blacklist = false;

                    if (bl_index != -1) {
                        in_blacklist = true;
                    }

                    if (!in_blacklist) {
                        blacklist.push(args[3].toLowerCase());
                        message.channel.send('Added ' + args[3] + ' to blacklist')
                    } else {
                        message.channel.send(args[3] + ' already in blacklist')
                    }

                    let embed = new Discord.MessageEmbed()
            
                    embed.setTitle('Blacklist')
                    embed.setAuthor(embed_author)
                    embed.setColor('#EC2C2C')
                    embed.setDescription(blacklist)
                    embed.setFooter(embed_footer)
    
                    message.channel.send(embed)
                    return;
                } 
                if (args[2] == 'remove') {
                    var bl_index = blacklist.indexOf(args[3])
                    
                    let in_blacklist = false;

                    if (bl_index != -1) {
                        in_blacklist = true;
                        blacklist.splice(bl_index,1);
                    }

                    if (in_blacklist) {
                        message.channel.send('Removed ' + args[3] + ' from blacklist')
                    } else {
                        message.channel.send('Can not be found in blacklist')
                    }

                    let embed = new Discord.MessageEmbed()
            
                    embed.setTitle('Blacklist')
                    embed.setAuthor(embed_author)
                    embed.setColor('#EC2C2C')
                    embed.setDescription(blacklist)
                    embed.setFooter(embed_footer)
    
                    message.channel.send(embed)
                    return;
                } 
                if (args[2] == 'view') {
                    let embed = new Discord.MessageEmbed()
            
                    embed.setTitle('Blacklist')
                    embed.setAuthor(embed_author)
                    embed.setColor('#EC2C2C')
                    embed.setDescription(blacklist)
                    embed.setFooter(embed_footer)
    
                    message.channel.send(embed)
                    return;
                }
                if (args[2] == 'clear') {

                    message.channel.send('Blacklist cleared')

                    for (var i in blacklist) {
                        blacklist.pop();
                        blacklist.pop();
                    }

                    let embed = new Discord.MessageEmbed()
            
                    embed.setTitle('Blacklist')
                    embed.setAuthor(embed_author)
                    embed.setColor('#EC2C2C')
                    embed.setDescription(blacklist)
                    embed.setFooter(embed_footer)
    
                    message.channel.send(embed)
                    return;
                }
                message.channel.send('Invalid Command. Choose add, remove, or check to blacklist command')
            break;
        }
    }

    for (var i in blacklist) {
        if (message.content.toLowerCase().includes(blacklist[i])) foundInText = true;
    }

    if (foundInText) {
        message.delete();
        message.reply('That word is blacklisted, you cannot use that word')
    }

});

client.login(process.env.token);

