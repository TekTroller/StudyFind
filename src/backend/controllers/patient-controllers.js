const FirestoreClient = require("../firestore/FirestoreClient");
const firestore = new FirestoreClient();

const Patient = require("../ethereum/builds/PatientController.json");
const web3 = require("../web3");

let account;
web3.eth.getAccounts().then((accounts) => {
  account = accounts[0];
});

const getProfile = async (req, res) => {
  const patient = new web3.eth.Contract(Patient.abi, req.query.address);
  console.log(patient.methods);

  try {
    const name = await patient.methods.get_name().call();
    const birthday = await patient.methods.get_birthday().call();
    const gender = await patient.methods.get_gender().call();
    const files = await patient.methods.get_filenames().call();

    const msg = {
      name: name,
      birthday: birthday,
      gender: gender,
      files: files,
    };

    res.write(JSON.stringify(msg));
    res.end();
  } catch (err) {
    const msg = {
      status: "error",
    };
    res.write(JSON.stringify(msg));
    res.end();
  }
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

const changeFileName = async (req, res) => {
  const { oldFilename, newFilename, address } = req.body;
  const patient = new web3.eth.Contract(Patient.abi, address);

  try {
    await patient.methods.change_filename(oldFilename, newFilename).send({
      from: account,
      gas: "5000000",
    });
  } catch (err) {
    throw new Error("File does not exist");
  }
};

const processRequest = async (req, res) => {
  const { professional_email, approve, address } = req.body;
  const patient = new web3.eth.Contract(Patient.abi, address);

  try {
    await patient.methods.process_request(professional_email, approve).send({
      from: account,
      gas: "5000000",
    });
  } catch (err) {
    throw new Error("Something went wrong");
  }
};

const banProfessional = async (req, res) => {
  const { professional_email, address } = req.body;
  const patient = new web3.eth.Contract(Patient.abi, address);

  try {
    await patient.methods.ban_professional(professional_email, approve).send({
      from: account,
      gas: "5000000",
    });
  } catch (err) {
    throw new Error("Something went wrong");
  }
};

const getPendingRequests = async (req, res) => {
  const { address } = req.body;
  const patient = new web3.eth.Contract(Patient.abi, address);

  const pending_requests = await patient.methods.get_pending_requests().call();

  res.write(
    JSON.stringify({
      requests: pending_requests,
    })
  );
  res.end();
};

const getAuthorizedProfessionals = async (req, res) => {
  const patient = new web3.eth.Contract(Patient.abi, address);

  const authorized_professionals = await patient.methods
    .get_authorized_professionals()
    .call();

  res.write(
    JSON.stringify({
      authorized: authorized_professionals,
    })
  );
  res.end();
};

exports.getProfile = getProfile;
exports.uploadFile = uploadFile;
exports.viewFile = viewFile;
exports.deleteFile = deleteFile;
exports.changeFileName = changeFileName;
exports.processRequest = processRequest;
exports.banProfessional = banProfessional;
exports.getPendingRequests = getPendingRequests;
exports.getAuthorizedProfessionals = getAuthorizedProfessionals;
