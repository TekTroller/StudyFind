const assert = require('assert');

const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const LoginDatabase = require('../ethereum/builds/LoginDatabase.json');
const ProfessionalController = require('../ethereum/builds/ProfessionalController.json');
const ProfessionalFactory = require('../ethereum/builds/ProfessionalFactory.json');
const PatientController = require('../ethereum/builds/PatientController.json');
const PatientFactory = require('../ethereum/builds/PatientFactory.json');
const PatientDatabase = require('../ethereum/builds/PatientDatabase.json');

const pat1 = {
    name: "Patient Name 1",
    birthday: "2000/1/1",
    gender: "M",
    email: "patient1@gmail.com",
    password: 'patient_password1',
    files: [
        {
            filename: 'patient 1 file 1',
            token: 'patient 1 file 1 token'
        },
        {
            filename: 'patient 1 file 2',
            token: 'patient 1 file 2 token'
        },
        {
            filename: 'patient 1 file 3',
            token: 'patient 1 file 3 token'
        }
    ]
}

const pat2 = {
    name: "Patient Name 2",
    birthday: "2010/12/31",
    gender: "F",
    email: "patient2@gmail.com",
    password: 'patient_password2',
    files: [
        {
            filename: 'patient 2 file 1',
            token: 'patient 2 file 1 token'
        }
    ]
}

const pat3 = {
    name: "Patient Name 3",
    birthday: "2000/6/28",
    gender: "M",
    email: "patient3@gmail.com",
    password: 'patient_password3',
    files: []
}

const pro1 = {
    name: "Professional Name 1",
    birthday: "1990/1/1",
    gender: "M",
    email: "professional1@gmail.com",
    institution: "Georgia Institution of Technology",
    password: 'professional_password1'
}

const pro2 = {
    name: "Professional Name 2",
    birthday: "1990/1/1",
    gender: "F",
    email: "professional2@gmail.com",
    institution: "Emory University",
    password: 'professional_password2'
}

const null_addr = '0x0000000000000000000000000000000000000000';
let accounts;
let login_db;
let patient_factory;
let professional_factory;
let patient_1, patient_2, patient_3, professional_1, professional_2;

