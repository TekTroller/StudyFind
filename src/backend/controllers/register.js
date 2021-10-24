const nodemailer = require("nodemailer");
const sha256 = require("js-sha256").sha256;
const web3 = require("../web3");

const PatientFactory = require("../ethereum/builds/PatientFactory.json");
const ProfessionalFactory = require("../ethereum/builds/ProfessionalFactory.json");
const LoginDatabase = require("../ethereum/builds/LoginDatabase.json");
const DeployedAddress = require("../ethereum/builds/DeployedAddress.json");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "studyfindtesting@gmail.com",
    pass: "main(args[])",
  },
});

// Scheduled time out function to delete email
const expire_time = 300000;
let codes = new Map();

const remove = (email) => {
  const addedTime = codes.get(email).time;
  const currentTime = new Date().getTime();

  if (currentTime - addedTime >= expire_time) {
    codes.delete(email);
  }
};

const test = async (req, res) => {
  res.send(" Up and running");
};

const getCode = async (req, res) => {
  const email = req.query.email;
  const code = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);

  mailOptions = {
    from: "studyfindtesting@gmail.com",
    to: email,
    subject: "StudyFind Medical Database Account Registration",
    text: "Your verification code is: " + String(code),
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
    }
  });

  const email_code_entry = {
    code: code,
    time: new Date().getTime(),
  };
  codes.set(email, email_code_entry);

  // Schedule callback to delete this entry after 5 minutes
  setTimeout(remove, expire_time + 1000, email);

  // response values for debug
  //if (debug_mode) res.write(JSON.stringify(email_code_entry));
  res.end();
};

const verify = async (req, res) => {
  const email = req.query.email;
  const code = req.query.code;

  if (!codes.has(email)) {
    const error_msg = {
      verified: false,
      reason: "email not recognized",
      message: "Code may have expired, please resend code and try again.",
    };
    res.write(JSON.stringify(error_msg));
    res.end();
  } else {
    const expected_code = codes.get(email).code;
    const msg =
      expected_code == code
        ? {
            verified: true,
          }
        : {
            verified: false,
            reason: "wrong code",
            message: "wrong code",
          };

    res.write(JSON.stringify(msg));
    res.end();
  }
};

const register = async (req, res) => {
  const {
    email,
    password,
    usertype,
    name,
    birthday,
    gender,
    institution,
  } = req.body;
  let db_addr = "0x0000000000000000000000000000000000000000",
    controller_addr = "0x0000000000000000000000000000000000000000";
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];
  let flag = true;

  if (!usertype) {
    // Patient register
    const patient_factory = new web3.eth.Contract(
      PatientFactory.abi,
      DeployedAddress.PatientFactory
    );
    try {
      // deploy new patient contracts
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

      db_addr = patient_db_addr;
      controller_addr = patient_controller_addr;
    } catch (err) {
      flag = false;
    }
  } else {
    // Professional registration
    const professional_factory = new web3.eth.Contract(
      ProfessionalFactory.abi,
      DeployedAddress.ProfessionalFactory
    );

    // deploy new professional contract
    try {
      await professional_factory.methods
        .create_professional(name, birthday, gender, email, institution)
        .send({
          from: account,
          gas: "5000000",
        });

      const professional_controller_addr = await professional_factory.methods
        .get_created_professional(email)
        .call();
      controller_addr = professional_controller_addr;
    } catch (err) {
      flag = false;
    }
  }

  const login_database = new web3.eth.Contract(
    LoginDatabase.abi,
    DeployedAddress.LoginDatabase
  );

  await login_database.methods
    .register(email, password, usertype, db_addr, controller_addr)
    .send({
      from: account,
      gas: "1000000",
    });

  const msg = {
    success: flag,
  };
  res.write(JSON.stringify(msg));
  res.end();
};

exports.test = test;
exports.getCode = getCode;
exports.verify = verify;
exports.register = register;
