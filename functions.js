const {Lambda, S3} = require('aws-sdk');
const {get} = require('axios');
const crypto = require('crypto');
const {readFileSync} = require('fs');
const {Readable} = require('stream');

const lambda = new Lambda();
const s3 = new S3();

/**
 * Take a file and convert to a base64 encoded string.
 *
 * @param buffer A Buffer instance.
 * @returns {string} A base64 encoded string.
 */
function base64Encode(buffer) {
    return new Buffer.from(buffer).toString('base64');
}

/**
 * Take a base64 encoded string and convert to a buffer.
 *
 * @param {string} base64
 * @returns {Buffer}
 */
function base64Decode(base64) {
    return new Buffer.from(base64, 'base64');
}

/**
 * Convert a buffer to a stream
 *
 * @param {Buffer} buffer
 * @returns {Readable}
 */
function bufferToStream(buffer) {
    return new Readable({
        read() {
            this.push(buffer);
            this.push(null);
        }
    });
}

/**
 * Get an MD5 hash of a string.
 *
 * @param {string} data
 * @returns {string}
 */
function md5(data) {
    return crypto.createHash('md5').update(data).digest('hex');
}

/**
 * Upload a file to Amazon S3.
 *
 * @param {string} bucket
 * @param {string} file
 * @param {Readable} stream
 */
async function uploadToS3(bucket, file, stream) {
    const params = {
        Bucket: bucket,
        Key: file,
        Body: stream,
    };

    return await new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => err ? reject(err) : resolve(data));
    });
}


/**
 * Fetch a file from Amazon S3.
 *
 * @param {string} bucket
 * @param {string} file
 */
async function fetchFromS3(bucket, file) {
    const params = {
        Bucket: bucket,
        Key: file,
    };

    return await new Promise((resolve, reject) => {
        s3.getObject(params, (err, data) => err ? reject(err) : resolve(data));
    });
}

/**
 * Check if a file exists on Amazon S3 (doesn't work with directories).
 *
 * @param {string} bucket The S3 bucket name.
 * @param {string} file The file path on S3.
 * @returns {boolean} Whether or not the file exists.
 */
async function fileExistsOnS3(bucket, file) {

    const params = {
        Bucket: bucket,
        Key: file,
    };

    return await new Promise((resolve, reject) => {
        s3.headObject(params, (err, data) => err ? reject(err) : resolve(data));
    });
}

/**
 * Get a screenshot given a URL.
 *
 * @param {string }url
 * @returns {string}
 */
async function captureScreenshot(url) {
    const params = {
        FunctionName: 'bluehost-generate-screenshot',
        Payload: JSON.stringify({url}, null, 2),
    };

    return await new Promise((resolve, reject) => {
        lambda.invoke(params, (err, data) => err ? reject(err) : resolve(JSON.parse(data.Payload)));
    });
}

/**
 * Send an image as a response.
 *
 * @param base64
 * @returns {{headers: {"Content-Type": string}, isBase64Encoded: boolean, body: string, statusCode: number}}
 */
function sendImage(base64) {
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'image/png',
        },
        body: `data:image/png;base64,${base64}`,
        isBase64Encoded: true,
    };
}

/**
 * Send a placeholder image as a response.
 *
 * @returns {{headers: {"Content-Type": string}, isBase64Encoded: boolean, body: string, statusCode: number}}
 */
function sendPlaceholderImage() {
    return sendImage(base64Encode(readFileSync('./placeholder.png')));
}

/**
 * Send an error response.
 *
 * @param {string} message
 * @returns {{headers: {}, isBase64Encoded: boolean, body: *, statusCode: number}}
 */
function sendError(message = 'Unable to generate screenshot') {
    return {
        statusCode: 500,
        headers: {},
        body: JSON.stringify({
            status: 'error',
            message,
        }),
        isBase64Encoded: false,
    };
}

/**
 * Send a 404 response.
 *
 * @returns {{statusCode: number}}
 */
function send404() {
    return {
        statusCode: 404,
    };
}

module.exports = {
    base64Decode,
    base64Encode,
    bufferToStream,
    captureScreenshot,
    fetchFromS3,
    fileExistsOnS3,
    md5,
    send404,
    sendError,
    sendImage,
    sendPlaceholderImage,
    uploadToS3,
};