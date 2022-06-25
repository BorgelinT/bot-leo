const fs = require('node:fs');
const path = require('node:path');
const { Client, Intents, Collection, MessageButton, MessageEmbed, MessageActionRow } = require('discord.js');
const { token, roles, emojis } = require('./config.json');


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
const emojinames = ['beeangery', 'Angery', 'OwOmen', 'Borpagun', 'nobuild', 'highfive', 'peepoparty', 'trumpW', '😡'];

client.on('ready', () => {
	console.log(`Kirjauduttu sisään käyttäjänä ${client.user.tag}!`);
	client.user.setActivity('Pools, Hot Tubs, and Beaches', { type: 'STREAMING', url: 'https://www.twitch.tv/anichkayoga' });

	// eslint-disable-next-line no-unused-vars
	const exampleEmbed = new MessageEmbed()
		.setColor('#e98205')
		.setTitle('Roolien tunnukset:')
		.setDescription(
			`<${emojis.beeangery}> = <@&${roles.beeangery}>\n<${emojis.OwOmen}> = <@&${roles.OwOmen}>\n<${emojis.Angery}> = <@&${roles.Angery}>\n<${emojis.Borpagun}> = <@&${roles.Borpagun}>\n<${emojis.nobuild}> = <@&${roles.nobuild}>\n<${emojis.highfive}> = <@&${roles.highfive}>\n<${emojis.peepoparty}> = <@&${roles.peepoparty}>\n<${emojis.trumpW}> = <@&${roles.trumpW}>\n`,
		)
		.setImage('https://i.imgur.com/swvOSqw.jpeg')
		.setFooter({ text: 'Lisää itsesi rooliin reagoimalla alta:', iconURL: 'https://i.imgur.com/V1pm6qE.png' });

	// eslint-disable-next-line no-unused-vars
	const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId('primary')
				.setLabel('Poista kaikki peliroolit')
				.setStyle('DANGER')
				.setDisabled(true),
		);
	const rolesChannel = client.channels.cache.get('982405191309619230');
	// wtf don't send this men
	// const mem = client.channels.cache.get('370233724811345921');
	// const logo = mem.guild.iconURL();
	// mem.send({ files: [{ attachment: logo }] });
	rolesChannel.messages.fetch('983144971366461490').then(message => {
		// rolesChannel.send({ embeds: [exampleEmbed], components: [row] }).then(message => {
		// 	message.react(emojis.beeangery);
		// 	message.react(emojis.OwOmen);
		// 	message.react(emojis.Angery);
		// 	message.react(emojis.Borpagun);
		// 	message.react(emojis.nobuild);
		// 	message.react(emojis.highfive);
		// 	message.react(emojis.peepoparty);
		// 	message.react(emojis.trumpW);

		const filter = (reaction, user) => {
			return emojinames.includes(reaction.emoji.name) && user.id !== message.author.id;
		};

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

client.on('interactionCreate', interaction => {
	const member = interaction.member;
	if (!interaction.isButton()) return;
	interaction.deferUpdate();
	console.log('here');
	for (let i = 0; i < emojinames.length - 1; i++) {
		member.roles.remove(roles[emojinames[i]]);
	}
	return;
});

// bot message handler (admins can talk using the bot)

client.on('message', message => {
	if (message.content.startsWith('say')) {
		message.delete();
		const server = message.guild;
		const user = server.members.cache.get(message.author.id);
		// admin only, TODO: add admin role id to config.js
		const hasHumanRights = user.roles.cache.some(role => role.id === '261768424215150597' || '783378591273582646');
		if (message.author.bot) return;
		// don't include command in bots message
		const SayMessage = message.content.slice(3).trim();
		if (hasHumanRights) {
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
