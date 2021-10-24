const assert = require('assert');

const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const PatientController = require('../ethereum/builds/PatientController.json');
const PatientFactory = require('../ethereum/builds/PatientFactory.json');
const PatientDatabase = require('../ethereum/builds/PatientDatabase.json');

let accounts;
let patient_factory;
let patient_controller;
let patient_database;

const name_init = "Patient Name";
const birthday_init = "2000/1/1";
const gender_init = "M";
const email_init = "patient@gmail.com";

beforeEach(async() => {
    accounts = await web3.eth.getAccounts();
    patient_factory = await new web3.eth.Contract(PatientFactory.abi)
        .deploy({
            data: PatientFactory.bytecode
        })
        .send({
            from: accounts[0],
            gas: '5000000'
        });

    // create patient
    await patient_factory.methods.create_patient(name_init, birthday_init, gender_init, email_init).send({
        from: accounts[0],
        gas: '5000000'
    });

    const {0:db_addr, 1:controller_addr} = await patient_factory.methods.get_created_patient(email_init).call();
    patient_controller = new web3.eth.Contract(PatientController.abi, controller_addr);
    patient_database = new web3.eth.Contract(PatientDatabase.abi, db_addr);
});

describe('Patient Contract Tests (Factory, Database, Controller)', () => {
    it('Patient factory compilation and deployment', () => {
        assert(patient_factory);
    });

    it('Create new patient', () => {
        assert(patient_controller);
    });

    it('Patient information is accessible via controller interface', async() => {
        const name = await patient_controller.methods.get_name().call();
        const birthday = await patient_controller.methods.get_birthday().call();
        const gender = await patient_controller.methods.get_gender().call();
        const email = await patient_controller.methods.get_email().call();

        assert.equal(name, name_init);
        assert.equal(birthday, birthday_init);
        assert.equal(gender, gender_init);
        assert.equal(email, email_init);
    });

    it('Direct accessing patient information without controller not allowed', async() => {
        try {
            const name = await patient_database.methods.get_name().call();
            assert(false);
        } catch (err) {
            assert(err);
        }

        try {
            const birthday = await patient_database.methods.get_birthday().call();
            assert(false);
        } catch (err) {
            assert(err);
        }

        try {
            const gender = await patient_database.methods.get_gender().call();
            assert(false);
        } catch (err) {
            assert(err);
        }

        try {
            const email = await patient_database.methods.get_email().call();
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('Rebinding database to controller not allowed', async() => {
        // Create a new patient
        await patient_factory.methods.create_patient("Patient Name 2", birthday_init, gender_init, "patient2@gmail.com").send({
            from: accounts[0],
            gas: '5000000'
        });
    
        const {0:db_addr, 1:controller_addr} = await patient_factory.methods.get_created_patient(email_init).call();


        try {
            await patient_database.methods.bind(db_addr).call({
                from: accounts[0],
                gas: '5000000'
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('Add new file', async() => {
        await patient_controller.methods.add_file("filename", "access_token").send({
            from: accounts[0],
            gas: '1000000'
        });

        let filenames = await patient_controller.methods.get_filenames().call();
        assert.equal(filenames.length, 1);
        assert.equal(filenames[0], "filename");

        await patient_controller.methods.add_file("filename2", "access_token2").send({
            from: accounts[0],
            gas: '1000000'
        });

        filenames = await patient_controller.methods.get_filenames().call();
        assert.equal(filenames.length, 2);
        assert.equal(filenames[0], "filename");
        assert.equal(filenames[1], "filename2");
    });

    it('Add files with duplicated filename', async() => {
        await patient_controller.methods.add_file("filename", "access_token1").send({
            from: accounts[0],
            gas: '5000000'
        });

        try {
            await patient_controller.methods.add_file("filename", "access_token2").send({
                from: accounts[0],
                gas: '5000000'
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('View file', async() => {
        await patient_controller.methods.add_file("filename", "access_token").send({
            from: accounts[0],
            gas: '5000000'
        });

        const token = await patient_controller.methods.view_file("filename").call();
        assert.equal(token, "access_token");
    });

    it('View file that has not been added', async() => {
        try {
            const token = await patient_controller.methods.view_file("filename").call();
            assert(false);
        } catch (err) {
            assert(err);
        }

        await patient_controller.methods.add_file("filename", "access_token").send({
            from: accounts[0],
            gas: '5000000'
        });

        try {
            const token = await patient_controller.methods.view_file("wrong_filename").call();
            assert(false);
        } catch (err) {
            assert(err);
        }

        const token = await patient_controller.methods.view_file("filename").call();
        assert.equal(token, "access_token");
    });

    it('Delete file', async() => {
        await patient_controller.methods.add_file("filename1", "access_token1").send({
            from: accounts[0],
            gas: '5000000'
        });
        await patient_controller.methods.add_file("filename2", "access_token2").send({
            from: accounts[0],
            gas: '5000000'
        });
        await patient_controller.methods.add_file("filename3", "access_token3").send({
            from: accounts[0],
            gas: '5000000'
        });
        await patient_controller.methods.add_file("filename4", "access_token4").send({
            from: accounts[0],
            gas: '5000000'
        });
        let filenames = await patient_controller.methods.get_filenames().call();
        assert.equal(filenames.length, 4);
        assert(filenames.includes("filename1"));
        assert(filenames.includes("filename2"));
        assert(filenames.includes("filename3"));
        assert(filenames.includes("filename4"));

        // Start deleting
        await patient_controller.methods.delete_file("filename2").send({
            from: accounts[0],
            gas: '5000000'
        });
        filenames = await patient_controller.methods.get_filenames().call();
        assert.equal(filenames.length, 3);
        assert(filenames.includes("filename1"));
        assert(filenames.includes("filename3"));
        assert(filenames.includes("filename4"));

        await patient_controller.methods.delete_file("filename1").send({
            from: accounts[0],
            gas: '5000000'
        });
        filenames = await patient_controller.methods.get_filenames().call();
        assert(filenames.length, 2);
        assert(filenames.includes("filename3"));
        assert(filenames.includes("filename4"));

        await patient_controller.methods.delete_file("filename4").send({
            from: accounts[0],
            gas: '5000000'
        });
        filenames = await patient_controller.methods.get_filenames().call();
        assert.equal(filenames.length, 1);
        assert(filenames.includes("filename3"));

        await patient_controller.methods.delete_file("filename3").send({
            from: accounts[0],
            gas: '5000000'
        });
        filenames = await patient_controller.methods.get_filenames().call();
        assert.equal(filenames.length, 0);
    });

    it('Delete file that has not been added', async() => {
        try {
            await patient_controller.methods.delete_file("filename").send({
                from: accounts[0],
                gas: '5000000'
            });
            assert(false);
        } catch (err) {
            assert(err);
        }

        await patient_controller.methods.add_file("filename", "access_token").send({
            from: accounts[0],
            gas: '5000000'
        });

        try {
            await patient_controller.methods.delete_file("wrong_filename").send({
                from: accounts[0],
                gas: '5000000'
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('Directly managing file without controller not allowed', async() => {
        await patient_controller.methods.add_file("filename", "access_token").send({
            from: accounts[0],
            gas: '5000000'
        });

        // Add file
        try {
            await patient_database.methods.add_file("filename2", "access_token2").send({
                from: accounts[0],
                gas: '5000000'
            });
            assert(false);
        } catch (err) {
            assert(err);
        }

        // View file
        try {
            await patient_database.methods.view("filename").call();
            assert(false);
        } catch (err) {
            assert(err);
        }

        // Get filenames
        try {
            await patient_database.methods.get_filenames().call();
            assert(false);
        } catch (err) {
            assert(err);
        }

        // Delete file       
        try {
            await patient_database.methods.delete_file("filename").send({
                from: accounts[0],
                gas: '5000000'
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });
});