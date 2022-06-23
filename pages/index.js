import Head from 'next/head'
import Image from 'next/image'
import Web3Modal from "web3modal";
import styles from '../styles/Home.module.css'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useContract, useProvider,useSigner,useAccount,useBalance,useConnect  } from 'wagmi'
import {MemeForestAddress} from '../constant'
import { useEffect, useRef, useState, useContext } from "react";
import { MainContext } from '../context';
import BigNumber from 'bignumber.js';
import MEME from '../artifacts/contracts/MemeForest.sol/MemeForest.json'
import { FaSpinner } from 'react-icons/fa';
import { HiMenu } from "react-icons/hi";

export default function Home() {
  const {
    initialize,
    fetchBalance,
    balance,
    bundlrInstance
  } = useContext(MainContext)
  const { data} = useAccount()
  const person = data?.address;

  const [name, setName] = useState("")
  const [fund, setFund] = useState(0)
  const [loading,setLoading] = useState(false)
  const [haveInitialised,setHaveInitialised] = useState(false)
  const [AMember,setAMember] = useState(false)
  const [clicked,setclicked] = useState(false)
  const [toggle,setToggle] = useState(false)
  const[memberDetails,setMemberDetails] = useState([])
  const[loadingpage,setLoadingPage] = useState(false)
  const provider = useProvider()
  const { data: signer } = useSigner()
  const contractWithSigner = useContract({
      addressOrName: MemeForestAddress,
      contractInterface: MEME.abi,
      signerOrProvider: signer,
    })

    const contractWithProvider = useContract({
      addressOrName: MemeForestAddress,
      contractInterface: MEME.abi,
      signerOrProvider: provider,
    })
     
  useEffect(() => {
    
        PageLoad();
        if(!AMember){
           checkIfAMember();
        
         setInterval( async () => {
             await fetchByAddress()
         }, 5*1000);
        }
    }, [AMember]);

    const PageLoad = async () =>{
      try {
          setLoadingPage(true)
          const delay = ms => new Promise(res => setTimeout(res, ms));
          await delay(7000);
          setLoadingPage(false)
      } catch (e) {
          console.log(e)
      }
  }
  const joinMembership = async () => {
    try {
      setLoading(true)
      let _time =  new Date().toLocaleString();
      const join = await contractWithSigner.CreateMembers(name,_time)
      await join.wait()
      setLoading(false)
      setAMember(true)
      await checkIfAMember();
    } catch (w) {
      console.log(w)
    }
  }

  const Initialize = async () => {
    try {
      setLoading(true)
      initialize();
      
      setHaveInitialised(true)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }

  
  }

  const  fundWallet = async () =>{
    try {
      setLoading(true)
      if (!fund  ) return
      const fundedamount = new BigNumber(fund).multipliedBy(bundlrInstance.currencyConfig.base[1])
      if(fundedamount.isLessThan(1)){
        window.alert("NOT ENOUGH")
        return
      }
      
     
      const funded = await bundlrInstance.fund(fundedamount)
      setLoading(false)
      fetchBalance()
      
    } catch (error) {
      console.log(error)
    }
   }

   const fetchByAddress = async () => {
    try {
      const data= await contractWithProvider.fetchMembers();
    
      const tx = await Promise.all(data.map(async i =>{
         let list = {
          Name : i.Name,
          Address : i.MemeberAddress,
          Date: i.Datejoined,
          Memes : i.MyMemes.toNumber(),
          Starred :i.MyStarredMemes.toNumber()
         
        }
        return list
       }));
       setMemberDetails(tx)
     } catch (w) {
       console.log(w)
     }
   }

  const checkIfAMember = async () => {
    try {
     
      const tx= await contractWithProvider.IsAMember(person)
     
    
      if(tx) {
     
        setAMember(true)
      }
      else{
        setAMember(false)
      }
      
    } catch (e) {
      console.log(e)
      setAMember(false)
    }
  }

  
const renderButton = () => {

  if (AMember && !haveInitialised) {
    
    return(
     <div style={{textAlign:"center",height:"80vh",top:"50%", left:"50%", display:"flex", alignItems:"center",justifyContent:"center" ,flexDirection:"column"}}>
       <h3 className={styles.title}>
          Welcome to Meme Forest
        </h3>
        <br/>
      <button onClick={Initialize}  style={{border:"none", textAlign:"center", 
            padding:"10px 20px",color:"white",  fontSize:"10px", 
            backgroundColor:"blue",marginTop:"20px",marginLeft:"20px", borderRadius:"10px"}}>
              Initialize
          </button>
             
        </div>
    )
  }
  if( AMember &&  balance <= 0.01) {
    
    return (
      <div style={{textAlign:"center",height:"80vh",top:"50%", left:"50%", display:"flex", alignItems:"center",justifyContent:"center" ,flexDirection:"column"}}>
          You are a Now a member. <br/>
          But funding is too small to work with.<br/>
        <input
          placeholder='Fund your wallet'
          type="number"
          onChange={e => setFund(e.target.value)}
          style={{padding:"10px", border:"1px solid black" , marginLeft:"20px",borderRadius:"10px",width:"400px", fontSize:"10px"}}
        />
        <button onClick={fundWallet}  style={{border:"none", textAlign:"center", 
          padding:"10px 20px",color:"white",  fontSize:"10px", 
          backgroundColor:"blue",marginTop:"20px",marginLeft:"20px", borderRadius:"10px"}}>
            Fund Wallet
        </button>
      </div>
    )
  
  }
  if(haveInitialised && balance > 0) {
    return(
      <div style={{fontSize:"19px", fontWeight:"700"}}>
        You are a member with Funding balance of {balance}
        <br/> <br/>
        {
          memberDetails.map((lists,i) => {
            
            return(
                
                <div key={i}  style={{fontSize:"20px", fontWeight:"700"}}>
                  {
                    lists.Address == person &&
                    <div>
                    <div style={{ padding:"30px 10px", display:"flex", alignItems:"center"}} > 
                    Name: 
                   <span style={{fontSize:"18px" ,fontWeight:"400", marginTop:"5px " ,marginLeft:"20px"}}>
                    {lists.Name}
                    </span>
                   
                   </div>
                   <div style={{ padding:"30px 10px"}}> 
                    Address: 
                    <span style={{fontSize:"18px" ,fontWeight:"400", marginTop:"5px " ,marginLeft:"20px"}}>
                    {lists.Address}
                    </span>
                   </div>
                   <div style={{ padding:"30px 10px"}}> 
                     Number of Uploads: 
                     <span style={{fontSize:"18px" ,fontWeight:"400", marginTop:"5px " ,marginLeft:"20px"}}>
                     {lists.Memes}
                     </span>
                   </div>
                   <div style={{ padding:"30px 10px"}}>
                     Number Of Starred Memes:
                     <span style={{fontSize:"18px" ,fontWeight:"400", marginTop:"5px " ,marginLeft:"20px"}}>
                      {lists.Starred} </span>
                    </div>
                   <div style={{ padding:"30px 10px"}}> 
                    Date Joined: 
                    <span style={{fontSize:"18px" ,fontWeight:"400", marginTop:"5px " ,marginLeft:"20px"}}>
                    {lists.Date} </span>
                   </div>
                    </div>
                  }
                  
                </div>
            ) 
          })
                   
        }
      </div>
    )
  }

  if(!AMember){
    return (

      <div>
          {
          loadingpage ? 
          ( 
              <div style={{fontSize:"100px", textAlign:"center"}}>
                  <FaSpinner icon="spinner" className={styles.spinner} />
              </div>
          ) 
          : 
          (
            <div style={{textAlign:"center",height:"80vh",top:"50%", left:"50%", display:"flex", alignItems:"center",justifyContent:"center" ,flexDirection:"column"}}>
              <h2 style={{}}>
                Welcome To MemeForest
              </h2>
              <input
                placeholder='Enter Any Name'
                type="text"
                onChange={e => setName(e.target.value)}
                style={{padding:"10px", border:"1px solid black" , borderRadius:"10px",width:"400px", fontSize:"10px"}}
              />
              
              {
                loading? 
                  (
                    <button   style={{border:"none", textAlign:"center", 
                        padding:"10px 20px",color:"white",  fontSize:"10px", 
                        backgroundColor:"blue",marginTop:"20px", marginLeft:"20px", borderRadius:"10px"}}>
                        <FaSpinner icon="spinner" className={styles.spinner} />
                    </button>
                  ) 
                  :
                  (
                    <button onClick={joinMembership}  style={{border:"none", textAlign:"center", 
                      padding:"10px 20px",color:"white",  fontSize:"10px", 
                      backgroundColor:"blue",marginTop:"20px", marginLeft:"20px", borderRadius:"10px"}}>
                        Become A Member
                    </button>    
                  )
              }       
          </div>
          )
        }
      </div>
    )
  }
}








  return (
    <div className={styles.container}>
      <Head>
        <title>Home</title>
        <meta name="description" content="By Oleanji" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <div className={styles.topper}>
     
      <img src='./LogoForest.png' className={styles.logos}/>
      <div className={styles.connect}>
        <ConnectButton />
      </div>
    </div>
      <div  className={styles.main}> 
        
          {renderButton()}
        

      </div>

      
    </div>
  )
}
