const {execSync} = require('child_process');
const fs = require('fs');
const path = require('path');

const lambda = 'bluehost-screenshot-service';

if (fs.existsSync(`./${lambda}.zip`)) {
    fs.unlinkSync(`${lambda}.zip`);
}

execSync(`zip -r ${lambda}.zip . -x "*.git*" -x "*.zip"`);
execSync(`aws lambda update-function-code --function-name '${lambda}' --zip-file fileb://${lambda}.zip --profile bluehost --region=us-west-2`);
