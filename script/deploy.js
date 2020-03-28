const fs = require('fs')
const exec = require('child_process').execSync

if (fs.existsSync('./lambda-package.zip')) {
    exec('rm lambda-package.zip && aws s3 rm s3://$npm_package_config_bucketName/lambda-package.zip')
  }
exec('zip -r lambda-package.zip node_modules/ graphql/ index.js app.js && aws s3 cp lambda-package.zip s3://$npm_package_config_bucketName/')