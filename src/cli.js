#!/usr/bin/env node

const program = require('commander')
const main = require('.');
var pjson = require('../package.json');

program
  .version(pjson.version)
  .option('--url <url>', 'Bitbucket URL')
  .option('--auth <auth>', 'Auth Token for Bitbucket')
  .option('--commit <commit>', 'Commit id')
  .option('--file <file>', 'LCOV file')
  .option('--debug', '(Optional) Enable debug mode')
  .option('--basePath <basePath>', '(Optional) Path prefix to remove from LCOV paths, defaults to current directory')
  .parse(process.argv);

if (!program.url ||
    !program.auth ||
    !program.commit ||
    !program.file
) {
    program.help();
}

((async () => {
    try {
        await main({
            url: program.url,
            auth: program.auth,
            commit: program.commit,
            file: program.file,
            basePath: program.basePath || process.cwd(),
            debug: program.debug || false
        });
    }catch(e) {
        console.error(e);
        process.exit(1);
    }
})())
