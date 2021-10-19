const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const srcpath = path.resolve(__dirname, '../contracts');
const buildpath = path.resolve(__dirname, '../builds');
fs.ensureDirSync(buildpath);

// Build function
const compileContracts = (srcpath) => {
  const contracts = fs.readdirSync(srcpath);

  // Fetch source files
  let sources = {};
  contracts.forEach(contract => {
    const filepath = path.resolve(__dirname, '../contracts', contract);
    const source = fs.readFileSync(filepath, 'utf-8');
    sources[filepath] = {content: source};
  })

  // Compile source files
  const compile_settings = {
      language: 'Solidity',
      sources: sources,
      settings: {
        outputSelection: {
          '*': {
            '*': ['metadata', 'abi', 'evm.bytecode']
          }
        }
      }
    };

  const compiledResult = JSON.parse(solc.compile(JSON.stringify(compile_settings))).contracts;

  // Format compile result for return
  let compiledContracts = {};
  for (let filepath in compiledResult) {
    for (let contract in compiledResult[filepath]) {
      compiledContracts[contract] = compiledResult[filepath][contract];
    }
  }

  return compiledContracts;
}


const clearPreviousBuilds = (compiledContracts) => {
  for (let contract in compiledContracts) {
    try{
      fs.unlinkSync(path.resolve(buildpath, contract + ".json"));
    } catch(error){};
  }
}


const storeCompiledContract = (compiledContracts) => {
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

const compiledContracts = compileContracts(srcpath);
clearPreviousBuilds(compiledContracts);
storeCompiledContract(compiledContracts);