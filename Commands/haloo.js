const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('haloo')
		.setDescription('vastaa haloo'),
	async execute(interaction) {
		await interaction.reply('haloo');
	},
};
