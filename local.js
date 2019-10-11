var {handler} = require('./index');

process.env.S3_BUCKET = 'micah-remote';

handler({
    queryStringParameters: {
        url: 'https://wpscholar.com',
    }
})
    .then(response => console.log(response))
    .catch(error => console.error(error));
