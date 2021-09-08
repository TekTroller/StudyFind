const assert = require('assert');
const axios = require('axios');

let server;

beforeEach(() => {
    server = require('../RegisterServer');
});

afterEach(() => {
    //server.instance.close();
});

describe('Register Server Test', () => {
    it('Send email', async () => {
        let res = await axios.get('http://localhost:3000/get_code', 
        {
            params:{email: '6jerrylu@gmail.com'}
        });
    });
});
