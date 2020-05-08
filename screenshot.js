const {
    fileExistsOnS3,
    getS3Url,
    md5,
    queueScreenshotGeneration,
    sendRedirect,
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

    async fetch() {
        if (!await this.hasScreenshot()) {
            queueScreenshotGeneration(this.bucket, this.filepath(), this.url);
            return sendRedirect(getS3Url(this.bucket, 'placeholder.png'), 302);
        }
        return sendRedirect(getS3Url(this.bucket, this.filepath()));
    }

};