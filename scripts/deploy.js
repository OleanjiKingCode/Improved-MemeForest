const hre = require("hardhat");
const filesys = require("fs");

async function main() {

 
  const Meme = await ethers.getContractFactory("MemeForest");
  const meme = await Meme.deploy();
  await meme.deployed();
  console.log("MemeForest deployed to:", meme.address);

  
  filesys.writeFileSync('./constant.js' , `
  export const MemeForestAddress ="${meme.address}"
  
  
  `)
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
