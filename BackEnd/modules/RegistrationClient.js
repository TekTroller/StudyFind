const axios = require('axios');
const sha256 = require('js-sha256').sha256;

const WalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

const PatientFactory = require('../ethereum/builds/PatientFactory.json');
const LoginDatabase = require('../ethereum/builds/LoginDatabase.json');
const DeployedAddress = require('../ethereum/builds/DeployedAddress.json');

class RegistrationClient {
    constructor(server_addr = "http://localhost:3000") {
        this.server_addr = server_addr;

        const mnemonic = 'stairs basic flag mandate split marble oven cliff anxiety trap model morning';
        const infura_provider = 'https://rinkeby.infura.io/v3/124660071809414c801dce8cc1941cae';
        const provider = new WalletProvider(mnemonic, infura_provider);
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();

        this.patient_factory = new web3.eth.Contract(PatientFactory.abi, DeployedAddress.PatientFactory);
        this.login_database = new web3.eth.Contract(LoginDatabase.abi, DeployedAddress.login_database);
        this.account = accounts[0];
    }

    async get_code(email) {
        await axios.get(this.server_addr + '/get_code', 
        {
            params:{email: email}
        });
    }

    async verify_code(email, code) {
        const verified = await axios.get(this.server_addr + '/verify', 
        {
            params: {
                email: email,
                code: code
            }
        });

        return verified;
    }

    async register(email, password, usertype, name, birthday, gender) {
        // Create a pseudo-unique identifier for retrieve deployed patient contract address later
        const identifier = sha256(JSON.stringify({
            email: email,
            password: password,
            usertype: usertype,
            name: name,
            bday: birthday,
            gender: gender,
            timestamp: new Date().getTime()
        }));

        // Patient contract creation
        await this.patient_factory.methods.createPatient(name, birthday, gender, identifier).send({
            from: this.account,
            gas: '5000000'
        });

        const patient_address = await patient_factory.methods.getCreatedPatient(identifier).call();

        // Add credentials into login database
        try {
            await this.login_database.methods.register(email, password, usertype, patient_address).send({
                from: this.account,
                gas: '1000000'
            });
        } catch (err) {
            throw new Error("Email already registered");
        }
    }
}

module.exports = RegistrationClient;