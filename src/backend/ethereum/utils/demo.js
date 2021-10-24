const WalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");

const LoginDatabase = require("../builds/LoginDatabase.json");
const PatientFactory = require("../builds/PatientFactory.json");
const ProfessionalFactory = require("../builds/ProfessionalFactory.json");
const DeployedAddress = require("../builds/DeployedAddress.json");

const mnemonic =
  "stairs basic flag mandate split marble oven cliff anxiety trap model morning";
const infura_provider =
  "https://rinkeby.infura.io/v3/124660071809414c801dce8cc1941cae";
const provider = new WalletProvider(mnemonic, infura_provider);

const web3 = new Web3(provider);

const patient_factory = new web3.eth.Contract(
  PatientFactory.abi,
  DeployedAddress.PatientFactory
);
const professional_factory = new web3.eth.Contract(
  ProfessionalFactory.abi,
  DeployedAddress.ProfessionalFactory
);

// define variables used for creating account
const name = "Test name";
const birthday = "YYYY-MM-DD";
const gender = "M";
const email = "test@test.com";
const institution = "Test institution";

const demo = async () => {
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];

  // Patient creation
  console.log("Creating patient...");
  await patient_factory.methods
    .create_patient(name, birthday, gender, email)
    .send({
      from: account,
      gas: "5000000",
    });
  const {
    0: patient_db_addr,
    1: patient_controller_addr,
  } = await patient_factory.methods.get_created_patient(email).call();
  console.log(
    "New patient contracts deployed:\nDatabase:\t" +
      patient_db_addr +
      "\nController:\t" +
      patient_controller_addr
  );

  // Professional creation
  console.log("\n\nCreating patient...");
  await professional_factory.methods
    .create_professional(name, birthday, gender, email, institution)
    .send({
      from: account,
      gas: "5000000",
    });

  const professional_controller_addr = await professional_factory.methods
    .get_created_professional(email)
    .call();
  console.log(
    "New professional contracts deployed:\nController\t" +
      professional_controller_addr
  );
};

demo();
