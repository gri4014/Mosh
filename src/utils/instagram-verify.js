const crypto = require('crypto');

const clientId = '28944675988512536';
const clientSecret = 'dae92ea060659e541efb668f85de1baf';
const uri = 'https://mosh.ngrok.app/auth/instagram/callback';

// Try client ID based hashes
console.log('Raw Client ID:', clientId);

// Try MD5 of client ID
const md5ClientId = crypto.createHash('md5')
    .update(clientId)
    .digest('hex');
console.log('MD5 of client ID:', md5ClientId);

// Try combining client ID and secret
const combinedHash = crypto.createHash('md5')
    .update(`${clientId}|${clientSecret}`)
    .digest('hex');
console.log('MD5 of combined ID and secret:', combinedHash);

// Try HMAC with client ID as key
const hmac = crypto.createHmac('sha1', clientId)
    .update(uri)
    .digest('hex');
console.log('HMAC of URI with client ID:', hmac);
