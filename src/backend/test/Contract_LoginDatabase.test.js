const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const LoginDatabase = require('../ethereum/builds/LoginDatabase.json');

let accounts;
let contract;

beforeEach(async() => {
    accounts = await web3.eth.getAccounts();

    contract = await new web3.eth.Contract(LoginDatabase.abi)
        .deploy({
            data: LoginDatabase.bytecode
        })
        .send({
            from: accounts[0],
            gas: '5000000'
        });

});

describe('Login Database Contract Test', () => {
    it('Login Database contract compliation and deployment', () => {
        assert.ok(contract);
    });

    it('Register new patient account', async() => {
        await contract.methods.register("test@gmail.com", "12345678", false, accounts[1], accounts[2]).send({
            from: accounts[0],
            gas: '1000000'
        });

        const patients = await contract.methods.get_registered_patients().call();
        assert.equal(patients[0], "test@gmail.com");

        const professionals = await contract.methods.get_registered_professionals().call();
        assert.equal(professionals.length, 0);
    });

    it('Register new professional account', async() => {
        await contract.methods.register("test@gmail.com", "12345678", true, accounts[1], accounts[2]).send({
            from: accounts[0],
            gas: '1000000'
        });

        const patients = await contract.methods.get_registered_patients().call();
        assert.equal(patients.length, 0);

        const professionals = await contract.methods.get_registered_professionals().call();
        assert.equal(professionals[0], "test@gmail.com");
    });

    it('Register duplicated user', async() => {
        // First time register
        await contract.methods.register("test@gmail.com", "12345678", true, accounts[1], accounts[2]).send({
            from: accounts[0],
            gas: '1000000'
        });
        let professionals = await contract.methods.get_registered_professionals().call();
        let patients = await contract.methods.get_registered_patients().call();
        assert.equal(professionals[0], "test@gmail.com");
        assert.equal(patients.length, 0);

        // Duplicate user 
        try {
            await contract.methods.register("test@gmail.com", "12345678", true, accounts[1], accounts[2]).send({
                from: accounts[0],
                gas: '1000000'
            });
            assert(false);
        } catch (err) {
            assert(err);
        }

        professionals = await contract.methods.get_registered_professionals().call();
        patients = await contract.methods.get_registered_patients().call();
        assert.equal(professionals[0], "test@gmail.com");
        assert.equal(patients.length, 0);

        // Duplicated user with different account type
        try {
            await contract.methods.register("test@gmail.com", "12345678", false, accounts[1], accounts[2]).send({
                from: accounts[0],
                gas: '1000000'
            });
            assert(false);
        } catch (err) {
            assert(err);
        }

        professionals = await contract.methods.get_registered_professionals().call();
        patients = await contract.methods.get_registered_patients().call();
        assert.equal(professionals[0], "test@gmail.com");
        assert.equal(patients.length, 0);
    });

    it('Verify registered user', async() => {
        const db_addr = accounts[1];
        const controller_addr = accounts[2];
        const null_addr = "0x0000000000000000000000000000000000000000";

        await contract.methods.register("test@gmail.com", "12345678", true, db_addr, controller_addr).send({
            from: accounts[0],
            gas: '1000000'
        });

        // Attempt to login with wrong password
        let verified = await contract.methods.verify("test@gmail.com", "123456", true).call();
        assert.equal(verified, null_addr);

        // Attempt to login with wrong account type
        verified = await contract.methods.verify("test@gmail.com", "12345678", false).call();
        assert.equal(verified, null_addr);

        // Attempt to login with correct credentials
        verified = await contract.methods.verify("test@gmail.com", "12345678", true).call();
        assert.equal(verified, controller_addr);
    });

    it('Verify unregistered user', async() => {
        try {
            let verified = await contract.methods.verify("test@gmail.com", "123456", true).call();
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('Update password', async() => {
        const controller_addr = accounts[2];
        const null_addr = "0x0000000000000000000000000000000000000000";

        await contract.methods.register("test@gmail.com", "12345678", true, accounts[1], controller_addr).send({
            from: accounts[0],
            gas: '1000000'
        });
        let verified = await contract.methods.verify("test@gmail.com", "12345678", true).call();
        assert.equal(verified, controller_addr);

        await contract.methods.update_password("test@gmail.com", "87654321").send({
            from: accounts[0],
            gas: '1000000'
        });

        verified = await contract.methods.verify("test@gmail.com", "12345678", true).call();
        assert.equal(verified, null_addr);
        verified = await contract.methods.verify("test@gmail.com", "87654321", true).call();
        assert.equal(verified, controller_addr);
    });
});