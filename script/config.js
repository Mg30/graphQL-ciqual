const argv = require('minimist')(process.argv.slice(2))
const fs = require('fs')
const file = 'package.json'

const bucketName = argv['bucket-name']
if (!bucketName) {
    console.error('You must supply a bucket name as --bucket-name="<bucketName>"')
    process.exit(1)
  }

let fileContentModified = fs.readFileSync(file, 'utf8')
fileContentModified = fileContentModified.replace(/BUCKET_NAME/g, bucketName)
console.log(bucketName)
fs.writeFileSync(file, fileContentModified, 'utf8')