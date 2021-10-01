const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const buildpath = path.resolve(__dirname, '../builds');

// Build function
const compileFile = (contract) => {
  // Clear previous builds
  try{
    fs.unlinkSync(path.resolve(buildpath, contract));
  } catch(error){};

  // Compile source file
  const filepath = path.resolve(__dirname, '../contracts', contract);
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

  // Store contract to JSON file
  for (let contract in compiledContracts) {
      fs.outputJsonSync(
          path.resolve(buildpath, contract + ".json"),
          {
              "matadata": compiledContracts[contract]["metadata"],
              "abi": compiledContracts[contract]["abi"],
              "bytecode": compiledContracts[contract]["evm"]["bytecode"]["object"]
          }
      );
      console.log("Contract " + contract + " compiled successfully and stored under builds folder");
  }
}

// Ensure build directory exists
fs.ensureDirSync(buildpath);

// Fetch source files
const contracts = fs.readdirSync(path.resolve(__dirname, '../contracts'));

// Compile source files
contracts.forEach(contract => {
  compileFile(contract);
})