describe('Integration test', async () => {
    beforeEach(async () => {
        // Deploy login database and factory contracts
        // Then create 3 patient accounts and 2 professional accounts and register them to login database
        accounts = await web3.eth.getAccounts();
        login_db = await new web3.eth.Contract(LoginDatabase.abi)
        .deploy({
            data: LoginDatabase.bytecode
        }).send({
            from: accounts[0],
            gas: '5000000'
        });

        patient_factory = await new web3.eth.Contract(PatientFactory.abi)
        .deploy({
            data: PatientFactory.bytecode
        }).send({
            from: accounts[0],
            gas: '5000000'
        });

        professional_factory = await new web3.eth.Contract(ProfessionalFactory.abi)
        .deploy({
            data: ProfessionalFactory.bytecode,
            arguments: [login_db.options.address]
        }).send({
            from: accounts[0],
            gas: '5000000'
        });

        // Deploy users
        await patient_factory.methods.create_patient(pat1.name, pat1.birthday, pat1.gender, pat1.email).send({
            from: accounts[0],
            gas: '5000000'
        });
        const {0: patient_1_db, 1: patient_1_controller} = await patient_factory.methods.get_created_patient(pat1.email).call();
        patient_1 = new web3.eth.Contract(PatientController.abi, patient_1_controller);

        await patient_factory.methods.create_patient(pat2.name, pat2.birthday, pat2.gender, pat2.email).send({
            from: accounts[0],
            gas: '5000000'
        });
        const {0: patient_2_db, 1: patient_2_controller} = await patient_factory.methods.get_created_patient(pat2.email).call();
        patient_2 = new web3.eth.Contract(PatientController.abi, patient_2_controller);

        await patient_factory.methods.create_patient(pat3.name, pat3.birthday, pat3.gender, pat3.email).send({
            from: accounts[0],
            gas: '5000000'
        });
        const {0: patient_3_db, 1: patient_3_controller} = await patient_factory.methods.get_created_patient(pat3.email).call();
        patient_3 = new web3.eth.Contract(PatientController.abi, patient_3_controller);

        await professional_factory.methods.create_professional(pro1.name, pro1.birthday, pro1.gender, pro1.email, pro1.institution).send({
            from: accounts[0],
            gas: '5000000'
        });
        const professional_1_controller = await professional_factory.methods.get_created_professional(pro1.email).call();
        professional_1 = new web3.eth.Contract(ProfessionalController.abi, professional_1_controller);

        await professional_factory.methods.create_professional(pro2.name, pro2.birthday, pro2.gender, pro2.email, pro2.institution).send({
            from: accounts[0],
            gas: '5000000'
        });
        const professional_2_controller = await professional_factory.methods.get_created_professional(pro2.email).call();
        professional_2 = new web3.eth.Contract(ProfessionalController.abi, professional_2_controller);

        // Register on login db
        await login_db.methods.register(pat1.email, pat1.password, false, patient_1_db, patient_1_controller).send({
            from: accounts[0],
            gas: '1000000'
        });
        await login_db.methods.register(pat2.email, pat2.password, false, patient_2_db, patient_2_controller).send({
            from: accounts[0],
            gas: '1000000'
        });
        await login_db.methods.register(pat3.email, pat3.password, false, patient_3_db, patient_3_controller).send({
            from: accounts[0],
            gas: '1000000'
        });
        await login_db.methods.register(pro1.email, pro1.password, true, null_addr, professional_1_controller).send({
            from: accounts[0],
            gas: '1000000'
        });
        await login_db.methods.register(pro2.email, pro2.password, true, null_addr, professional_2_controller).send({
            from: accounts[0],
            gas: '1000000'
        });

        // add files for patient
        pat1.files.forEach(async (file) => {
            await patient_1.methods.add_file(file.filename, file.token).send({
                from: accounts[0],
                gas: '1000000'
            });
        });

        pat2.files.forEach(async (file) => {
            await patient_2.methods.add_file(file.filename, file.token).send({
                from: accounts[0],
                gas: '1000000'
            });
        });

        pat3.files.forEach(async (file) => {
            await patient_3.methods.add_file(file.filename, file.token).send({
                from: accounts[0],
                gas: '1000000'
            });
        });
    });
    
    it('Login Database, Patient and Professional contract compilation and deployment', () => {
        assert(login_db);
        assert(patient_factory);
        assert(professional_factory);
        assert(patient_1);
        assert(patient_2);
        assert(patient_3);
        assert(professional_1);
        assert(professional_2);
    });

    it('Login Database contract set up', async () => {
        // ensure all users are registered
        const registered_patients =  await login_db.methods.get_registered_patients().call();
        const registered_professionals = await login_db.methods.get_registered_professionals().call();

        assert(registered_patients.includes(pat1.email));
        assert(registered_patients.includes(pat2.email));
        assert(registered_patients.includes(pat3.email));
        assert(registered_professionals.includes(pro1.email));
        assert(registered_professionals.includes(pro2.email));

        // login test
        const pat1_correct = await login_db.methods.verify(pat1.email, pat1.password, false).call();
        const pat1_wrong = await login_db.methods.verify(pat1.email, pat1.password, true).call();
        
        const pat2_correct = await login_db.methods.verify(pat2.email, pat2.password, false).call();
        const pat2_wrong = await login_db.methods.verify(pat2.email, "wrong password", false).call();

        const pat3_correct = await login_db.methods.verify(pat3.email, pat3.password, false).call();

        const pro1_correct = await login_db.methods.verify(pro1.email, pro1.password, true).call();
        const pro1_wrong = await login_db.methods.verify(pro1.email, "wrong password", true);

        const pro2_correct = await login_db.methods.verify(pro2.email, pro2.password, true).call();
        const pro2_wrong = await login_db.methods.verify(pro2.email, pro2.password, false).call();

        assert.equal(pat1_wrong, pat2_wrong, pro1_wrong, pro2_wrong, null_addr);
        assert.equal(pat1_correct, patient_1.options.address);
        assert.equal(pat2_correct, patient_2.options.address);
        assert.equal(pat3_correct, patient_3.options.address);
        assert.equal(pro1_correct, professional_1.options.address);
        assert.equal(pro2_correct, professional_2.options.address);

        try {
            const _ = await login_db.methods.verify('notregistered@gmail.com', "some password", true).call();
            assert(false);
        } catch (err) {
            assert(err);
        }

        try {
            const _ = await login_db.methods.verify('notregistered@gmail.com', "some password", false).call();
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('Patient contracts set up', async () => {
        // check registered information
        const pat1_name_test = await patient_1.methods.get_name().call();
        const pat2_name_test = await patient_2.methods.get_name().call();
        const pat3_name_test = await patient_3.methods.get_name().call();

        const pat1_birthday_test = await patient_1.methods.get_birthday().call();
        const pat2_birthday_test = await patient_2.methods.get_birthday().call();
        const pat3_birthday_test = await patient_3.methods.get_birthday().call();

        const pat1_gender_test = await patient_1.methods.get_gender().call();
        const pat2_gender_test = await patient_2.methods.get_gender().call();
        const pat3_gender_test = await patient_3.methods.get_gender().call();

        const pat1_email_test = await patient_1.methods.get_email().call();
        const pat2_email_test = await patient_2.methods.get_email().call();
        const pat3_email_test = await patient_3.methods.get_email().call();

        assert.equal(pat1.name, pat1_name_test);
        assert.equal(pat2.name, pat2_name_test);
        assert.equal(pat3.name, pat3_name_test);

        assert.equal(pat1.birthday, pat1_birthday_test);
        assert.equal(pat2.birthday, pat2_birthday_test);
        assert.equal(pat3.birthday, pat3_birthday_test);

        assert.equal(pat1.gender, pat1_gender_test);
        assert.equal(pat2.gender, pat2_gender_test);
        assert.equal(pat3.gender, pat3_gender_test);

        assert.equal(pat1.email, pat1_email_test);
        assert.equal(pat2.email, pat2_email_test);
        assert.equal(pat3.email, pat3_email_test);


        // check patient files
        const patient1_files = await patient_1.methods.get_filenames().call();
        const patient2_files = await patient_2.methods.get_filenames().call();
        const patient3_files = await patient_3.methods.get_filenames().call();

        assert.equal(patient1_files.length, pat1.files.length);
        assert.equal(patient2_files.length, pat2.files.length);
        assert.equal(patient3_files.length, pat3.files.length);
        pat1.files.forEach((file) => {
            assert(patient1_files.includes(file.filename));
        });
        pat2.files.forEach((file) => {
            assert(patient2_files.includes(file.filename));
        });
        pat3.files.forEach((file) => {
            assert(patient3_files.includes(file.filename));
        });
        
        // check patient file tokens
        pat1.files.forEach(async (file) => {
            const token = await patient_1.methods.view_file(file.filename).call();
            assert(token, file.token);
        });
        pat2.files.forEach(async (file) => {
            const token = await patient_2.methods.view_file(file.filename).call();
            assert(token, file.token);
        });
        pat3.files.forEach(async (file) => {
            const token = await patient_3.methods.view_file(file.filename).call();
            assert(token, file.token);
        });
    });

    it('Professional contract set up', async() => {
        const pro1_name_test = await professional_1.methods.get_name().call();
        const pro2_name_test = await professional_2.methods.get_name().call();
        
        const pro1_birthday_test = await professional_1.methods.get_birthday().call();
        const pro2_birthday_test = await professional_2.methods.get_birthday().call();

        const pro1_gender_test = await professional_1.methods.get_gender().call();
        const pro2_gender_test = await professional_2.methods.get_gender().call();

        const pro1_email_test = await professional_1.methods.get_email().call();
        const pro2_email_test = await professional_2.methods.get_email().call();

        const pro1_institution_test = await professional_1.methods.get_institution().call();
        const pro2_institution_test = await professional_2.methods.get_institution().call();

        assert.equal(pro1.name, pro1_name_test);
        assert.equal(pro2.name, pro2_name_test);

        assert.equal(pro1.birthday, pro1_birthday_test);
        assert.equal(pro2.birthday, pro2_birthday_test);

        assert.equal(pro1.gender, pro1_gender_test);
        assert.equal(pro2.gender, pro2_gender_test);

        assert.equal(pro1.email, pro1_email_test);
        assert.equal(pro2.email, pro2_email_test);

        assert.equal(pro1.institution, pro1_institution_test);
        assert.equal(pro2.institution, pro2_institution_test);
    });

    it('Professional send view request', async () => {
        const assert_length = async (pat1_length, pat2_length, pro1_length, pro2_length) => {
            const unprocessed_requests_patient1 = await patient_1.methods.get_unprocessed_requests().call();
            const unprocessed_requests_patient2 = await patient_2.methods.get_unprocessed_requests().call();
            const pending_requests_professional1 = await professional_1.methods.get_pending_requests().call();
            const pending_requests_professional2 = await professional_2.methods.get_pending_requests().call();
            
            assert.equal(unprocessed_requests_patient1.length, pat1_length);
            assert.equal(unprocessed_requests_patient2.length, pat2_length);
            assert.equal(pending_requests_professional1.length, pro1_length);
            assert.equal(pending_requests_professional2.length, pro2_length);
        }

        // pro1 => pat1
        await professional_1.methods.request_access(pat1.email).send({
            from: accounts[0],
            gas: '1000000'
        });
        await assert_length(1, 0, 1, 0);

        // pro2 => pat1
        await professional_2.methods.request_access(pat1.email).send({
            from: accounts[0],
            gas: '1000000'
        });
        await assert_length(2, 0, 1, 1);

        // pro1 => pat2
        await professional_1.methods.request_access(pat2.email).send({
            from: accounts[0],
            gas: '1000000'
        });
        await assert_length(2, 1, 2, 1);

        // pro1 => pat1 (duplicate, should fail)
        try {
            await professional_1.methods.request_access(pat1.email).send({
                from: accounts[0],
                gas: '1000000'
            });
            assert(false);
        } catch (err) {
            assert(err);
        }

        // Check information is correct
        // pat1 => [pro1, pro2]
        // pat2 => [pro1]
        // pro1 => [pat1, pat2]
        // pro2 => [pat1]
        const unprocessed_requests_patient1 = await patient_1.methods.get_unprocessed_requests().call();
        const unprocessed_requests_patient2 = await patient_2.methods.get_unprocessed_requests().call();
        const pending_requests_professional1 = await professional_1.methods.get_pending_requests().call();
        const pending_requests_professional2 = await professional_2.methods.get_pending_requests().call();

        assert(pending_requests_professional1.includes(pat1.email));
        assert(pending_requests_professional1.includes(pat2.email));
        assert(pending_requests_professional2.includes(pat1.email));

        unprocessed_requests_patient1.forEach(pro_result => {
            let pro;
            if (pro_result.name == pro1.name) {
                pro = pro1;
            } else if (pro_result.name == pro2.name) {
                pro = pro2;
            } else {
                assert(false);
            }

            assert(pro_result.email, pro.email);
            assert(pro_result.gender, pro.gender);
            assert(pro_result.institution, pro.institution);
        });

        assert(unprocessed_requests_patient2[0].name, pro1.name);
        assert(unprocessed_requests_patient2[0].email, pro1.email);
        assert(unprocessed_requests_patient2[0].gender, pro1.gender);
        assert(unprocessed_requests_patient2[0].institution, pro1.institution);
    });

    it('Patient process request', async () => {
        let unprocessed_requests_patient1, unprocessed_requests_patient2, unprocessed_requests_patient3,
        authorized_professionals_patient1, authorized_professionals_patient2, authorized_professionals_patient3;
        let pending_requests_professional1, pending_requests_professional2, patients_professional_1, patients_professional_2;

        // pro1 => pat1
        await professional_1.methods.request_access(pat1.email).send({
            from: accounts[0],
            gas: '1000000'
        });

        // pro2 => pat1
        await professional_2.methods.request_access(pat1.email).send({
            from: accounts[0],
            gas: '1000000'
        });

        // pro1 => pat2
        await professional_1.methods.request_access(pat2.email).send({
            from: accounts[0],
            gas: '1000000'
        });

        // pro1 => pat3
        await professional_1.methods.request_access(pat3.email).send({
            from: accounts[0],
            gas: '1000000'
        });


        // pat1 => pro1 (accept)
        await patient_1.methods.process_request(pro1.email, true).send({
            from: accounts[0],
            gas: '1000000'
        });
        unprocessed_requests_patient1 = await patient_1.methods.get_unprocessed_requests().call();
        authorized_professionals_patient1 = await patient_1.methods.get_authorized_professionals().call();
        pending_requests_professional1 = await professional_1.methods.get_pending_requests().call();        
        patients_professional_1 = await professional_1.methods.get_patients().call();
        assert.equal(
            unprocessed_requests_patient1.length, 
            authorized_professionals_patient1.length, 
            patients_professional_1.length,
            1
            );
        assert.equal(pending_requests_professional1.length, 2);

        assert.equal(unprocessed_requests_patient1[0].name, pro2.name);
        assert.equal(unprocessed_requests_patient1[0].gender, pro2.gender);
        assert.equal(unprocessed_requests_patient1[0].email, pro2.email);
        assert.equal(unprocessed_requests_patient1[0].institution, pro2.institution);

        assert.equal(authorized_professionals_patient1[0].name, pro1.name);
        assert.equal(authorized_professionals_patient1[0].gender, pro1.gender);
        assert.equal(authorized_professionals_patient1[0].email, pro1.email);
        assert.equal(authorized_professionals_patient1[0].institution, pro1.institution);

        assert(pending_requests_professional1.includes(pat2.email));
        assert(pending_requests_professional1.includes(pat3.email));
        assert.equal(patients_professional_1[0], pat1.email);

        // pat1 => pro1 (reject) Should fail since already processed
        try {
            await patient_1.methods.process_request(pro1.email, false).send({
                from: accounts[0],
                gas: '1000000'
            });
            assert(false);
        } catch (err) {
            assert(err);
        }

        // pat1 => pro2 (reject)
        await patient_1.methods.process_request(pro2.email, false).send({
            from: accounts[0],
            gas: '1000000'
        });
        unprocessed_requests_patient1 = await patient_1.methods.get_unprocessed_requests().call();
        authorized_professionals_patient1 = await patient_1.methods.get_authorized_professionals().call();
        pending_requests_professional2 = await professional_2.methods.get_pending_requests().call();        
        patients_professional_2 = await professional_2.methods.get_patients().call();

        assert.equal(
            unprocessed_requests_patient1.length,
            pending_requests_professional2.length,
            patients_professional_2.length,
            0
        );
        assert.equal(authorized_professionals_patient1.length, 1);
        assert.equal(authorized_professionals_patient1[0].name, pro1.name);
        assert.equal(authorized_professionals_patient1[0].gender, pro1.gender);
        assert.equal(authorized_professionals_patient1[0].email, pro1.email);
        assert.equal(authorized_professionals_patient1[0].institution, pro1.institution);

        // pat2 => pro2 (accept) Should fail since request not exist
        try {
            await patient_2.methods.process_request(pro2.email, true).send({
                from: accounts[0],
                gas: '1000000'
            });
            assert(false);
        } catch (err) {
            assert(err);
        }

        // pat2 => pro1 (accept)
        await patient_2.methods.process_request(pro1.email, true).send({
            from: accounts[0],
            gas: '1000000'
        });
        unprocessed_requests_patient2 = await patient_2.methods.get_unprocessed_requests().call();
        authorized_professionals_patient2 = await patient_2.methods.get_authorized_professionals().call();
        pending_requests_professional1 = await professional_1.methods.get_pending_requests().call();        
        patients_professional_1 = await professional_1.methods.get_patients().call();

        assert.equal(unprocessed_requests_patient2.length, 0);
        assert.equal(authorized_professionals_patient2.length, pending_requests_professional1.length, 1);
        assert(patients_professional_1.length, 2);
        assert(patients_professional_1.includes(pat1.email));
        assert(patients_professional_1.includes(pat2.email));
        assert.equal(authorized_professionals_patient2[0].name, pro1.name);
        assert.equal(authorized_professionals_patient2[0].gender, pro1.gender);
        assert.equal(authorized_professionals_patient2[0].email, pro1.email);
        assert.equal(authorized_professionals_patient2[0].institution, pro1.institution);

        // pat3 => pro1 (reject)
        await patient_3.methods.process_request(pro1.email, false).send({
            from: accounts[0],
            gas: '1000000'
        });
        unprocessed_requests_patient3 = await patient_3.methods.get_unprocessed_requests().call();
        authorized_professionals_patient3 = await patient_3.methods.get_authorized_professionals().call();
        pending_requests_professional1 = await professional_1.methods.get_pending_requests().call();        
        patients_professional_1 = await professional_1.methods.get_patients().call();

        assert.equal(
            unprocessed_requests_patient3.length,
            authorized_professionals_patient3.length,
            pending_requests_professional1.length,
            0
            );
        assert.equal(patients_professional_1.length, 2);
        assert(patients_professional_1.includes(pat1.email));
        assert(patients_professional_1.includes(pat2.email));

        // pro2 => pat2
        await professional_2.methods.request_access(pat2.email).send({
            from: accounts[0],
            gas: '1000000'
        });

        // pat2 => pro2 (accept)
        await patient_2.methods.process_request(pro2.email, true).send({
            from: accounts[0],
            gas: '1000000'
        });
        authorized_professionals_patient2 = await patient_2.methods.get_authorized_professionals().call();
        assert.equal(authorized_professionals_patient2.length, 2);
        authorized_professionals_patient2.forEach(pro_result => {
            let pro;
            if (pro_result.email == pro1.email) {
                pro = pro1;
            } else if (pro_result.email == pro2.email) {
                pro = pro2;
            }
            assert.equal(pro_result.name, pro.name);
            assert.equal(pro_result.gender, pro.gender);
            assert.equal(pro_result.email, pro.email);
            assert.equal(pro_result.institution, pro.institution);        
        });
    });

    it('Professional view patient file', async () => {
        // unauthorized profesisonal attempt to view file, should fail
        try {
            const files = await professional_1.methods.get_patient_filenames(pat1.email).call();
            assert(false);
        } catch (err) {
            assert(err);
        }

        await professional_1.methods.request_access(pat1.email).send({
            from: accounts[0],
            gas: '1000000'
        });
        await patient_1.methods.process_request(pro1.email, true).send({
            from: accounts[0],
            gas: '1000000'
        });

        const files = await professional_1.methods.get_patient_filenames(pat1.email).call();
        assert.equal(files.length, pat1.files.length);

        files.forEach(async (filename) => {
            const token = await professional_1.methods.view_patient_file(filename).call();
            let flag = false;
            pat1.files.forEach(pat1_file => {
                if (pat1_file.filename == filename) {
                    flag = true;
                    assert.equal(token, pat1_file.token);
                }
            });
            assert(flag);
        });
    });

    it('Patient ban professional', async () => {
        await professional_1.methods.request_access(pat1.email).send({
            from: accounts[0],
            gas: '1000000'
        });
        await patient_1.methods.process_request(pro1.email, true).send({
            from: accounts[0],
            gas: '1000000'
        });

        await professional_1.methods.request_access(pat2.email).send({
            from: accounts[0],
            gas: '1000000'
        });
        await patient_2.methods.process_request(pro1.email, true).send({
            from: accounts[0],
            gas: '1000000'
        });

        let patients = await professional_1.methods.get_patients().call();
        assert.equal(patients.length, 2);
        assert(patients.includes(pat1.email));
        assert(patients.includes(pat2.email));

        // patient2 bans professional1
        await patient_2.methods.ban_professional(pro1.email).send({
            from: accounts[0],
            gas: '1000000'
        });
        patients = await professional_1.methods.get_patients().call();
        assert.equal(patients.length, 1);
        assert(patients.includes(pat1.email));
        
        // attempt to access patient 2 files, which should fail
        try {
            const files = await professional_1.methods.get_patient_filenames(pat2.email).call();
            assert(false);
        } catch (err) {
            assert(err);
        }
    });
});