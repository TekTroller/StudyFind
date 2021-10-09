const FirestoreClient = require("../firestore/FirestoreClient");

const Patient = require("../ethereum/builds/Patient.json");
const web3 = require("../web3");

const firestore = new FirestoreClient();

let accounts;
let account;
let patient;

beforeEach = async () => {
  accounts = await web3.eth.getAccounts();

  patient = new web3.eth.Contract(Patient.abi, patient_address);
  account = accounts[0];
};

const uploadFile = async (req, res) => {
  const { filename, filedata } = req.body;
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
  const { filename } = req.body;

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

exports.uploadFile = uploadFile;
exports.viewFile = viewFile;
exports.deleteFile = deleteFile;
