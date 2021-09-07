const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');


// Clear previous builds
const buildpath = path.resolve(__dirname, '../builds')
fs.removeSync(buildpath);


// Fetch source files and compile
const filepath = path.resolve(__dirname, '../contracts', 'user_database.sol');
const source = fs.readFileSync(filepath, 'utf-8');
const compiledContracts = solc.compile(source, 1).contracts;


// Create new build directory
fs.ensureDirSync(buildpath);

for (let contract in compiledContracts) {
    fs.outputJsonSync(
        path.resolve(buildpath, contract.slice(1) + ".json"),
        compiledContracts[contract]
    );
}