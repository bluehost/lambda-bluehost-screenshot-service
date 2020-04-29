const {execSync} = require('child_process');
const fs = require('fs');
const path = require('path');

const lambda = path.basename(__dirname).replace('lambda-', '');

if (fs.existsSync(`./${lambda}.zip`)) {
	fs.unlinkSync(`${lambda}.zip`);
}

execSync(`zip -r ${lambda}.zip . -x "*.git*" "*.zip" "deploy.js" "local.js" "package.json" "package-lock.json"`);
execSync(`aws lambda update-function-code --function-name '${lambda}' --zip-file fileb://${lambda}.zip --profile bluehost --region=us-west-2`);
