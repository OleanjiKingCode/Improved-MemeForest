import Head from 'next/head'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useContract, useProvider,useSigner,useAccount  } from 'wagmi'
import {MemeForestAddress, Token, ApiUriv} from '../constant'
import { useEffect, useState } from "react";
import MEME from '../artifacts/contracts/MemeForest.sol/MemeForest.json'
import { createClient } from 'urql'
import { useRouter } from 'next/router';
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
    const[IsDownloadable, SetIsDownloadable] = useState(false)
    const[loadingpage,setLoadingPage] = useState(false)
    const[valueExtension, setValueExtension] = useState("")
    const [numberOfLoading, setNumberOfLoading] = useState(3)
    const { data: signer, isError, isLoading } = useSigner()
    const contractWithSigner = useContract({
        addressOrName: MemeForestAddress,
        contractInterface: MEME.abi,
        signerOrProvider: signer,
    })
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
            const tx = await Promise.all(data.map(async i => {
                
                addresses.push(i.Adddress)
                return addresses
            }));
            const Address = person.toLowerCase()
            const isThere = addresses.includes(Address)
            setAMember(isThere)
        } catch (e) {
            console.log(e)
            setAMember(false)
        }
    }

    const CreateMemes = async (memeInfo, valueExt) => {
        try {
        
         
            let time = new Date().toLocaleString();
            
            const create = await contractWithSigner.CreateMemeItems(memeInfo,person,time,valueExt,IsDownloadable)
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
            if(!nameOfFile) {
                alert("Name of Meme is not there")
            }
            if(!DescriptionOfFile) {
                alert("Description of Meme is not there")
            }
            if(!Image) {
                alert("Put in a picture of your meme")
            }
            if(nameOfFile && DescriptionOfFile ) {
                setLoading(true)
                const client = makeStorageClient()
                const file = new File([Image], 'image', { type: 'img/png' })
                const cid = await client.put([file])
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
                CreateMemes(MemeInfo,valueExt);
            }
            
            
        } catch (e) {
            console.log(e)
        }
    }
    const gohome = () => {
        router.push('/')
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
    const checkbox = () => {
        let value = IsDownloadable;
        SetIsDownloadable (!value)
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
                            <img src='/sad.png' className='w-1/6'/>  
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
                    <div className='flex flex-col items-center justify-center  w-full'> 
                        
                            <h3 className='text-center font-bold text-lg self-center'>
                               CREATE YOUR NFT ART AND SHOW THE WORLD
                            </h3>

                        <div className='flex flex-col md:flex-row items-center justify-center py-2 w-4/5 space-y-8 md:space-x-8'>
                            <div className=' w-full self-start top-0 py-2'>
                                <div className='flex flex-col space-y-4 items-center justify-start p-3 '>
                                    <div className=' self-start font-semibold' >
                                    Name: 
                                    </div>
                                
                                    <input type='text' 
                                    placeholder='Name Of Meme'
                                    onChange={e => setNameOfFile(e.target.value)}
                                    className='p-1 border-2 border-slate-500 mx-4 rounded-lg w-3/4 self-start text-sm '
                                    />
                                </div>
                                
                                <div className='flex flex-col space-y-4 items-center justify-start p-3 '>
                                    <div className=' self-start font-semibold'>
                                        Description: 
                                    </div>
                                    <input type='text' 
                                    placeholder='Describe your meme'
                                    onChange={e => setDescriptionOfFile(e.target.value)}
                                    className='p-1 border-2 border-slate-500 mx-4 rounded-lg w-3/4  self-start text-sm '
                                />
                                </div>
                            </div>
                            <div className='py-2 w-full flex flex-col items-center justify-center'>
                                {
                                    viewing?  
                                    <div className=' border-2 border-slate-400 '> 
                                        {
                                            IsImage?
                                            (
                                                <img src={viewing} alt='Your Image' className='w-32 m-4'/>
                                            )
                                            :
                                            (
                                              
                                                <video src={viewing} width="500px" height="500px" /> 
                
                                            )
                                        }
                                
                                    </div>
                                    :
                                    <div className='w-full h-auto border-2 border-slate-400 flex items-center justify-center '> 
                                        <img src='/empty.png' alt='No image Here'  className='w-48 m-4'/>
                                    </div>
                                }
                                <div className='flex flex-row space-x-3 items-center justify-start p-3 w-full'>
                                    <div className='font-semibold'>
                                        IsDownloadable ?
                                    </div>
                                    <input
                                    type='checkbox'
                                     onChange={() => checkbox() }
                                     />
                                     
                                </div>
                                <div className='flex flex-row space-x-3 items-center justify-start p-3 w-full '>
                                    <div className='font-semibold' >
                                    File: 
                                    </div>
                                    <input type='file' 
                                    onChange={OnFileChange}
                                    className='p-1 border-2 border-slate-500 mx-4 rounded-lg w-full text-sm '
                                    />
                                </div>
                                {
                                    loading ? 
                                    (

                                        <button className=' flex items-center justify-center text-center w-full border border-slate-600 border-hidden px-2 py-2 font-semibold text-gray-50 text-lg mt-4 mx-4 bg-green-500  rounded-lg space-x-3 '>
                                        <img src="/loader.png" alt="loading..." className='w-8 h-8 ' />
                                            <span >
                                            {numberOfLoading}
                                            </span>
                                        </button>
                                    
                                    ) : 
                                    (
                                        <button onClick={() => Uploading(valueExtension)}  
                                        className='text-center w-full border border-slate-600 border-hidden px-2 py-2 font-semibold text-gray-50 text-sm mt-4 mx-4 bg-green-500 hover:text-green-500 hover:bg-white hover:border hover:border-slate-500 rounded-lg'
                                        >
                                        Create Meme
                                        
                                        </button>
                                    )
                                }
                                
                            </div>
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