const assert = require('assert');
const sha256 = require('js-sha256').sha256;

const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const Patient = require('../builds/Patient.json');
const PatientFactory = require('../builds/PatientFactory.json');

let accounts;
let patient_factory;
let patient;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    patient_factory = await new web3.eth.Contract(PatientFactory.abi)
        .deploy({
            data: PatientFactory.bytecode
        })
        .send({
            from: accounts[0],
            gas: '5000000'
        });
});

describe('Patient Factory Contract Test', async () => {
    it('Create new patient contract', async () => {
        // Create a new patient contract using factory function
        const name = "Jerry Lu";
        const bday = "2000/6/28";
        const gender = "Male";
        const identifier = sha256(JSON.stringify({
            name: name,
            bday: bday,
            gender: gender,
            timestamp: new Date().getTime()
        }));
        await patient_factory.methods.createPatient(name, bday, gender, identifier).send({
            from: accounts[0],
            gas: '5000000'
        });

        const patient_address = await patient_factory.methods.getCreatedPatient(identifier).call();
        const deployed_patients = await patient_factory.methods.getDeployedPatients().call();

        assert(patient_address);
        assert(deployed_patients[0] == patient_address);
    });
});

describe('Patient Contract Test', async() => {
    beforeEach(async() => {
        // Create a new patient contract using factory function
        const name = "Jerry Lu";
        const bday = "2000/6/28";
        const gender = "Male";
        const identifier = sha256(JSON.stringify({
            name: name,
            bday: bday,
            gender: gender,
            timestamp: new Date().getTime()
        }));
        await patient_factory.methods.createPatient(name, bday, gender, identifier).send({
            from: accounts[0],
            gas: '5000000'
        });

        const patient_address = await patient_factory.methods.getCreatedPatient(identifier).call();

        patient = await new web3.eth.Contract(
            Patient.abi,
            patient_address
        );
    })

    it("Patient exists with correct information", async () => {
        assert(patient);
        const name = await patient.methods.name().call();
        const bday = await patient.methods.birthday().call();
        const gndr = await patient.methods.gender().call();

        assert.equal(name, "Jerry Lu");
        assert.equal(bday, "2000/6/28");
        assert.equal(gndr, "Male");
    });

    it("Patient add file and retrieve", async() => {
        const filename = "file";
        const token = sha256(filename);
    
        // Add file to blockchain
        await patient.methods.add_file(filename, token).send({
            from: accounts[0],
            gas: '1000000'
        });
        const filenames = await patient.methods.get_filenames().call();
        assert.equal(filenames.length, 1);
        assert.equal(filenames[0], filename);

        const retrieved_token = await patient.methods.view_file(filename).call();
        assert.equal(retrieved_token, token);
    });

    it('Patient add duplicate files', async() => {
        const filename = "file";
        const token = sha256(filename);
    
        // Add file to blockchain - first time
        await patient.methods.add_file(filename, token).send({
            from: accounts[0],
            gas: '1000000'
        });

        // Add file to blockchain - second time (should fail)
        try {
            await patient.methods.add_file(filename, token).send({
                from: accounts[0],
                gas: '1000000'
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('Patient retrieve non-existing file', async() => {
        const filename = "file";
        const wrong_filename = "file1";
        const token = sha256(filename);

        // When empty
        try {
            const token = await patient.methods.view_file(filename).call();
            assert(false);
        } catch (err) {
            assert(err);
        }
    
        // Add file to blockchain - first time
        await patient.methods.add_file(filename, token).send({
            from: accounts[0],
            gas: '1000000'
        });

        // Non-existing file name
        try {
            const token = await patient.methods.view_file(wrong_filename).call();
            assert(false);
        } catch (err) {
            assert(err);
        }

        // Correct filename
        const retrieved_token = await patient.methods.view_file(filename).call();
        assert.equal(retrieved_token, token);
    });

    it('Patient delete file', async() => {
        const filename = "file";
        const token = sha256(filename);
    
        // Add file to blockchain - first time
        await patient.methods.add_file(filename, token).send({
            from: accounts[0],
            gas: '1000000'
        });
        const filenames = await patient.methods.get_filenames().call();
        assert.equal(filenames.length, 1);
        assert.equal(filenames[0], filename);

        const retrieved_token = await patient.methods.view_file(filename).call();
        assert.equal(retrieved_token, token);
        
        // After delete
        await patient.methods.delete_file(filename).send({
            from: accounts[0],
            gas: '1000000'
        });

        try {
            const retrieved_token_deleted = await patient.methods.view_file(filename).call();
            assert(false);
        } catch(err) {
            assert(err);
        }
        const filenames_deleted = await patient.methods.get_filenames().call();
        assert.equal(filenames_deleted.length, 0);
    });

    it('Patient delete non-existing file', async() => {
        const filename = "file";
        const wrong_filename = "file1";
        const token = sha256(filename);

        // Empty case
        try {
            await patient.methods.delete_file(filename).send({
                from: accounts[0],
                gas: '1000000'
            });
            assert(false);
        } catch (err) {
            assert(err);
        }

        // Add file to blockchain - first time
        await patient.methods.add_file(filename, token).send({
            from: accounts[0],
            gas: '1000000'
        });
        
        // Wrong file
        try {
            await patient.methods.delete_file(wrong_filename).send({
                from: accounts[0],
                gas: '1000000'
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('Patient change filename', async() => {
        const filename = "file";
        const changed_filename = "file1";
        const token = sha256(filename);
    
        // Add file to blockchain
        await patient.methods.add_file(filename, token).send({
            from: accounts[0],
            gas: '1000000'
        });

        await patient.methods.change_filename(filename, changed_filename).send({
            from: accounts[0],
            gas: '1000000'
        });

        const retrieved_token = await patient.methods.view_file(changed_filename).call();
        assert.equal(retrieved_token, token);

        try {
            await patient.methods.view_file(filename).call();
            assert(false);
        } catch (err) {
            assert(err);
        }

        const filenames = await patient.methods.get_filenames().call();
        assert.equal(filenames.length, 1);
        assert.equal(filenames[0], changed_filename);
    });
});
