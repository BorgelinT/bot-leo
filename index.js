const fs = require('node:fs');
const path = require('node:path');
const { Client, Intents, Collection } = require('discord.js');
const { token, guildId, roles} = require('./config.json');


const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

let emojinames = ["beeangery", "Angery", "OwOmen", "Borpagun", "nobuild", "Facepalm", "peepoparty", "trumpW", "😡"];

client.on('ready', () => {
  console.log(`Kirjauduttu sisään käyttäjänä ${client.user.tag}!`);
  client.user.setActivity('Pools, Hot Tubs, and Beaches',{type: 'STREAMING', url: 'https://www.twitch.tv/taylor_jevaux'});

  const filter = (reaction, user) => {
    return emojinames.includes(reaction.emoji.name);
  };
  let rolesChannel = client.channels.cache.get('982405191309619230');
  rolesChannel.messages.fetch(`982444567158751262`).then(message => {

    const collector = message.createReactionCollector({ filter }); 
    collector.on('collect', (reaction, user) => {
      console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
      if (reaction.emoji.name !== "😡") {
        message.guild.members.fetch(user.id).then(member => {
                member.roles.add(roles[reaction.emoji.name]);  
          });
        console.log(roles.beeangery)
      }
      else if (reaction.emoji.name === "😡") {
          for (let i = 0; i <emojinames.length -1; i++) {
          message.guild.members.fetch(user.id).then(member => {
            member.roles.remove(roles[emojinames[i]]);
          });
        }
      }
    });
  });
});

// bot message handler
client.on('message', msg => {
    if (msg.content.includes('say')) {
      msg.delete();
    }
  })
  
  client.on('message', message => {
      if (message.content.startsWith('say')) {
          let SayMessage = "";
          let server = message.guild;
          let user = server.members.cache.get(message.author.id);
          let isAdmin = user.roles.cache.some(role => role.id === '261768424215150597');
          if (message.author.bot) return;
          // don't include command in bots message
          SayMessage = message.content.slice(3).trim();
          if (isAdmin) {
            message.channel.send(SayMessage);
          }
      }
  });


// commands handler
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'Jotain meni nyt pieleen!', ephemeral: true });
	}
});
// role handler




const MessageNumber = '982444567158751262' // message on #roles


// let rolesChannel = client.channels.cache.get('982405191309619230');
// rolesChannel.messages.fetch(`982444567158751262`);

// const collector = message.createReactionCollector({ filter });


// collector.on('collect', (reaction, user) => {
//     console.log(reaction)
//     message.guild.members.fetch(user.id).then(member => {
//          member.roles.add(lolRole);  
//     });
// });

// client.on('messageReactionAdd', async (reaction, user) => {
//     console.log('Message Reaction Add Top');

//     let applyRole = async () => {
//         let emoji = reaction.emoji.name;
//         let role = reaction.message.guild.roles.cache.find;
//         let member = reaction.message.guild.members.cache.find(member => member.id == user.id);
//         if (role && member && (emoji = 'beeangery')) {
//             await member.roles.add(lolRole);
//         }
//         if (role && member && (emoji = 'OwOmen')) {
//             await member.roles.add(valorantRole);
//         }
//         if (role && member && (emoji = 'angery')) {
//             await member.roles.add(apexlegendsRole);
//         }
//         if (role && member && (emoji = 'borpagun')) {
//             await member.roles.add(csgoRole);
//         }
//         if (role && member && (emoji = 'nobuild')) {
//             await member.roles.add(fortniteRole);
//         }
//         if (role && member && (emoji = 'Facepalm')) {
//             await member.roles.add(warframeRole);
//         }
//         if (role && member && (emoji = 'peepoparty')) {
//             await member.roles.add(jackboxRole);
//         }
//         if (role && member && (emoji = 'trumpW')) {
//             await member.roles.add(rustRole);
//         }
//         if (emoji = '😡') {
//             await member.roles.remove(lolRole);
//             await member.roles.remove(valorantRole);
//             await member.roles.remove(apexlegendsRole,);
//             await member.roles.remove(csgoRole);
//             await member.roles.remove(fortniteRole);
//             await member.roles.remove(warframeRole);
//             await member.roles.remove(jackboxRole);
//             await member.roles.remove(rustRole);
//         }
//     }
//     if (reaction.message.partial) {
//         try {
//             let msg = await reaction.message.fetch()
//             console.log(msg.id);
//             if (msg.id === MessageNumber) {
//                 applyRole();
//             }
//         }
//         catch (err) {
//             console.log(err);
//         }
//     }
//     else {
//         console.log('Not a Partial');
//         if (reaction.message.id === MessageNumber) {
//             console.log('Not a Partial - applied')
//             applyRole();
//         }
//     }
// });

client.login(token)