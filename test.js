const { exec } = require('node:child_process');
const fs = require("fs");

const runner = exec('node index.js', (err, stdout, stderr) => {
    if (err) {
        console.error(err);
        process.exit(1);
    } else {
        console.log(stdout);
        console.log(stderr);
    }
});

console.log("Started testing...")

setTimeout(() => {
    runner.kill('SIGINT');
    const files = fs.readdirSync('./nekos');
    if (files.length < 1) {
        console.log('No files were downloaded, seems like the downloader is broken, exiting...');
        process.exit(1);
    } else {
        console.log('Downloaded ' + files.length + ' files in 30 seconds, test successfull!');
        process.exit(0);
    }
}, 30000)