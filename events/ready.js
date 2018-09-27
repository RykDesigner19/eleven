/* global wait */
module.exports = async client => {

	if (!client.user.bot) {
			return process.exit(0);
	}

	await wait(1000);

	client.appInfo = await client.fetchApplication();
	setInterval(async () => {
		client.appInfo = await client.fetchApplication();
	}, 60000);

	require('../modules/dashboard')(client);

    client.user.setStatus('available')

};
