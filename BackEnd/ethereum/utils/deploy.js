const fs = require('fs-extra');
const path = require('path');

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('../builds/LoginDatabase.json');

const provider = new HDWalletProvider(
    'stairs basic flag mandate split marble oven cliff anxiety trap model morning',
    'https://rinkeby.infura.io/v3/f95650b8297a4bf4a2eccfddf84d5865'
);

const web3 = new Web3(provider)


const deploy = async() => {
    // Get list of accounts
    const accounts = await web3.eth.getAccounts();
    console.log("Attempting to deploy from account " + accounts[0]);

    const contract = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ gas: '1000000', from: accounts[0] });

    console.log("Contract deployed to " + contract.options.address);
    const address = {address: contract.options.address};

    // log deployed address to json file
    const buildpath = path.resolve(__dirname, 'build');
    fs.removeSync(buildpath+'DeployedAddress.json');
    fs.outputJsonSync(
        path.resolve(buildpath, 'DeployedAddress.json'),
        address
    );
}

deploy();