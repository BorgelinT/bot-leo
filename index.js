const fs = require('node:fs');
const path = require('node:path');
const { Client, Intents, Collection } = require('discord.js');
const { token, roles } = require('./config.json');


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

const emojinames = ['beeangery', 'Angery', 'OwOmen', 'Borpagun', 'nobuild', 'Facepalm', 'peepoparty', 'trumpW', '😡'];

client.on('ready', () => {
	console.log(`Kirjauduttu sisään käyttäjänä ${client.user.tag}!`);
	client.user.setActivity('Pools, Hot Tubs, and Beaches', { type: 'STREAMING', url: 'https://www.twitch.tv/taylor_jevaux' });

	const filter = (reaction) => {
		return emojinames.includes(reaction.emoji.name);
	};

	// todo: add all channel id:s to config
	const rolesChannel = client.channels.cache.get('982405191309619230');
	rolesChannel.messages.fetch('982444567158751262').then(message => {

		const collector = message.createReactionCollector({ filter });
		collector.on('collect', (reaction, user) => {
			console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
			if (reaction.emoji.name !== '😡') {
				message.guild.members.fetch(user.id).then(member => {
					member.roles.add(roles[reaction.emoji.name]);
				});
				console.log(roles.beeangery);
			}
			else if (reaction.emoji.name === '😡') {
				for (let i = 0; i < emojinames.length - 1; i++) {
					message.guild.members.fetch(user.id).then(member => {
						member.roles.remove(roles[emojinames[i]]);
					});
				}
			}
		});
	});
});

// bot message handler (admins can talk using the bot)

client.on('message', message => {
	if (message.content.startsWith('say')) {
		message.delete();
		const server = message.guild;
		const user = server.members.cache.get(message.author.id);
		// admin only, TODO: add admin role id to config.js
		const isAdmin = user.roles.cache.some(role => role.id === '261768424215150597');
		if (message.author.bot) return;
		// don't include command in bots message
		const SayMessage = message.content.slice(3).trim();
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
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'Jotain meni nyt pieleen!', ephemeral: true });
	}
});

client.login(token);