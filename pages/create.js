import Head from 'next/head'
import Web3Modal from "web3modal";
import styles from '../styles/Home.module.css'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useContract, useProvider,useSigner,useAccount  } from 'wagmi'
import {MemeForestAddress} from '../constant'
import { useEffect, useState, useContext } from "react";
import { MainContext } from '../context';
import MEME from '../artifacts/contracts/MemeForest.sol/MemeForest.json'
import { useRouter } from 'next/router';
import { FaSpinner } from 'react-icons/fa';



export default function Create () {

    const {
        initialize,
        fetchBalance,
        balance,
        bundlrInstance
    } = useContext(MainContext)
    const { data} = useAccount()
    const person = data?.address;
    const [AMember,setAMember] = useState(false)
    const [fileURL, setFileURL] = useState("")
    const [nameOfFile, setNameOfFile] = useState("")
    const [DescriptionOfFile, setDescriptionOfFile] = useState("")
    const [Image, setImage] = useState()
    const [viewing,setViewing] = useState()
    const[loading, setLoading] = useState(false)
    const[IsVideo, setIsVideo] = useState(false)
    const[IsImage, setIsImage] = useState(false)
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
        if(counter == 1){
            initialize()
          
            counter +=1
        }
       
    } ,[])
    useEffect(() => {


        if(!AMember){
            checkIfAMember();
            
            if (counter == 2) {
                fetchBalanceOfMember();
            }
           
        
        }
    }, [AMember]);
   

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

    const fetchBalanceOfMember = async () => {
        try {
            const delay = ms => new Promise(res => setTimeout(res, ms));
            await delay(5000);
            fetchBalance();
        } catch (error) {
            console.log(error)
        }
    }

    const CreateMemes = async (memeInfo, valueExt) => {
        try {
        
         
            let time = new Date().toLocaleString();
            
            const create = await contractWithSigner.CreateMemeItems(memeInfo,person,time, valueExt)
            setNumberOfLoading(1)
            await create.wait()
            setLoading(false)
            Feed();
           
        } catch (error) {
            console.log(error)
        }
    }

    const Uploading = async (valueExt) => {
        try {
            setLoading(true)
           

            let upload = await bundlrInstance.uploader.upload(Image, [{name: "Content-Type", value: valueExt}])
            
            setFileURL(`https://arweave.net/${upload.data.id}`)
            const file = `https://arweave.net/${upload.data.id}`

            const data = JSON.stringify ({
                nameOfFile, 
                DescriptionOfFile, 
                image:file
            })
            setNumberOfLoading(2)
            let uploadTwo = await bundlrInstance.uploader.upload(data, [{name: "Content-Type", value: "text/plain"}])
            const MemeInfo = `https://arweave.net/${uploadTwo.data.id}`
           
           
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
                <div style={{ padding:"20px", textAlign:"center",margin:"5px 0 5px 0",height:"80vh",top:"50%", left:"50%", display:"flex", alignItems:"center",justifyContent:"center" ,flexDirection:"column" }}> 
                    <div style={{fontSize:"18px"}}>
                        Go Back Home and Register before Uploading Memes 
                    </div>
                    <button onClick={gohome} style={{padding:"10px 15px", marginLeft:"10px",color:"black",marginTop:"10px",
                    backgroundColor:"greenyellow",fontSize:"14px",borderRadius:"10px"}}> 
                        Home
                    </button>
                </div>
            )
        }
        if(AMember){
            if(balance > 0.01) {
                return( 
                    <div className={styles.Memebox} style={{borderRadius:"25px", padding:"20px", textAlign:"center",margin:"20px 0 20px 0" }}> 
                        <h3>
                            UPLOAD YOUR MEME 
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
            {
                return(
                    <div style={{ padding:"20px", textAlign:"center",margin:"5px 0 5px 0" }}> 
                    <div style={{fontSize:"18px"}}>
                        Go To Fund Your Account before Uploading Memes as its lower than 0.01 
                    </div>
                    <button onClick={Fund} style={{padding:"10px 15px", marginLeft:"10px",color:"black", marginTop:"10px",
                    backgroundColor:"greenyellow",fontSize:"14px",borderRadius:"10px"}}> 
                        Fund
                    </button>
                </div>
                )
            }

        }
    }


    return (
        <div>
          <Head>
            <title>Home</title>
            <meta name="description" content="By Oleanji" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
        <div className={styles.topper}>
        <img src='./LogoForest.png'  style={{width:"283px", height:"107px", marginTop:"-20px"}}/>
          <div className={styles.connect}>
            <ConnectButton />
          </div>
        </div>
          <div className={styles.mains}>
              {renderButton()}
          </div>
    
          
        </div>
      )
}