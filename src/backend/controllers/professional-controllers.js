const Professional = require("../ethereum/builds/ProfessionalController.json");
const web3 = require("../web3");

const FirestoreClient = require("../firestore/FirestoreClient");
const firestore = new FirestoreClient();

let account;
web3.eth.getAccounts().then(accounts => {account = accounts[0]});

const getProfile = async (req, res) => {
    const professional = new web3.eth.Contract(Professional.abi, req.query.address);
  
    const name = await professional.methods.get_name().call();
    const birthday = await professional.methods.get_birthday().call();
    const gender = await professional.methods.get_gender().call();
    const institution = await professional.methods.get_institution().call();
    const patient_emails = await professional.methods.get_patients();
    const patients = [];

    patient_emails.forEach(async (p_email) => {
        const p_info = await professional.methods.get_patient_info(p_email).call();
        patients.push(p_info);
    });

    const msg = {
      name: name,
      birthday: birthday,
      gender: gender,
      institution: institution,
      patients: patients
    };
  
    res.write(JSON.stringify(msg));
    res.end();
  };

const viewPatientFile = async (req, res) => {
    const { patient_email, filename, address } = req.body;
    const professional = new web3.eth.Contract(Professional.abi, address);
    
    const token = await professional.methods.view_patient_file(patient_email, filename).call();

    const filedata = await firestore.view(token);

    const msg = {
        filedata: filedata,
    };

    res.write(JSON.stringify(msg));
    res.end();
}

const requestAccess = async (req, res) => {
    const { patient_email, address } = req.body;
    const professional = new web3.eth.Contract(Professional.abi, address);

    await professional.methods.request_access(patient_email).send({
        from: account,
        gas: '1000000'
    });
}

const getPendingRequests = async (req, res) => {
    const { address } = req.body;
    const professional = new web3.eth.Contract(Professional.abi, address);

    const pending_requests = professional.methods.get_pending_requests().call();
    res.write(JSON.stringify({
        requests: pending_requests
    }));
    res.end();
}

exports.getProfile = getProfile;
exports.viewPatientFile = viewPatientFile;
exports.requestAccess = requestAccess;
exports.getPendingRequests = getPendingRequests;