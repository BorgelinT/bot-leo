const { Client, Intents } = require('discord.js');

const content ="test \n test \n test \n"
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

const prefix = "!";
const Role = '982286554057809941'
const MessageNumber = '982284004038439003'



client.on("message", msg => {
  if (msg.content.includes("!say")) {
    msg.delete();
  }
})

client.on('message', message => {
    if (message.content.startsWith(prefix + 'say')) {
        let SayMessage = "";
        if (message.author.bot) return;
        // don't include command in bots message
        SayMessage = message.content.slice(4).trim();
        message.channel.send(SayMessage)
    }
});

client.on('messageReactionAdd', async (reaction, user) => {
    console.log("Message Reaction Add Top");

    let applyRole = async () => {
        let emojiName = reaction.emoji.name;
        let role = reaction.message.guild.roles.cache.find;
        let member = reaction.message.guild.members.cache.find(member => member.id == user.id);
        if (role && member) {
            console.log("Role and Member Found");
            await member.roles.add(Role);
        }
    }
    if (reaction.message.partial) {
        try {
            let msg = await reaction.message.fetch()
            console.log(msg.id);
            if (msg.id === MessageNumber) {
                console.log("Cached - Applied");
                applyRole();
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    else {
        console.log("Not a Partial");
        if (reaction.message.id === MessageNumber) {
            console.log("Not a Partial - applied")
            applyRole();
        }
    }
});

client.login(process.env.TOKEN)