const fs = require("fs-extra");
const path = require("path");

const LoginDatabase = require("../builds/LoginDatabase.json");
const PatientFactory = require("../builds/PatientFactory.json");
const ProfessionalFactory = require("../builds/ProfessionalFactory.json");

const WalletProvider = require("truffle-hdwallet-provider");
const mnemonic = "stairs basic flag mandate split marble oven cliff anxiety trap model morning";
const infura_provider = "https://rinkeby.infura.io/v3/124660071809414c801dce8cc1941cae";
const provider = new WalletProvider(mnemonic, infura_provider);
const Web3 = require("web3");
const web3 = new Web3(provider);

const output_target = path.resolve(__dirname, "../builds/DeployedAddress.json");

const deploy = async () => {
  // Get account for deploying
  const accounts = await web3.eth.getAccounts();


  console.log("Attempting to deploy Login Database contract from account " + accounts[0]);
  const login_db = await new web3.eth.Contract(LoginDatabase.abi)
  .deploy({
      data: LoginDatabase.bytecode
  }).send({
      from: accounts[0],
      gas: '1000000'
  });
  console.log("Login Database contract deployed to " + login_db.options.address);


  console.log("Attempting to deploy Patient Factory contract from account " + accounts[0]);
  const patient_factory = await new web3.eth.Contract(PatientFactory.abi)
  .deploy({
      data: PatientFactory.bytecode
  }).send({
      from: accounts[0],
      gas: '1000000'
  });
  console.log("Patient Factory contract deployed to " + patient_factory.options.address);


  console.log("Attempting to deploy Professional Factory contract from account " + accounts[0]);
  const professional_factory = await new web3.eth.Contract(ProfessionalFactory.abi)
  .deploy({
      data: ProfessionalFactory.bytecode,
      arguments: [login_db.options.address]
  }).send({
      from: accounts[0],
      gas: '1000000'
  });
  console.log("Professional Factory contract deployed to " + professional_factory.options.address);



  // save deployed address to json file
  const deployed_addresses = {
    LoginDatabase: login_db.options.address,
    PatientFactory: patient_factory.options.address,
    ProfessionalFactory: professional_factory.options.address
  }
  fs.outputJsonSync(path.resolve(output_target), previous_deployed);

};

deploy();