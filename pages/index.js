import Head from 'next/head'
import Image from 'next/image'
import Web3Modal from "web3modal";
import styles from '../styles/Home.module.css'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useContract, useProvider,useSigner,useAccount,useBalance,useConnect  } from 'wagmi'
import {MemeForestAddress,ApiUriv} from '../constant'
import { useEffect, useRef, useState, useContext } from "react";
import BigNumber from 'bignumber.js';
import MEME from '../artifacts/contracts/MemeForest.sol/MemeForest.json'
import { FaSpinner } from 'react-icons/fa';
import { createClient } from 'urql'

const MemberQuery= `
query {
  memebers{
    Name
    Adddress
    TotalMeme
    StarredMemes
    Date
  }
}
`

const client = createClient({
  url: ApiUriv,
})



export default function Home(props) {
  const array = props.members
  const { data} = useAccount()
  const person = data?.address;
  const [Address, setAddress] = useState("")
  const [loading,setLoading] = useState(false)
  const [AMember,setAMember] = useState(false)
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
      const Newperson = person?.toLocaleLowerCase()
      setAddress(Newperson)
     
  }, []);

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



  
const renderButton = () => {
  return(
  <div>
      <div style={{fontSize:"19px", fontWeight:"700"}}>
        {
          props.members.map((lists,i) => {
            
            return(
                
                <div key={i}  style={{fontSize:"20px", fontWeight:"700"}}>
                  {
                    
                   ( lists.Adddress == Address )?
                   (
                    <div style={{fontSize:"19px", fontWeight:"700"}}>
                    You are a member 
                    <br/> <br/>
                   
                            
                            <div key={i}  style={{fontSize:"20px", fontWeight:"700"}}>
                              
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
                                {lists.Adddress}
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
                             
                              
                            </div>
                  </div>
                   )
                   :
                   (
                    <div className='flex items-center w-full h-screen'> 
                    <div className='flex items items-center w-full  space-x-20 h-full '>
                        <div className=' flex w-1/2  ml-4'>
                        </div>
                        <div className='flex flex-column items-center w-2/5 space-y-6 p-20 mx-10 mt-10'>
                            <div className='flex items-center text-3xl text-black font-bold'>
                              Welcome To NFT <span className='text-green-500'> Air </span>
                            </div>
                            <div className='text-sm text-gray-400'>
                              Register to become a Member
                            </div>
                            <div className='pt-2 w-full'>
                              <input className='px-2 py-1 h-10 font-semibold text-sm w-full border rounded-xl ' placeholder='Enter your Name'/>
                            </div>
                            <div className='flex items-center w-full'>
                              <button className='text-lg text-gray-50  font-semibold w-full py-2 bg-green-500 hover:bg-gray-50 hover:text-green-500 border hover:border-slate-100 rounded-xl'
                              onClick={joinMembership}>
                                Register
                              </button>
                            </div>
                        </div>
                        </div>
                    </div>
                   )
                    
                   
                  }
                  
                </div>
            ) 
          })
                   
        }
      </div>
  
  </div>
  )
}



  return (
    <div>
      <Head>
        <title>Home</title>
        <meta name="description" content="By Oleanji" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <div  className={styles.main}>  */}
        
       {renderButton()}
        

      {/* </div> */}

      
    </div>
  )
}


async function GetData() {
  const data = await client.query(MemberQuery).toPromise()
  console.log(data)
  return data.data.memebers
}


export async function getServerSideProps() {
  const data = await GetData()
  return{
    props:{
      members:data
    }
  }
}