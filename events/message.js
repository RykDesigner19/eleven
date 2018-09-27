
module.exports = (client, message) => {
  const Discord = require('discord.js');
	const settings = client.config.defaultSettings;

	const args = message.content.split(/\s+/g);
	var command;

	const prefix = client.config.prefix;
	command = args.shift().slice(3)
		.toLowerCase();

	const level = client.permlevel(message);

	const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

	if (message.channel.type === 'dm') {
		if (!cmd) return;
		if (cmd.conf.guildOnly) return message.channel.send('Este comando está desativado em DMs');
	}

	if (message.channel.type !== 'dm') {
		const guildSettings = settings;

		if (message.content.indexOf('11!') !== 0) {
			return;
		}

		if (client.user.bot === 'true') {
			cmd.run(client, message, args, level);
		} else {
			cmd.run(client, message, args, level);
		}
	} else if (cmd) {
		if (level >= cmd.conf.permLevel) {
			if (cmd.conf.enabled) {
				cmd.run(client, message, args, level);
				if (client.config.defaultSettings.logCommandUsage === 'true') {client.log('log', `DM: ${message.author.username} (${message.author.id}) ran command ${message.content}`, 'CMD');}
			} else if (client.config.defaultSettings.logCommandUsage === 'true') {client.log('log', `DM: ${message.author.username} (${message.author.id}) tried to run disabled command ${message.content}`, 'CMD');}
		} else if (client.config.defaultSettings.logCommandUsage === 'true') {client.log('log', `DM: ${message.author.username} (${message.author.id}) tried to run command without permissions: ${message.content}`, 'CMD');}
	}
};
