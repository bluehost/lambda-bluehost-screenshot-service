const {sendError} = require('./functions');
const {Screenshot} = require('./screenshot');

exports.handler = async (event) => {
    try {
        const url = decodeURIComponent(event.queryStringParameters.url);
        const screenshot = new Screenshot(url);
        return await screenshot.fetch();
    } catch (e) {
        return sendError();
    }
};
