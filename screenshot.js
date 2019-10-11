const {
    base64Decode,
    base64Encode,
    bufferToStream,
    captureScreenshot,
    fetchFromS3,
    fileExistsOnS3,
    md5,
    send404,
    sendImage,
    sendPlaceholderImage,
    uploadToS3
} = require('./functions');

exports.Screenshot = class {

    constructor(url, dir = '') {
        this.bucket = process.env.S3_BUCKET;
        this.dir = dir;
        this.url = url;
    }

    basename() {
        return `${md5(this.url)}.png`;
    }

    filepath() {
        return `${this.dir}${this.basename()}`;
    }

    async hasScreenshot() {
        try {
            await fileExistsOnS3(this.bucket, this.filepath());
            return true;
        } catch (e) {
            return false;
        }
    }

    async persist(base64) {
        return await uploadToS3(this.bucket, this.filepath(), bufferToStream(base64Decode(base64)));
    }

    async fetch() {
        try {
            const response = await fetchFromS3(this.bucket, this.filepath());
            return sendImage(base64Encode(response.Body));
        } catch (e) {
            try {
                return sendImage(await this.persist(await captureScreenshot(this.url)));
            } catch (e) {
                return sendPlaceholderImage();
            }
        }
    }

};