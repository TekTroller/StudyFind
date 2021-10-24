const FirestoreClient = require("../firestore/FirestoreClient");

const Patient = require("../ethereum/builds/PatientController.json");
const DeployedAddress = require("../ethereum/builds/DeployedAddress.json");
const web3 = require("../web3");

const firestore = new FirestoreClient();

let accounts;
let account;

beforeEach = async () => {
  accounts = await web3.eth.getAccounts();
  account = accounts[0];
};

const getProfile = async (req, res) => {
  const patient = new web3.eth.Contract(Patient.abi, req.query.address);

  const name = await patient.methods.name().call();
  const birthday = await patient.methods.birthday().call();
  const gender = await patient.methods.gender().call();
  const files = await patient.methods.get_filenames().call();

  const msg = {
    name: name,
    birthday: birthday,
    gender: gender,
    files: files,
  };

  res.write(JSON.stringify(msg));
  res.end();
};

const uploadFile = async (req, res) => {
  const { filename, filedata, address } = req.body;
  const patient = new web3.eth.Contract(Patient.abi, address);

  const file_token = await firestore.upload(filedata);

  try {
    await patient.methods.add_file(filename, file_token).send({
      from: account,
      gas: "5000000",
    });
  } catch (err) {
    throw new Error("File already exists");
  }
};

const viewFile = async (req, res) => {
  // Retrieve token from ethereum
  const filename = req.query.filename;
  const patient = new web3.eth.Contract(Patient.abi, req.query.address);

  let file_token = "";
  try {
    file_token = await patient.methods.view_file(filename).call();
  } catch (err) {
    throw new Error("File does not exist");
  }

  // Retrieve data from firestore
  const filedata = await firestore.view(file_token);

  const msg = {
    filedata: filedata,
  };

  res.write(JSON.stringify(msg));
  res.end();
};

const deleteFile = async (req, res) => {
  // Delete from blockchain
  const { filename, address } = req.body;
  const patient = new web3.eth.Contract(Patient.abi, address);

  try {
    await patient.methods.delete_file(filename).send({
      from: account,
      gas: "5000000",
    });
  } catch (err) {
    throw new Error("File does not exist");
  }

  // Delete from firestore
  firestore.delete(filename);
};

exports.getProfile = getProfile;
exports.uploadFile = uploadFile;
exports.viewFile = viewFile;
exports.deleteFile = deleteFile;
