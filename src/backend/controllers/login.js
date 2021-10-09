const web3 = require("../web3");

const LoginDatabase = require("../ethereum/builds/LoginDatabase.json");
const DeployedAddress = require("../ethereum/builds/DeployedAddress.json");

const signIn = async (req, res) => {
  const login_database = new web3.eth.Contract(
    LoginDatabase.abi,
    DeployedAddress.LoginDatabase
  );

  const email = req.query.email;
  const password = req.query.password;
  const usertype = req.query.usertype;

  let verified;
  try {
    verified = await login_database.methods
      .verify(email, password, usertype)
      .call();
  } catch (err) {
    verified = false;
  }

  const msg = verified
    ? {
        verified: true,
      }
    : {
        verified: false,
      };

  res.write(JSON.stringify(msg));
  res.end();
};

exports.signIn = signIn;
