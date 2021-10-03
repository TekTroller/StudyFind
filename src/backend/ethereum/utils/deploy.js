const fs = require('fs-extra');
const path = require('path');

const LoginDatabase = require('../builds/LoginDatabase.json');
const Patient = require('../builds/Patient.json');
const PatientFactory = require('../builds/PatientFactory.json');

const WalletProvider = require('truffle-hdwallet-provider');
const mnemonic = 'stairs basic flag mandate split marble oven cliff anxiety trap model morning';
const infura_provider = 'https://rinkeby.infura.io/v3/124660071809414c801dce8cc1941cae';
const provider = new WalletProvider(mnemonic, infura_provider);
const Web3 = require('web3');
const web3 = new Web3(provider);

const output_target = path.resolve(__dirname, '../builds/DeployedAddress.json');


const deploy = async(contract) => {
    // Get account for deploying
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    console.log("Attempting to deploy from account " + account);

    const deployed_contract = await new web3.eth.Contract(contract.contract.abi)
        .deploy({ data: contract.contract.bytecode })
        .send({ gas: contract.gas, from: account, gasPrice: contract.gasPrice, gasLimit: contract.gasLimit });

    const deployed_address = deployed_contract.options.address;
    console.log(contract.name + " contract deployed to " + deployed_address);

    // save deployed address to json file
    const previous_deployed = JSON.parse(fs.readFileSync(output_target, 'utf-8'));
    previous_deployed[contract.name] = deployed_address;
    fs.outputJsonSync(
        path.resolve(output_target),
        previous_deployed
    );
}

const contracts = [
    {"name": "LoginDatabase", "contract": LoginDatabase, "gas": '1000000', "gasPrice": 400000000000, "gasLimit": 4000000}, 
    {"name": "PatientFactory", "contract": PatientFactory, "gas": '5000000', "gasPrice": 400000000000, "gasLimit": 4000000}
];

contracts.forEach(contract => {
    deploy(contract);
})