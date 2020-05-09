require('dotenv').config()
const sodium = require('tweetsodium');
const axios = require('axios')
const fs = require('fs')

function readAwsConfig () {
    const file = "/mnt/c/Users/Matt/.aws/credentials"
    const fileContent = fs.readFileSync(file, 'utf8')
    const awsConfig = fileContent.split('\n').reduce((acc, line) => {
        const splitted = line.split('=')
        const key = splitted.shift()
        const value = line.split(`${key}=`).join('')
        if (key !== '[default]\r') {
            acc[key.replace('\r','').toUpperCase()] = value.replace('\r','')
        }
        return acc
    }, {})
    return awsConfig
}


function encrypt (base64EncodedPublic, value) {
    // Convert the message and key to Uint8Array's (Buffer implements that interface)
    const messageBytes = Buffer.from(value);
    const keyBytes = Buffer.from(base64EncodedPublic, 'base64');

    // Encrypt using LibSodium.
    const encryptedBytes = sodium.seal(messageBytes, keyBytes);

    // Base64 the encrypted secret
    const encrypted = Buffer.from(encryptedBytes).toString('base64');
    return encrypted
}

async function retrievePublicKey () {
    const response = await axios.get(
        "https://api.github.com/repos/Mg30/express-serverless/actions/secrets/public-key",
        {
            headers: {
                Authorization: `token ${process.env.GITHUB_TOKEN}`
            }
        }
    )
    return response.data
}

function updateGitHubSecret (keyId, secretName, encryptedValue) {
    return axios.put(`https://api.github.com/repos/Mg30/express-serverless/actions/secrets/${secretName}`,
        {
            encrypted_value: encryptedValue,
            key_id: keyId
        },
        {
            headers: {
                Authorization: `token ${process.env.GITHUB_TOKEN}`
            },
        })
}

async function updateAwsConfig (awsConfig) {
    const { key_id, key } = await retrievePublicKey()
    for (const [awsKey, value] of Object.entries(awsConfig)) {
        const encrypted = encrypt(key, value)
        updateGitHubSecret(key_id, awsKey, encrypted).then(()=>console.log("updated"))
            .catch(err => console.error(err))
    }
}

const awsConfig = readAwsConfig()
updateAwsConfig(awsConfig)

