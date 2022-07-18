/* eslint-disable no-prototype-builtins */
const fs = require('node:fs');
const path = require('node:path');
const fetch = require('cross-fetch');
const { Client, Intents, Collection } = require('discord.js');
const { request } = require('undici');
const { token, roles, waifuAPI, HuggingFaceAPIKey } = require('./config.json');

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const leksa_api = 'https://api-inference.huggingface.co/models/Thoumey/DialoGPT-small-Leksa';

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

	const rolesChannel = client.channels.cache.get('982405191309619230');
	const botChannel = client.channels.cache.get('834439402306011146');
	const genshinChannel = client.channels.cache.get('786653057885667328');

	async function getJSONResponse(body) {
		let fullBody = '';
		for await (const data of body) {
			fullBody += data.toString();
		}
		return JSON.parse(fullBody);
	}

	async function requestBuilder(type) {
		if (type === 'bonk') {
			const category = type;
			type = 'sfw';
			const animetyty = await request(`${waifuAPI.url}${type}/${category}`);
			return await getJSONResponse(animetyty.body);
		}
		// else {
		// 	const index = Math.floor(Math.random() * waifuAPI[type].length);
		// 	const category = waifuAPI[type][index];
		// 	const payload = await request(`${waifuAPI.url}${type}/${category}`);
		// 	return await getJSONResponse(payload.body);
		// }
	}

	// const re = /anime|^2d$|2d |2d-|animetyty|owo|uwu|waifu/i;
	// const nsfw = /^nsfw$|^hentai$/i;
	const doge = /dog|doge|shiba|shibe|koira|hau|koiro/i;
	const cat = /kitten|kissa|kassi|miau|:3|miu|cat/i;
	const duck = /duck|ankka|kvaak|ankk/i;
	const bird = /bird|birb|lintu|tsirp/i;
	const redpanda = /kultapanda|red panda|panda|pikkupanda/i;
	const raccoon = /pesukarhu|thieving|rocky|raccoon|sly/i;
	const kangaroo = /kenguru|australia|boing|kangaroo/i;

	client.on('messageCreate', async msg => {
		if (msg.author.bot || msg.channelId === '370233724811345921') {
			return;
		}
		if (msg.mentions.has(client.user)) {
			// form payload
			const payload = {
				inputs: {
					text: prepareData(msg.content, msg.author.username),
				},
			};
			// form the request headers with Hugging Face API key
			const headers = {
				'Authorization': 'Bearer ' + HuggingFaceAPIKey,
			};
			// set status as typing
			msg.channel.sendTyping();

			const response = await fetch(leksa_api, {
				method: 'post',
				body: JSON.stringify(payload),
				headers: headers,
			});
			const data = await response.json();
			let botResponse = '';
			if (data.hasOwnProperty('generated_text')) {
				botResponse = data.generated_text;
			}
			else if (data.hasOwnProperty('error')) {
				botResponse = data.error;
			}
			// send message as a reply
			console.log(botResponse);
			msg.reply(botResponse);
		}
		// message collectors for each regex
		if (doge.test(msg.content)) {
			msg.react('<:L_:509019927282188288>');
			if (Math.random() < 0.25) {
				let dogeImg = await request('http://shibe.online/api/shibes');
				dogeImg = await getJSONResponse(dogeImg.body);
				msg.channel.send(dogeImg[0]);
			}
			else {
				let dogeImg = await request('https://random.dog/woof.json');
				dogeImg = await getJSONResponse(dogeImg.body);
				msg.channel.send(dogeImg['url']);
			}
		}
		if (cat.test(msg.content)) {
			let catImg = await request('https://aws.random.cat/meow');
			catImg = await getJSONResponse(catImg.body);
			msg.channel.send(catImg['file']);
		}
		if (duck.test(msg.content)) {
			let img = await request('https://random-d.uk/api/random');
			img = await getJSONResponse(img.body);
			msg.channel.send(img['url']);
		}
		if (bird.test(msg.content)) {
			let img = await request('https://some-random-api.ml/animal/birb');
			img = await getJSONResponse(img.body);
			msg.channel.send(img['image']);
		}
		if (redpanda.test(msg.content)) {
			let img = await request('https://some-random-api.ml/animal/red_panda');
			img = await getJSONResponse(img.body);
			msg.channel.send(img['image']);
		}
		if (raccoon.test(msg.content)) {
			let img = await request('https://some-random-api.ml/animal/raccoon');
			img = await getJSONResponse(img.body);
			msg.channel.send(img['image']);
		}
		if (kangaroo.test(msg.content)) {
			let img = await request('https://some-random-api.ml/animal/kangaroo');
			img = await getJSONResponse(img.body);
			msg.channel.send(img['image']);
		}
		// random anime tyts
		// if (Math.random() > 0.5) {
		// 	const randomTimeout = Math.random() * 7200 * 1000;
		// 	console.log('starting random image function timeout for ' + randomTimeout + ' seconds');
		// 	let image;
		// 	if (randomTimeout % 3 < 1) {
		// 		image = await requestBuilder('nsfw');
		// 	}
		// 	else {
		// 		image = await requestBuilder('sfw');
		// 	}
		// 	console.log('image url: ' + image['url']);
		// 	setTimeout(() => {
		// 		const msgs = ['tää on mun tyttö ystävä :3', 'tää tekee tällee', 'tämmöne', 'huhhuh', '2D girls >', 'Ois saaatana', 'NONNIIIIIH'];
		// 		const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
		// 		console.log('randommsg:' + randomMsg);
		// 		genshinChannel.send(`${randomMsg}\n ${image['url']}\n`);
		// 	}, randomTimeout);
		// }
		// mans typing in bot/genshin
		if (msg.channel === genshinChannel || msg.channel === botChannel) {
			// random bonk
			if ((Math.random() * 15) > 13) {
				const image = await requestBuilder('bonk');
				msg.reply('<@' + msg.author.id + '> just got bonked !!! 🆘\n' + image['url'] + '\n');
			}
			// matches sfw regex
			// if (re.test(msg.content)) {
			// 	msg.react('😳');
			// 	const image = await requestBuilder('sfw');
			// 	msg.channel.send(image['url']);
			// }
			// // matches nsfw regex
			// else if (nsfw.test(msg.content)) {
			// 	msg.react('🥵');
			// 	const image = await requestBuilder('nsfw');
			// 	msg.channel.send(`|| ${image['url']} ||`);
			// }
		}
	});

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

function prepareData(msg, username) {
	console.log(msg);
	const indexOfMention = msg.indexOf('>');
	console.log(indexOfMention);
	if (indexOfMention === -1) {
		return '';
	}
	const content = msg.substring(indexOfMention + 1) + username;
	console.log('content: ' + content);
	return content;
}
