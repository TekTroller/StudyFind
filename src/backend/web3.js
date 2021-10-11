const Web3 = require("web3");
const WalletProvider = require("truffle-hdwallet-provider");

const mnemonic =
  "stairs basic flag mandate split marble oven cliff anxiety trap model morning";
//"glow shoot humble rely snack canoe museum swarm repeat broken unhappy spatial";
const infura_provider =
  "https://rinkeby.infura.io/v3/124660071809414c801dce8cc1941cae";
//"https://rinkeby.infura.io/v3/23597dc3545746ddabefd987050d3385";
const provider = new WalletProvider(mnemonic, infura_provider);

const web3 = new Web3(provider);
module.exports = web3;
