const fs = require('fs');
const {promisify} = require('util');
const rp = require('request-promise-native');
const parseLcov = require('./lib/parseLcov');

const fsReadFile = promisify(fs.readFile);
const fsAccess = promisify(fs.access);

module.exports = async ({url, auth, commit, file, basePath, debug}) => {
    rp.debug=debug;

    try {
        console.log(`Checking that file "${file}" exists`)
        await fsAccess(file, fs.constants.R_OK);
    } catch (e) {
        console.error(`ERROR: Can't read from file "${file}"`);
        return;
    }

    console.log(`Reading file "${file}"`)
    const content = await fsReadFile(file, 'utf8');

    console.log(`Parsing file "${file}"`)
    const payload = parseLcov(content, basePath);

    console.log(`Sending request`)
    try {
        await rp({
            method: 'POST',
            url: `${url}/rest/code-coverage/1.0/commits/${commit}`,
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${auth}`
            },
            body: JSON.stringify(payload),
            timeout: 60000
        })
    } catch (e) {
        console.error(`ERROR: ${e.message}`)
    }
}


