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
  const usertype = req.query.usertype === "true";

  let msg = {
    address: "0x0000000000000000000000000000000000000000",
    verified: false,
  };

  try {
    const addr = await login_database.methods
      .verify(email, password, usertype)
      .call();

    if (addr !== "0x0000000000000000000000000000000000000000") {
      msg = {
        address: addr,
        verified: true,
      };
    }
    res.write(JSON.stringify(msg));
    res.end();
  } catch (err) {
    msg = { verify: false };
    res.write(JSON.stringify(msg));
    res.end();
  }
};

exports.signIn = signIn;
