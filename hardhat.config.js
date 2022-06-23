require("@nomiclabs/hardhat-waffle");
require("dotenv").config({ path: ".env" });

const ALCHEMY_ID = process.env.ALCHEMY_ID;
const MUMBAI_PRIVATE_KEY = process.env.MUMBAI_PRIVATE_KEY;

module.exports = {
  solidity: "0.8.7",
  
  networks: {
    hardhat:{
      chainId:1337
    },
    mumbai:{
      url:ALCHEMY_ID,
      accounts:[MUMBAI_PRIVATE_KEY],
    },
  },
 
  
};
