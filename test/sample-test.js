const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Greeter", function () {
  it("Should create two members,ceate two nft,like one,star one,fetch all, fetch starred and fetch mine " , async function () {
    const Meme = await ethers.getContractFactory("MemeForest");
    const meme = await Meme.deploy();
    await meme.deployed();
    
    let today = new Date().toISOString().slice(0, 10);
    console.log(today)
    const [_, buyerAddress,thirdone] = await ethers.getSigners()
    const createMember = await meme.connect(buyerAddress).CreateMembers("first kid", today);
    const createMember2 = await meme.connect(thirdone).CreateMembers("second kid", today);
    const fetchMembers= await meme.connect(buyerAddress).fetchMembers();
    console.log(fetchMembers);
    const addr =  await buyerAddress.getAddress()
    const addr2 =  await thirdone.getAddress()
    const fectme = await meme.GetMemberByAddr(addr);
    console.log(fectme);
    let another = new Date().toISOString().slice(0, 10);
    await meme.connect(buyerAddress).CreateMemeItems("MemeLinkInfo1",addr,another,"jpeg",true);
    await meme.connect(thirdone).CreateMemeItems("MemeLinkInfo2",addr2,another,"mp4",false);

    const Allmeme = await meme.fetchAllMemes()
    console.log(Allmeme)

    console.log("liking meme")
    await meme.connect(thirdone).LikeMeme("1");

    console.log("staring meme")
    await meme.connect(buyerAddress).StarMeme("2");


    console.log("fetching starred memes right now...............")
    const FetchStarredMemes = await meme.connect(buyerAddress).fetchMyStarredMemes(addr);

    console.log(FetchStarredMemes)
    console.log("fetching starred memes right now...............")

    console.log("fetching my meme")
    const first = await meme.connect(buyerAddress).fetchMyMeme(addr)
    console.log(first)
    console.log("fetching my second meme")
    const second = await meme.connect(thirdone).fetchMyMeme(addr2)
    console.log(second)

  });
 

  

});
