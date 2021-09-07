const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const LoginDatabase = require('../builds/LoginDatabase.json');

let accounts;
let contract;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    contract = await new web3.eth.Contract(LoginDatabase.abi)
        .deploy({
            data: LoginDatabase.bytecode
        })
        .send({
            from: accounts[0],
            gas: '1000000'
        });

});

describe('Login Database contract test', ()=> {
    it('Login Database contract compliation and deployment', () => {
        assert.ok(contract);
    });

    it('Register new user', async () => {
        await contract.methods.register("test@gmail.com", "12345678", true, accounts[1]).send({
            from: accounts[0],
            gas: '1000000'
        });

        const users = await contract.methods.get_registered_users().call();
        assert.equal(users[0], "test@gmail.com");
    });

    it('Register duplicated user', async() => {
        // First time register
        await contract.methods.register("test@gmail.com", "12345678", true, accounts[1]).send({
            from: accounts[0],
            gas: '1000000'
        });
        const users = await contract.methods.get_registered_users().call();
        assert.equal(users[0], "test@gmail.com");
        
        // Duplicate user 
        try {
            await contract.methods.register("test@gmail.com", "12345678", true, accounts[2]).send({
                from: accounts[0],
                gas: '1000000'
            });
            assert(false);
        } catch (err) {
            assert(err);
        }

        // Duplicated user with different account type
        try {
            await contract.methods.register("test@gmail.com", "12345678", false, accounts[3]).send({
                from: accounts[0],
                gas: '1000000'
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('Verify registered user', async() => {
        await contract.methods.register("test@gmail.com", "12345678", true, accounts[1]).send({
            from: accounts[0],
            gas: '1000000'
        });

        // Attempt to login with wrong password
        let verified = await contract.methods.verify("test@gmail.com", "123456", true).call();
        assert(!verified);

        // Attempt to login with wrong account type
        verified = await contract.methods.verify("test@gmail.com", "12345678", false).call();
        assert(!verified);

        // Attempt to login with correct credentials
        verified = await contract.methods.verify("test@gmail.com", "12345678", true).call();
        assert(verified);
    });

    it('Verify unregistered user', async() => {
        try {
            let verified = await contract.methods.verify("test@gmail.com", "123456", true).call();
            assert(false);
        } catch(err) {
            assert(err);
        }
    });

    it('Update password', async() => {
        await contract.methods.register("test@gmail.com", "12345678", true, accounts[1]).send({
            from: accounts[0],
            gas: '1000000'
        });
        let verified = await contract.methods.verify("test@gmail.com", "12345678", true).call();
        assert(verified);

        await contract.methods.update_password("test@gmail.com", "87654321").send({
            from: accounts[0],
            gas: '1000000'
        });
        verified = await contract.methods.verify("test@gmail.com", "12345678", true).call();
        assert(!verified);
        verified = await contract.methods.verify("test@gmail.com", "87654321", true).call();
        assert(verified);
    });
});