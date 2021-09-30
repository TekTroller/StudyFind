const fs = require('fs-extra');
const path = require('path');

const WalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const LoginDatabase = require('../builds/LoginDatabase.json');

const mnemonic = 'stairs basic flag mandate split marble oven cliff anxiety trap model morning';
const infura_provider = 'https://rinkeby.infura.io/v3/124660071809414c801dce8cc1941cae';

const provider = new WalletProvider(mnemonic, infura_provider);

const web3 = new Web3(provider)


const deploy = async() => {
    // Get list of accounts
    const accounts = await web3.eth.getAccounts();
    console.log("Attempting to deploy from account " + accounts[0]);

    const contract = await new web3.eth.Contract(LoginDatabase.abi)
        .deploy({ data: LoginDatabase.bytecode })
        .send({ gas: '1000000', from: accounts[0],gasPrice: 400000000000, gasLimit: 4000000 });

    console.log("Contract deployed to " + contract.options.address);
    const address = contract.options.address;

    // remove previous deployed contract
    const output_target = path.resolve(__dirname, '../builds/DeployedAddress.json');
    try{
        fs.unlinkSync(output_target);
    } catch(error){};
    try{
        fs.unlinkSync(output_target);
    } catch(error){};

    // save deployed address to json file
    fs.outputJsonSync(
        path.resolve(output_target),
        {"LoginDatabase": address}
    );
}

deploy();
