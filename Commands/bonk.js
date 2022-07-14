const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bonk')
		.setDescription('bonkkaa käyttäjää'),
	async execute(interaction) {
		await interaction.reply('haloo');
	},
};
