const FirestoreClient = require('../firestore/FirestoreClient');

const Patient = require('../ethereum/builds/Patient.json');
const WalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

class StorageClient {
    constructor() {
        this.firestore = new FirestoreClient();
    }

    async link_patient(patient_address) {
        // Ethereum contract
        const mnemonic = 'stairs basic flag mandate split marble oven cliff anxiety trap model morning';
        const infura_provider = 'https://rinkeby.infura.io/v3/124660071809414c801dce8cc1941cae';
        const provider = new WalletProvider(mnemonic, infura_provider);
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();

        this.patient = new web3.eth.Contract(Patient.abi, patient_address);
        this.account = accounts[0];
    }

    async upload(filename, filedata) {
        // Upload file to firestore
        const file_token = await this.firestore.upload(filedata);

        // Upload file-token pair to Ethereum network
        try {
            await this.patient.methods.add_file(filename, file_token).send({
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
            throw new Error("File does not exist");
        }

        // Retrieve data from firestore
        const filedata = await this.firestore.view(file_token);
        return filedata;
    }

    async delete(filename) {
        // Delete from blockchain
        try {
            await this.patient.methods.delete_file(filename).send({
                from: this.account,
                gas: '5000000'
            });
        } catch (err) {
            throw new Error("File does not exist");
        }

        // Delete from firestore
        this.firestore.delete(filename);
    }

    async change_filename(old_filename, new_filename) {
        try {
            await this.patient.methods.change_filename(old_filename, new_filename).send({
                from: this.account,
                gas: '5000000'
            });
        } catch (err) {
            throw new Error("Old file name not found or new file name already exists.");
        }
    }
}

module.exports = StorageClient;