import Head from 'next/head'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useContract, useProvider,useSigner,useAccount,useBalance,useConnect  } from 'wagmi'
import {MemeForestAddress,ApiUriv} from '../constant'
import { useEffect, useRef, useState, useContext } from "react";
import BigNumber from 'bignumber.js';
import MEME from '../artifacts/contracts/MemeForest.sol/MemeForest.json'
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
  const [name, setName] = useState("")
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
      setAddress(Newperson);
      checkIfAMember(props);
     
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
      await checkIfAMember(props);
    } catch (w) {
      console.log(w)
    }
  }
  const checkIfAMember = async (props) => {
    try {
        
        let data = props.members;
        const tx = await Promise.all(data.map(async i => {
            const member = i.Adddress;
            const Address = person.toLowerCase()
            if(Address == member) {
                setAMember(true)
            }
            else{
                setAMember(false)
            }
            return AMember
        }));
        console.log(tx)
    } catch (e) {
        console.log(e)
        setAMember(false)
    }
}



  
const renderButton = () => {
  if (AMember) {
    return(
      <div>
          <div style={{fontSize:"19px", fontWeight:"700"}}>
            {
              props.members.map((lists,i) => {
                
                return(
                    
                    <div key={i}  style={{fontSize:"20px", fontWeight:"700"}}>
                      {
                        
                       (lists.Adddress == Address) &&
                       
                        <div className='flex flex-col w-full items-center justify-between space-y-20'>
                          <div className='shadow-sm w-full bg-green-400'>
                            <div className='flex flex-col items-center w-full'>
                              <div className='border border-slate-400 flex flex-col md:flex-row items-center w-full'>
                                <div className="w-full basis-1/5 p-4">
                                  <div className='rounded-lg border border-red-400 h-full p-20' >
                                      01
                                  </div>
                                </div>
                                <div className="flex flex-col justify-between w-full basis-4/5 space-y-6 p-10 mr-4 ">
                                  <div className=' flex items-center justify-between   font-semibold hover:cursor-pointer '>
                                    <span className='pb-2 pr-5 text-3xl  text-white border-b border-white'>
                                    {lists.Name}
                                    </span>
                                    <div className='text-sm'>
                                    <ConnectButton />
                                    </div>
                                  </div>
                                  <div className='flex justify-between flex-col md:flex-row space-y-6 md:space-y-6 text-lg font-thin hover:cursor-pointer text-white  pt-2'>
                                    <div className='flex items-end text-lg font-medium '>
                                        {lists.Adddress}
                                    </div>
                                    <div className='flex flex-col text-lg  '>
                                      <span className='font-medium'> Date Joined</span>
                                      <span className='font-normal'> {lists.Date}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='flex flex-col items-center w-full p-10'>
                            <div className='flex flex-col md:flex-row justify-between space-y-6 md:space-x-6 md:space-y-0  hover:cursor-pointer'>
                            <div className='flex flex-col  items-center p-10  text-orange-500 hover:bg-gray-50 rounded-lg border-2 border-green-400'>
                                <span className='font-medium '> Number Of Starred Memes</span>
                                <span className='font-normal'> {lists.StarredMemes}</span>
                              </div>
                              <div className='flex flex-col  items-center p-10  text-orange-500 hover:bg-gray-50 rounded-lg border-2 border-green-400'>
                                <span className='font-medium'> Number Of Total Memes</span>
                                <span className='font-normal'> {lists.TotalMeme}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                     }
                    </div>
                ) 
              })
                       
            }
          </div>
      
      </div>
      )
  }

  if(!AMember) {
    return (
      <div className='flex items-center w-full h-full border border-slate-900 z-0'> 
      <div className=' flex flex-col md:flex-row items-center w-full h-full '>
          <div className='w-full basis-3/5 md:ml-4 mt-4 md:mt-0'>
            01
          </div>
          <div className='flex flex-column items-center w-full basis-2/5 space-y-6 p-20 mr-4 mt-10'>
              <div className='flex items-center text-3xl text-black font-bold'>
                Welcome To NFT <span className='text-green-500'> Air </span>
              </div>
              <div className='text-sm text-gray-400'>
                Register to become a Member
              </div>
              <div className='pt-2 w-full'>
                <input className='px-2 py-1 h-10 font-semibold text-sm w-full border rounded-xl ' placeholder='Enter your Name'  onChange={e => setName(e.target.value)}/>
              </div>
              <div className='flex flex-col items-center  justify-center w-full'>
                {
                  loading ?
                  
                  <button className='text-lg text-gray-50  font-semibold w-full py-2 bg-white  rounded-xl '>
                   <img src="/loader.png" alt="loading..." className='w-8 h-8 mt-2' />
                  </button>
                  :
                  
                  <button className='text-lg text-gray-50  font-semibold w-full py-2 bg-green-500 hover:bg-gray-50 hover:text-green-500 border hover:border-slate-100 rounded-xl'
                  onClick={joinMembership}>
                    Register
                  </button>
                }
                
                <span className='text-sm text-gray-400 pt-1'> ------------OR------------</span>
                <button className=' text-gray-50 text-xs pt-3 flex items-center justify-center'>
                 <ConnectButton />
                </button>
              </div>
          </div>
          </div>
      </div>
    )
  }
  
}



  return (
    <div>
      <Head>
        <title>Home</title>
        <meta name="description" content="By Oleanji" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
       {renderButton()}
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