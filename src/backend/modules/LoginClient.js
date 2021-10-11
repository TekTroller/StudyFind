const WalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");

const LoginDatabase = require("../ethereum/builds/LoginDatabase.json");
const DeployedAddress = require("../ethereum/builds/DeployedAddress.json");

class LoginClient {
  constructor() {
    const mnemonic =
      "stairs basic flag mandate split marble oven cliff anxiety trap model morning";
    const infura_provider =
      "https://rinkeby.infura.io/v3/124660071809414c801dce8cc1941cae";
    const provider = new WalletProvider(mnemonic, infura_provider);
    const web3 = new Web3(provider);
    this.login_database = new web3.eth.Contract(
      LoginDatabase.abi,
      DeployedAddress.login_database
    );
  }

  async _init() {
    const accounts = await web3.eth.getAccounts();
    this.account = accounts[0];
  }

  async verify_password(email, password, usertype) {
    let verified;
    try {
      verified = await this.login_database.methods
        .verify(email, password, usertype)
        .call();
    } catch (err) {
      return false;
    }
    return verified;
  }

  async change_password(email, password) {
    try {
      await this.login_database.methods.update_password(email, password).send({
        from: this.account,
        gas: "1000000",
      });
    } catch (err) {
      throw new Error("Account not found");
    }
  }
}

module.exports = LoginClient;
