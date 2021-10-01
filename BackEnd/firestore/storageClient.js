const { Firestore } = require('@google-cloud/firestore');
const path = require('path');
const sha256 = require('js-sha256').sha256;

// Ethereum contracts imports
const Patient = require('../ethereum/builds/Patient.json');
const WalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

class StorageClient {
    constructor(patientAddress) {
        // Firestore
        this.client = new Firestore({
            projectId: 'studyfind-medical-database',
            keyFilename: path.join(__dirname, 'keys/studyfind-medical-database-key.json')
        });

        // Ethereum contract
        const mnemonic = 'stairs basic flag mandate split marble oven cliff anxiety trap model morning';
        const infura_provider = 'https://rinkeby.infura.io/v3/124660071809414c801dce8cc1941cae';
        const provider = new WalletProvider(mnemonic, infura_provider);
        const web3 = new Web3(provider);
        this.patient = new web3.eth.Contract(Patient.abi, patientAddress);
        this.account = "";
        web3.eth.getAccounts().then(accounts => {
            this.account = accounts[0];
        });
    }

    async upload(filename, file) {
        // Compute a token for file
        const file_token = sha256(file);
    
        // Upload file to google firestore
        const doc_ref = this.client.collection('root').doc(file_token);
        await doc_ref.set(file);

        // Upload file-token pair to Ethereum network
        try {
            this.patient.methods.add_file(filename, file_token).send({
                from: this.account,
                gas: '5000000'
            });
        } catch (err) {
            throw new Error('File already exists');
        }
    }

    async view(filename) {
        // Retrieve token from ethereum
        let file_token = "";
        try {
            file_token = await this.patient.methods.view_file(filename).call();
        } catch (err) {
            throw new Error("File not exists");
        }

        // Retrieve file from firestore
        const doc_ref = this.client.collection('root').doc(file_token);
        const file = doc_ref.get();
        
        return file;
    }
}

module.exports = new StorageClient();