import Head from 'next/head'
import Web3Modal from "web3modal";
import styles from '../styles/Home.module.css'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useContract, useProvider,useSigner,useAccount  } from 'wagmi'
import {MemeForestAddress, Token, ApiUriv} from '../constant'
import { useEffect, useState, useContext } from "react";
import MEME from '../artifacts/contracts/MemeForest.sol/MemeForest.json'
import { createClient } from 'urql'
import { useRouter } from 'next/router';
import { FaSpinner } from 'react-icons/fa';
import { Web3Storage } from 'web3.storage'


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
  

export default function Create (props) {

    const { data} = useAccount()
    const person = data?.address;
    const [AMember,setAMember] = useState(false)
    const [nameOfFile, setNameOfFile] = useState("")
    const [DescriptionOfFile, setDescriptionOfFile] = useState("")
    const [Image, setImage] = useState()
    const [viewing,setViewing] = useState()
    const[loading, setLoading] = useState(false)
    const[IsVideo, setIsVideo] = useState(false)
    const[IsImage, setIsImage] = useState(false)
    
    const[loadingpage,setLoadingPage] = useState(false)
    const[valueExtension, setValueExtension] = useState("")
    const provider = useProvider()
    const [numberOfLoading, setNumberOfLoading] = useState(3)
    const { data: signer, isError, isLoading } = useSigner()
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
    const counter = 1;
    const router = useRouter()
    useEffect(() => {
        PageLoad()
       
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
    const checkIfAMember = async (props) => {
        try {
            
            let data = props.members;
            const addresses = ['']
            console.log(data)
            const tx = await Promise.all(data.map(async i => {
                
                addresses.push(i.Adddress)
                return addresses
            }));
            const Address = person.toLowerCase()
            const isThere = addresses.includes(Address)
            console.log(isThere)
            setAMember(isThere)
            console.log(tx)
        } catch (e) {
            console.log(e)
            setAMember(false)
        }
    }

    const CreateMemes = async (memeInfo, valueExt) => {
        try {
        
         
            let time = new Date().toLocaleString();
            let downloadable = true;
            const create = await contractWithSigner.CreateMemeItems(memeInfo,person,time,valueExt,downloadable)
            setNumberOfLoading(1)
            await create.wait()
            setLoading(false)
            Feed();
           
        } catch (error) {
            console.log(error)
        }
    }



    function getAccessToken () {  
    
    return Token;
    }
    
    function makeStorageClient () {
    return new Web3Storage({ token: getAccessToken() })
    }
    const Uploading = async (valueExt) => {
        try {
            setLoading(true)
            console.log(client)
            const client = makeStorageClient()
            const file = new File([Image], 'image', { type: 'img/png' })
            const cid = await client.put([file])
            console.log("Stage One")
            const data = JSON.stringify ({
                nameOfFile, 
                DescriptionOfFile, 
                image:cid
            })
            setNumberOfLoading(2)
            const blob = new Blob([data], { type: 'application/json' })
            const files = [
               
                new File([blob], 'MemeInfo')
              ]
            const MemeInfo = await client.put(files)
            console.log(":faiulegaiozkfiajetgjea9uuggopek90g90kierjf")
            CreateMemes(MemeInfo,valueExt);
            
        } catch (e) {
            console.log(e)
        }
    }
    const gohome = () => {
        router.push('/')
    }
    const Fund = () => {
        router.push('/funds')
    }
    const Feed = () => {
        router.push('/Feed')
    }

    
    function OnFileChange(e) {
        try {
            const file = e.target.files[0]
       
        const fie = e.target.files[0].name
       
        if(fie){
            const extension = fie.slice((Math.max(0, fie.lastIndexOf(".")) || Infinity) + 1);
           
            if (extension==="mp4" || extension==="mkv" || extension ==="avi" || extension ==="m4a"){
                setIsVideo(true);
                setIsImage(false);
                setValueExtension("img/mp4")
            }
            else{
                setIsVideo(false);
                setIsImage(true);
                setValueExtension("img/png")
            }
        }
        
        if(file){
            const image = URL.createObjectURL(file)
            setViewing(image)
            let reader = new FileReader()
            reader.onload = function () {
                if(reader.result){
                    setImage(Buffer.from(reader.result))
                }
            }
            reader.readAsArrayBuffer(file)
        }
        
        } catch (error) {
           console.log(error )
        }
        
    }
    const renderButton = () =>{
        if(!AMember){
            return (
                <div>
                    {
                    loadingpage ? 
                    ( 
                        <div className='flex flex-row items-center justify-center text-8xl '>
                           <img src="/loading.png" alt="loading..." />
                        </div>
                    ) 
                    : 
                    (
                        <div className='flex flex-col items-center justify-center '> 
                            <div className='text-center font-bold text-lg '>
                                Go Back Home and Register before Uploading Memes 
                            </div>
                            <button onClick={gohome} className='no-underline bg-green-500 py-2 px-3 rounded-lg font-bold text-teal-50 hover:bg-orange-500 cursor-pointer ' > 
                                Home
                            </button>
                        </div>
                    )
                    }
                </div>  
            )
        }
        if(AMember){
           
                return( 
                    <>
                {
                    loadingpage ? 
                    ( 
                        <div className='flex flex-row items-center justify-center' >
                            <div className='text-center text-8xl'>
                                <img src="/loading.png" alt="loading..." />
                            </div>
                        </div>
                    ) 
                    : 
                    (
                    <div className='flex flex-col'> 
                        
                            <h3 className='text-center font-bold text-lg self-center'>
                                YOUR STARRED MEMES
                            </h3>

                        <div className={styles.createBox}>
                        <div style={{padding:"10px", margin:"15px",  display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                            <div style={{textAlign:"left"}}>
                              Name: 
                            </div>
                           
                            <input type='text' 
                             placeholder='Name Of Meme'
                             onChange={e => setNameOfFile(e.target.value)}
                             style={{padding:"10px", border:"1px solid black" , marginLeft:"20px",borderRadius:"10px",width:"400px", fontSize:"10px"}}
                           />
                        </div>
                        <div style={{padding:"10px", margin:"15px", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                            <div style={{textAlign:"left"}}>
                            File: 
                            </div>
                            <input type='file' 
                             onChange={OnFileChange}
                             style={{padding:"10px", border:"1px solid black" , marginLeft:"20px",borderRadius:"10px",width:"400px", fontSize:"10px"}}
                           />
                        </div>
                        <div style={{padding:"10px", margin:"15px", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                            <div style={{textAlign:"left"}}>
                                 Description: 
                            </div>
                            <input type='Describe your meme' 
                             placeholder='Name Of Meme'
                             onChange={e => setDescriptionOfFile(e.target.value)}
                             style={{padding:"10px", border:"1px solid black" , marginLeft:"20px",borderRadius:"10px",width:"400px", fontSize:"10px"}}
                           />
                        </div>
                        {
                            viewing && 
                            <div> 
                                {
                                    IsImage?
                                     (
                                        <img src={viewing} alt='Your Image' style={{width:"400px", margin:"15px"}}/>
                                    )
                                    :
                                    (
                                        // <video src={viewing} width="500px" height="500px"   controls="controls"/> 
                                        <video src={viewing} width="500px" height="500px" /> 
          
                                    )
                                }
                           
                            </div> 
                        }
                        
                        {
                            loading ? 
                            (
                                <button   style={{border:"none", textAlign:"center", 
                                padding:"10px 20px",color:"white",  fontSize:"18px", 
                                backgroundColor:"greenyellow",marginTop:"20px",marginLeft:"20px", borderRadius:"10px"}}>
                                   
                                    <FaSpinner icon="spinner" className={styles.spinner} />
                                    <span style={{padding:"1px 6px", fontSize:"14px"}}>
                                    {numberOfLoading}
                                    </span>
                                   
                                </button>
                               
                            ) : 
                            (
                                <button onClick={() => Uploading(valueExtension)}  style={{border:"none", textAlign:"center", 
                                padding:"10px 20px",color:"white",  fontSize:"18px", 
                                backgroundColor:"greenyellow",marginTop:"20px",marginLeft:"20px", borderRadius:"10px"}}>
                                 Create Meme
                                
                                </button>
                            )
                        }
                        
                    </div>
                    </div>
                    )
                } 
                </>
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
           
            <div className='flex flex-col space-y-6'>
                <div className='flex flex-col items-end pt-3 px-2'>
                    <ConnectButton />
                </div>
                <div className=''> 
                    {renderButton()}
                </div>
            </div>
        </div>
      )
}



  async function MemInfo() {
    const info = await client.query(MemberQuery).toPromise()
    return (info.data.memebers)
  }
  export async function getServerSideProps() {
    const info = await MemInfo()
    return{
      props:{
        members:info
      }
    }
  }