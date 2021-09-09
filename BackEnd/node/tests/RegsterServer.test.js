const assert = require('assert');
const path = require('path');
const axios = require('axios');
const { stringify } = require('querystring');

const sleep = (ms) => new Promise(res => setTimeout(res, ms));


let server;

/**
 * Set to tester's email address for receiving testing code.
 */
const tester_email = '6jerrylu@gmail.com';

describe('Register Server Test', () => {
    beforeEach(() => {
        server = require('../RegisterServer');
    });
    
    afterEach(() => {
        server.instance.close();
        delete require.cache[require.resolve('../RegisterServer')];
    });

    it('Server stores code', async () => {
        const email = 'email_addr@provider.domain';

        let res = await axios.get('http://localhost:3000/get_code', 
        {
            params:{email: email}
        });
        const code = res.data.code;
        assert.ok(code);
        assert.ok(server.codes.has(email));

        const server_code = server.codes.get(email);
        const current_time = new Date().getTime();
        assert.equal(server_code.code, code);
        assert.ok(server_code.time < current_time && server_code.time > current_time - 5000);
    });

    it('Sends email', async () => {
        let res = await axios.get('http://localhost:3000/get_code', 
        {
            params:{email: tester_email}
        });
        assert(res.data.code);
        console.log(`\tDeveloper should manually check inbox of ${tester_email} to see if code ${res.data.code} was sent.`);

    });

    it('Verify code with correct email and code', async () => {
        const email = 'email_addr@provider.domain';

        let res = await axios.get('http://localhost:3000/get_code', 
        {
            params:{
                email: email
            }
        });
        const code = res.data.code;

        res = await axios.get('http://localhost:3000/verify', 
        {
            params: {
                email: email,
                code: code
            }
        });
        assert(res.data.verified);
    });

    it('Verify code with wrong code', async () => {
        const email = 'email_addr@provider.domain';

        let res = await axios.get('http://localhost:3000/get_code', 
        {
            params:{
                email: email
            }
        });
        let code = Math.floor(Math.random()*(999999-100000+1)+100000);
        while (code == res.data.code) code = Math.floor(Math.random()*(999999-100000+1)+100000);

        res = await axios.get('http://localhost:3000/verify', 
        {
            params: {
                email: email,
                code: code
            }
        });
        assert(!res.data.verified);
    });

    it('Verify code with changed email', async () => {
        const email = 'email_addr@provider.domain';
        const changed_email = 'changed_email_addr@provider.domain';
        let res = await axios.get('http://localhost:3000/get_code', 
        {
            params:{
                email: email
            }
        });
        const code = res.data.code;

        res = await axios.get('http://localhost:3000/verify', 
        {
            params: {
                email: changed_email,
                code: code
            }
        });
        assert(!res.data.verified);
    });

    it('Request multiple times', async () => {
        const email = 'email_addr@provider.domain';

        let res = await axios.get('http://localhost:3000/get_code', 
        {
            params:{email: email}
        });
        const first_code = res.data.code;
        await sleep(5000);

        res = await axios.get('http://localhost:3000/get_code', 
        {
            params:{email: email}
        });
        const second_code = res.data.code;

        assert.ok(first_code);
        assert.ok(second_code);
        assert.ok(server.codes.has(email));

        const sent_time = server.codes.get(email).time;
        const current_time = new Date().getTime();
        assert.ok(sent_time < current_time && sent_time > current_time - 5000);


        res = await axios.get('http://localhost:3000/verify', 
        {
            params: {
                email: email,
                code: first_code
            }
        });
        const first_verified = res.data.verified;

        res = await axios.get('http://localhost:3000/verify', 
        {
            params: {
                email: email,
                code: second_code
            }
        });
        const second_verified = res.data.verified;

        assert.ok(!first_verified);
        assert.ok(second_verified);
    }).timeout(10000);

    it('Code expires after 5 minutes', async () => {
        const email = 'expire_test@provider.domain';
        let res = await axios.get('http://localhost:3000/get_code', 
        {
            params:{email: email}
        });
        const code = res.data.code;
        await sleep(301000);
        
        res = await axios.get('http://localhost:3000/verify', 
        {
            params: {
                email: email,
                code: code
            }
        });
        assert(!res.data.verified);
        assert.equal(res.data.reason, 'email not recognized');
        assert.equal(res.data.message, 'Code may have expired, please resend code and try again.');
    }).timeout(310000);
});
