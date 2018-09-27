const { version } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');
const Discord = require('discord.js');

exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
	var time = Date.now();
	const duration = moment.duration(client.uptime).format(' D [days], H [hrs], m [mins], s [secs]');
	const embed = new Discord.RichEmbed()
		.setColor('RED')
		.setAuthor(client.user.username, client.user.displayAvatarURL)
		.setTitle('BOT STATS')
		.addField(`Uso de Memória`, `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
		.addField(`Uptime`, `${duration}`, true)
		.addField(`Comandos`, `${client.commandsNumber}`, true)
		.addField(`Usuários`, `${client.users.filter(u => u.id !== '1').size.toLocaleString()}`, true)
		.addField(`Servidores`, `${client.guilds.size.toLocaleString()}`, true)
		.addField(`Canais`, `${client.channels.size.toLocaleString()}`, true)
		.addField(`Discord.js`, `v${version}`, true)
		.addField(`Node`, `${process.version}`, true)
		.setFooter(`Ping: ${Date.now() - time}ms`);
	message.channel.send(message.author, embed);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['stats'],
	permLevel: 0
};

exports.help = {
	name: 'Stats',
	category: '🎭 Diversos',
	description: 'Dá algumas estatísticas úteis de bot',
	usage: 'stats'
};
