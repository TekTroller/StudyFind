const WalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const LoginDatabase = require('../builds/LoginDatabase.json');
const DeployedAddress = require('../builds/DeployedAddress.json');

const mnemonic = 'stairs basic flag mandate split marble oven cliff anxiety trap model morning';
const infura_provider = 'https://rinkeby.infura.io/v3/124660071809414c801dce8cc1941cae';
const provider = new WalletProvider(mnemonic, infura_provider);


const web3 = new Web3(provider);
const accounts = await web3.eth.getAccounts();
const login_database = new web3.eth.Contract(LoginDatabase.abi, DeployedAddress.LoginDatabase);


const register = async (email, password, isProfessionalAccount) => {
    await login_database.methods.register(email, password, isProfessionalAccount, accounts[1]).send({
        from: accounts[0],
        gas: '1000000'
    });
}

const verify = async (email, password, isProfessionalAccount) => {
    const verified = await login_database.methods.verify("test@gmail.com", "12345678", true).call();
    return verified;
}

const update_password = async (new_email, new_password) => {
    await login_database.methods.update_password(new_email, new_password).send({
        from: accounts[0],
        gas: '1000000'
    });
}