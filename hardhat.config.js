require("@nomiclabs/hardhat-waffle");
require("dotenv").config({ path: ".env" });

const ANKR_ID = process.env.ANKR_ID;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.7",
  networks: {
    hardhat:{
      chainId:1337
    },
    mumbai:{
      url:ANKR_ID,
      accounts:[PRIVATE_KEY],
    },
  },
 
  
};
