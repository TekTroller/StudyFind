const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');


// Clear previous builds
const buildpath = path.resolve(__dirname, '../builds')
fs.removeSync(buildpath);


// Fetch source files and compile
const filepath = path.resolve(__dirname, '../contracts', 'login_database.sol');
const source = fs.readFileSync(filepath, 'utf-8');

const compile_settings = {
    language: 'Solidity',
    sources: {
      filepath: {
        content: source
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['metadata', 'abi', 'evm.bytecode']
        }
      }
    }
  };

const compiledContracts = JSON.parse(solc.compile(JSON.stringify(compile_settings))).contracts.filepath;

// Create new build directory
fs.ensureDirSync(buildpath);

for (let contract in compiledContracts) {
    fs.outputJsonSync(
        path.resolve(buildpath, contract + ".json"),
        {
            "matadata": compiledContracts[contract]["metadata"],
            "abi": compiledContracts[contract]["abi"],
            "bytecode": compiledContracts[contract]["evm"]["bytecode"]["object"]
        }
    );
    console.log("Contract " + contract + " compiled successfully and stored under builds folder")
}