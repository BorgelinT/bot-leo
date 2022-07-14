const fs = require('node:fs');
const path = require('node:path');
const { Client, Intents, Collection, MessageButton, MessageEmbed, MessageActionRow } = require('discord.js');
const { request } = require('undici');
const { token, roles, emojis, waifuAPI } = require('./config.json');


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
			`<${emojis.beeangery}> = <@&${roles.beeangery}>\n
			<${emojis.OwOmen}> = <@&${roles.OwOmen}>\n
			<${emojis.Angery}> = <@&${roles.Angery}>\n
			<${emojis.Borpagun}> = <@&${roles.Borpagun}>\n
			<${emojis.nobuild}> = <@&${roles.nobuild}>\n
			<${emojis.highfive}> = <@&${roles.highfive}>\n
			<${emojis.peepoparty}> = <@&${roles.peepoparty}>\n
			<${emojis.trumpW}> = <@&${roles.trumpW}>\n`,
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
	const botChannel = client.channels.cache.get('834439402306011146');
	const genshinChannel = client.channels.cache.get('786653057885667328');
	// const mem = client.channels.cache.get('370233724811345921');
	// const logo = mem.guild.iconURL();
	// mem.send({ files: [{ attachment: logo }] });

	async function getJSONResponse(body) {
		let fullBody = '';
		for await (const data of body) {
			fullBody += data.toString();
		}
		return JSON.parse(fullBody);
	}

	async function requestBuilder(type) {
		if (type !== 'bonk') {
			const index = Math.floor(Math.random() * waifuAPI[type].length);
			const category = waifuAPI[type][index];
			console.log(category);
			const animetyty = await request(`${waifuAPI.url}${type}/${category}`);
			return await getJSONResponse(animetyty.body);
		}
		else if (type === 'bonk') {
			const category = type;
			type = 'sfw';
			const animetyty = await request(`${waifuAPI.url}${type}/${category}`);
			return await getJSONResponse(animetyty.body);
		}
	}

	const re = /anime|^2d$|2d |2d-|animetyty|owo|uwu/i;
	const nsfw = /^nsfw$/i;

	client.on('messageCreate', async msg => {
		// const tokenrequest = await request('https://id.twitch.tv/oauth2/token?client_id=&client_secret=&grant_type=client_credentials');
		// await getJSONResponse(tokenrequest.body).then(access_token => {
		// 	const twitchToken = access_token;
		// 	console.log(twitchToken);
		// });
		// const twitchRequest = await request('https://api.twitch.tv/helix/streams', ({ 'Authorization': 'Bearer ', 'Client-Id': '' }));
		// const trequest = getJSONResponse(twitchRequest.body).then(user_name => console.log(user_name));
		// console.log('twitch' + trequest);

		// random anime tyts
		if (Math.random() * 10 > 9 && msg.author.id !== '982274221541580912') {
			const randomTimeout = Math.random() * 7200 * 1000;
			const image = await requestBuilder('sfw');
			setTimeout(() => {
				genshinChannel.send(image['url']);
			}, randomTimeout);
		}

		if (re.test(msg.content) && msg.author.id !== '982274221541580912') {
			msg.react('😳');
			if (msg.channel == genshinChannel || botChannel) {
				if ((Math.random() * 10) > 9) {
					const image = await requestBuilder('bonk');
					msg.reply('<@' + msg.author.id + '> just got bonked !!! 🆘\n' + image['url'] + '\n');
				}
				else {
					const image = await requestBuilder('sfw');
					msg.channel.send(image['url']);
				}
			}
		}

		if (nsfw.test(msg.content) && msg.author.id !== '982274221541580912') {
			msg.react('🥵');
			if (msg.channel.id === '996730291370602626') {
				const image = await requestBuilder('nsfw');
				msg.channel.send(`|| ${image['url']} ||`);
			}
		}
	});
	// send role message and react with emojis corresponding to the roles:
	// rolesChannel.send({ embeds: [exampleEmbed], components: [row] }).then(message => {
	// 	message.react(emojis.beeangery);
	// 	message.react(emojis.OwOmen);
	// 	message.react(emojis.Angery);
	// 	message.react(emojis.Borpagun);
	// 	message.react(emojis.nobuild);
	// 	message.react(emojis.highfive);
	// 	message.react(emojis.peepoparty);
	// 	message.react(emojis.trumpW);

	// get reactionmessage and add reaction collector
	rolesChannel.messages.fetch('983144971366461490').then(message => {
		// create filter for which emojis to collect
		const filter = (reaction, user) => {
			return emojinames.includes(reaction.emoji.name) && user.id !== message.author.id;
		};
		// init reaction collector
		const collector = message.createReactionCollector({ filter });
		collector.on('collect', (reaction, user) => {
			console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
			message.guild.members.fetch(user.id).then(member => {
				member.roles.add(roles[reaction.emoji.name]);
			});
		});
	});
});

// role remover button
client.on('interactionCreate', interaction => {
	const member = interaction.member;
	if (!interaction.isButton()) return;
	interaction.deferUpdate();
	for (let i = 0; i < emojinames.length - 1; i++) {
		member.roles.remove(roles[emojinames[i]]);
	}
	return;
});

// make bot say a funny :DD haHAH
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
