
const WalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

// Define and initialize global variables
const mnemonic = 'stairs basic flag mandate split marble oven cliff anxiety trap model morning';
const infura_provider = 'https://rinkeby.infura.io/v3/124660071809414c801dce8cc1941cae';

let provider, web3, LoginDatabase, DeployedAddress, accounts, login_database;

const setup = async () => {
    provider = new WalletProvider(mnemonic, infura_provider);
    web3 = new Web3(provider);
    LoginDatabase = require('../builds/LoginDatabase.json');
    DeployedAddress = require('../builds/DeployedAddress.json');
    accounts = await web3.eth.getAccounts();
    login_database = new web3.eth.Contract(LoginDatabase.abi, DeployedAddress.LoginDatabase);
}

setup().then(()=>{
    utils = {
        web3: web3,
        accounts: accounts,
        login_database: login_database
    };
    console.log(1);
    console.log(accounts);
    module.exports = utils;
});
