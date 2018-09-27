const Discord = require('discord.js');
const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);
const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');

const client = new Discord.Client();

try {
	client.config = require('./config.js');
} catch (err) {
	console.error('Não foi possível carregar client configs \n', err);
	process.exit(1);
}

require('./modules/functions.js')(client);
require('./modules/music.js')(client);

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

const init = async () => {

	const cmdFiles = await readdir('./commands/');
	client.commandsNumber = cmdFiles.length;
	console.log(`Carregando ${client.commandsNumber} comandos.`);
	cmdFiles.forEach(f => {
		try {
			const props = require(`./commands/${f}`);
			if (f.split('.').slice(-1)[0] !== 'js') return;
			client.commands.set(props.help.name, props);
			props.conf.aliases.forEach(alias => {
				client.aliases.set(alias, props.help.name);
			});
		} catch (e) {
			console.log(`Não foi possível carregar ${f}: ${e}`);
		}
	});

	const evtFiles = await readdir('./events/');
	console.log(`Carregando ${evtFiles.length} eventos.`);
	evtFiles.forEach(file => {
		const eventName = file.split('.')[0];
		const event = require(`./events/${file}`);
		client.on(eventName, event.bind(null, client));
		delete require.cache[require.resolve(`./events/${file}`)];
	});
  
	client.login(process.env.token);
};

init();
