const url = require('url');
const path = require('path');
const fs = require('fs');

const Discord = require('discord.js');

const express = require('express');
const app = express();

const passport = require('passport');
const session = require('express-session');
const Strategy = require('passport-discord').Strategy;

const md = require('marked');

// For logging
const morgan = require('morgan');

// For stats
const moment = require('moment');
require('moment-duration-format');

module.exports = (client) => {

	const dataDir = path.resolve(`${process.cwd()}${path.sep}dashboard`);

	const templateDir = path.resolve(`${dataDir}${path.sep}templates`);

	app.set('trust proxy', 5); // Proxy support
	app.use('/public', express.static(path.resolve(`${dataDir}${path.sep}public`), {maxAge: '10d'}));
	app.use(morgan('combined')); // Logger

	// uhhhh check what these do.
	passport.serializeUser((user, done) => {
		done(null, user);
	});
	passport.deserializeUser((obj, done) => {
		done(null, obj);
	});

	var protocol;

  client.protocol = 'https://';

	protocol = client.protocol;

	client.callbackURL = `${protocol}barretorrr.glitch.me/callback`;
	client.log('[LOG]', `Callback URL: ${client.callbackURL}`, '[INFO]');
	passport.use(new Strategy({
		clientID: client.appInfo.id,
		clientSecret: process.env.oauth,
		callbackURL: client.callbackURL,
		scope: ['identify', 'guilds']
	},
	(accessToken, refreshToken, profile, done) => {
		process.nextTick(() => done(null, profile));
	}));


	app.use(session({
		secret: process.env.secret,
		resave: false,
		saveUninitialized: false,
	}));

	app.use(passport.initialize());
	app.use(passport.session());

	app.locals.domain = process.env.DOMAIN;
  
	app.engine('html', require('ejs').renderFile);
	app.set('view engine', 'html');

	var bodyParser = require('body-parser');
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));

	function checkAuth(req, res, next) {
		if (req.isAuthenticated()) return next();
		req.session.backURL = req.url;
		res.redirect('/login');
	}

	function cAuth(req, res) {
		if (req.isAuthenticated()) return;
		req.session.backURL = req.url;
		res.redirect('/login');
	}

	function checkAdmin(req, res, next) {
		if (req.isAuthenticated() && req.user.id === 292065674338107393) return next();
		req.session.backURL = req.originalURL;
		res.redirect('/');
	}

	app.get('/', (req, res) => {
     res.render(path.resolve(`${templateDir}${path.sep}index.ejs`), {
			bot: client,
			auth: req.isAuthenticated() ? true : false,
			user: req.isAuthenticated() ? req.user : null,
   });
	});



  app.post('/clip/add', (req, res) => {
    var user =  req.body.id;
     var clipInfo = {
      username: req.body.username,
      fc: req.body.fc,
      clip: req.body.clip_info,
     };
     console.log(`[Enviado por: ${client.users.get(user).tag}] - ${clipInfo}`);
     res.redirect('/');
  });


	app.get('/login', (req, res, next) => {
		if (req.session.backURL) {
			req.session.backURL = req.session.backURL;
		} else if (req.headers.referer) {
			const parsed = url.parse(req.headers.referer);
			if (parsed.hostname === app.locals.domain) {
				req.session.backURL = parsed.path;
			}
		} else {
			req.session.backURL = '/';
		}
		next();
	},
	passport.authenticate('discord'));

	app.get('/callback', passport.authenticate('discord', {
		failureRedirect: '/'
	}), (req, res) => {
		if (req.session.backURL) {
			res.redirect(req.session.backURL);
			req.session.backURL = null;
		} else {
			res.redirect('/');
		}
	});

	app.get('/admin', checkAdmin, (req, res) => {
		res.render(path.resolve(`${templateDir}${path.sep}admin.ejs`), {
			bot: client,
			user: req.user,
			auth: true
		});
	});

	app.get('/me', checkAuth, (req, res) => {
	 const perms = Discord.EvaluatedPermissions;
	 	res.render(path.resolve(`${templateDir}${path.sep}user-profile.ejs`), {
			perms: perms,
			bot: client,
			user: req.user,
			auth: true,
      package: {
       moment: moment,
      },
		});
   // res.redirect('/u/' + req.user.id)
	});


	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});

	app.get('*', function(req, res) { // Catch-all 404
		res.send('<p>404 File Not Found. Please wait...<p> <script>setTimeout(function () { window.location = "/"; }, 1000);</script><noscript><meta http-equiv="refresh" content="1; url=/" /></noscript>');
	});

	client.site = app.listen(process.env.PORT, function() {
		client.log('LOG', `Site carregado em ${process.env.PORT}`, 'INFO');
	}).on('error', (err) => {
		client.log('ERROR', `Error with starting dashboard: ${err.code}`);
		return process.exit(0);
	});
};
