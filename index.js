const Discord = require("discord.js");
const YTDL = require("ytdl-core");

const TOKEN = "NDk1ODExMjg1MjM4Mjg0Mjk4.DpPbEQ.PndVkdsymCpoISEjf-5kUIilPVw"
const PREFIX = "`lopis"

function generateHex() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "adioonly"}));

    server.queue.shift();

    server.dispatcher.on("end", function(){
        if(server.queue[0]) play(connection, message);
        else connection.disconnect();
    });
}

var fortunes = [
    "Yes",
    "No",
    "Maybe",
    "Stupid"
];    

var bot = new Discord.Client();

var servers = {};

bot.on("ready", function() {
    console.log("Ready");
});

bot.on("guildMemberadd", function(member) {
    member.guild.channels.find("name", "general").sendMessage(member.topString() + " Welsome bitchi ie boty");

    member.addRole(member.guild.roles.find("name", "Normal Creep"));

    member.guild.creatRole({
        name:member.user.username,
        color: generateHex(),
        permissions: []
    }).then(function(role){
        member.addRole(role);
    });
});

bot.on("message", function(message) {
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0].toLowerCase()) {
        case "ping":
            message.channel.sendMessage("Pong!");
            break;
        case "info":
            message.channel.sendMessage("I'm Lopis super bot ever");
            break;
        case "8ball":
            if (args[1]) message.channel.sendMessage(fortunes[Math.floor(Math.random() * fortunes.length)]);
            else message.channel.sendMessage("Can't read that");
            break;
        case "embed":
            var embed = new Discord.RichEmbed()
                .addField("Facebook", "https://www.facebook.com/Lopiinaz/", true)
                .addField("Instagram", "https://www.instagram.com/lopiinaz/", true)
                .addField("Instagram", "https://www.instagram.com/throatcutters/", true)
                .addField("Test Tillte", "Test Description")
                .addField("Test Tillte", "Test Description")
                .setColor(0x00FFF)
                .setFooter("This message is pretty cool, ohh fuck my life")
                .setThumbnail(message.author.avatarURL)
            message.channel.sendEmbed(embed);
            break;
        case "owner":
            message.channel.sendMessage(message.author.toString() + " Orang ganteng");
            break;
        case "removerole":
            message.member.sendMessage("removed");
            message.member.removeRole(message. member.guild.roles.find("name", "Normal Creep"));
            break;    
        case "deleterole":
            message.member.guild.roles.find("name", "Normal Creep").delete();
            message.channel.sendMessage("delet");
            break;  
        case "play":
            if (args[1]) {
                message.channel.sendMessage("please Provide a link");
                return;
            }

            if (!message.member.voiceChannel) {
                message.channel.sendMessage("You must be in a voice channel");
                return;
            }

            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };

            var server = servers[message.guild.id]

            server.queue.push(args[10]);

            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                play(connection, message);
            });
            break;
        case "skip":
            var server = servers[message.guild.id];

            if (server.dispatcher) server.dispatcher.end();
            break;
        case "stop":
            var server = servers[message.guild.id];

            if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
            break;
        default:
            message.channel.sendMessage("Invalid command");        
    }
});

bot.login(TOKEN);