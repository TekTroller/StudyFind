const assert = require('assert');

const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const ProfessionalController = require('../ethereum/builds/ProfessionalController.json');
const ProfessionalFactory = require('../ethereum/builds/ProfessionalFactory.json');


let accounts;
let professional_factory;
let professional_controller;

const name_init = "Professional Name";
const birthday_init = "2000/1/1";
const gender_init = "M";
const email_init = "professional@gmail.com";
const institution_init = "Georgia Institute of Technology";

beforeEach(async() => {
    accounts = await web3.eth.getAccounts();
    professional_factory = await new web3.eth.Contract(ProfessionalFactory.abi)
        .deploy({
            data: ProfessionalFactory.bytecode,
            arguments: ['0x0000000000000000000000000000000000000000']
        })
        .send({
            from: accounts[0],
            gas: '5000000'
        });

    // Create professional
    await professional_factory.methods.create_professional(name_init, birthday_init, gender_init, email_init, institution_init).send({
        from: accounts[0],
        gas: '5000000'
    });

    const professional_addr = await professional_factory.methods.get_created_professional(email_init).call();
    professional_controller = new web3.eth.Contract(ProfessionalController.abi, professional_addr);
});

describe('Professional Contract Tests (Factory, Controller)', async() => {
    it('Professional factory compilation and deployment', () => {
        assert(professional_factory);
    });

    it('Create new professional', () => {
        assert(professional_controller);
    });

    it('Professional information correct', async () => {
        const name = await professional_controller.methods.get_name().call();
        const birthday = await professional_controller.methods.get_birthday().call();
        const gender = await professional_controller.methods.get_gender().call();
        const email = await professional_controller.methods.get_email().call();
        const institution = await professional_controller.methods.get_institution().call();

        assert.equal(name, name_init);
        assert.equal(birthday, birthday_init);
        assert.equal(gender, gender_init);
        assert.equal(email, email_init);
        assert.equal(institution, institution_init);
    });


});