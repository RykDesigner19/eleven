exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
	const msg = await message.channel.send('Ping?');
	msg.edit(`Pong! Latência é ${msg.createdTimestamp - message.createdTimestamp}ms. Latência da API é ${Math.round(client.ping)}ms`);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['ping'],
	permLevel: 0
};

exports.help = {
	name: 'Ping',
	category: '🎭 Diversos',
	description: 'Para verificar o tempo de resposta',
	usage: 'ping'
};
