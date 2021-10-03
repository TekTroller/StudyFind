const { Firestore } = require('@google-cloud/firestore');
const path = require('path');
const sha256 = require('js-sha256').sha256;

// Ethereum contracts imports
const Patient = require('../ethereum/builds/Patient.json');
const WalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

class FirestoreClient {
    constructor() {
        // Firestore
        this.client = new Firestore({
            projectId: 'studyfind-medical-database',
            keyFilename: path.join(__dirname, 'keys/studyfind-medical-database-key.json')
        });

        if (!this.client) {
            throw new Error("Failed to initialize, check firestore credentials.")
        }
    }

    async upload(file) {
        // Compute a token for file
        const file_token = sha256(file);

        // Upload file to google firestore
        try {
            const doc_ref = this.client.collection('root').doc(file_token);
            await doc_ref.set({
                data: file
            });
        } catch (err) {
            throw new Error("Something went wrong when communicating with Google firestore.")
        }

        return file_token;
    }

    async view(file_token) {
        // Retrieve file from firestore
        let file;
        try {
            const doc_ref = this.client.doc("root/" + file_token);
            file = await doc_ref.get();
        } catch (err) {
            throw new Error("Something went wrong when communicating with Google firestore.")
        }

        return file.data();
    }

    async delete(file_token) {
        try {
            const doc_ref = this.client.doc("root/" + file_token);
            await doc_ref.delete();
        } catch (err) {
            throw new Error("Something went wrong when communicating with Google firestore.")
        }
    }
}

module.exports = FirestoreClient;