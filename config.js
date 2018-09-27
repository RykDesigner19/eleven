/* eslint-disable */
const vault = process.env;
var config = {
    ownerID: vault.ownerid,
    token: vault.token,
    status: 'online',
    debug: 'false',
    prefix: '11!',
    dashboard: {
        enabled: 'true',
        secure: 'true',
        port:  vault.PORT,
        invitePerm: 8,
    },
    sessionSecret: vault.secret,
    oauthSecret: vault.oauth,
    domain: `eleven.glitch.me`,
};