import Head from 'next/head'
import Web3Modal from "web3modal";
import styles from '../styles/Home.module.css'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useContract, useProvider,useSigner,useAccount,useBalance,useConnect  } from 'wagmi'
import {MemeForestAddress,Token, ApiUriv} from '../constant'
import { useEffect, useRef, useState, useContext } from "react";
import MEME from '../artifacts/contracts/MemeForest.sol/MemeForest.json'
import 'bootstrap/dist/css/bootstrap.css'
import axios from "axios"
import { useRouter } from 'next/router';
import { Audio, TailSpin} from  'react-loader-spinner'

    
const MemesQuery= `
query {
    memes(
    orderBy : Date ,
    orderDirection: desc
        ) 
    {
        id
        MemeInfo
        Owner
        IsStarred
        Stars
        Likes
        Date
        FileType
        IsDownloadable
        StarredAddresses
        LikesAddresses
    }
}
`

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
    
    
export default function Starred (props) {   
    const Memeslength  = props.memes.length
    const Memberslength  = props.members.length
    const { data} = useAccount()
    const person = data?.address;
    const [starredMemes,setStarredMemes] = useState([])
    const [AMember,setAMember] = useState(false)
    const[loading, setLoading] = useState(false)
    const[memeDetails,setMemeDetails] = useState([])
    const[loadingpage,setLoadingPage] = useState(false)
    const provider = useProvider()
    const { data: signer} = useSigner()
    const contractWithSigner = useContract({
        addressOrName: MemeForestAddress,
        contractInterface: MEME.abi,
        signerOrProvider: signer,
    })

    const contractWithProvider = useContract({
        addressOrName: MemeForestAddress,
        contractInterface: MEME.abi,
        signerOrProvider: provider,
    });
    const router = useRouter()

    useEffect(() => {
        PageLoad();
        setInterval(async () => {
            
        }, 5 * 1000);
        fetchAllStarredMemes();
}, []);
    useEffect(() => {
       
        if(!AMember){
            checkIfAMember();
            
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
    function getAccessToken () {
        return Token;
    }
    function makeStorageClient () {
    return new Web3Storage({ token: getAccessToken() })
    }

    const StarredMemes = async (props) => {
        const client = makeStorageClient()
        let data = props.memes;
        const tx = await Promise.all(data.map(async i => {
            const res = await client.get(i.MemeInfo) 
            if(!res.ok) {
                return;
            }
            const LikesAddress = i.LikesAddresses;
            const StarredAddress = i.StarredAddresses;
            for (let i = 0; i < LikesAddress.length; i++) {
                const Address = person.toLowerCase()
                const CurrentAddress = LikesAddress[i]
                if(Address == CurrentAddress ){
                    SetDidILikeMeme(true)
                }
                else{
                    SetDidILikeMeme(false)
                }
                
            }
            for (let i = 0; i < StarredAddress.length; i++) {
                const Address = person.toLowerCase()
                const CurrentAddress = StarredAddress[i]
                if(Address == CurrentAddress ){
                    SetDidIStarMeme(true)
                }
                else{
                    SetDidIStarMeme(false)
                }
                
            }
            let files = await res.files()
            const info =  await axios.get(`https://${files[0].cid}.ipfs.dweb.link`)
            let List = {
                Name:info.data.nameOfFile,
                Description:info.data.DescriptionOfFile,
                image:info.data.image,
                Owner: i.Owner,
                IsStarred:i.IsStarred,
                NumberOfStars:i.Stars,
                NumberOfLikes:i.Likes,
                Date:i.Date,
                Id :i.id,
                IsDownloadable : i.IsDownloadable,
                FileType :i.FileType
            }
            return List
        })); 
        setMemeDetails(tx)
    }

    
    const StarMeme = async (id,bool) =>{
        try {
            setLoading(true)
           
            if (bool == true) {
                // unstarring
                const data= await contractWithSigner.RemoveStarMeme(id)
                await data.wait()
                await fetchAllStarredMemes();
                // setStarToggler(false)
            }
            else {
                const data= await contractWithSigner.StarMeme(id)
                await data.wait()
                await fetchAllStarredMemes();
                // setStarToggler(true)
            }
            
            setLoading(false)
        } catch (e) {
            console.log(e)
        } 
    }

    const download = (e,name) => {
        
        axios({
            url: e, //your url
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
              link.setAttribute("download", name+".png" ); 
              document.body.appendChild(link);
              link.click();
            
          });
         
      };

      const gohome = () => {
        router.push('/')
    }
    const create = () => {
        router.push('/create')
    }

      const renderButton = () => {
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
                        <div style={{ padding:"20px", textAlign:"center",margin:"5px 0 5px 0",height:"80vh",top:"50%", left:"50%", display:"flex", alignItems:"center",justifyContent:"center" ,flexDirection:"column" }}> 
                            <div style={{fontSize:"18px"}}>
                                Go Back Home and Register before Seeing Starred Memes 
                            </div>
                            <button onClick={gohome} style={{padding:"10px 15px", marginLeft:"10px",color:"black",marginTop:"10px",
                            backgroundColor:"greenyellow",fontSize:"14px",borderRadius:"10px"}}> 
                                Home
                            </button>
                        </div>
                    )
                    }
                </div>  
            )
        }
        if(AMember) {
           if(starredMemes.length == 0) 
           {
            return (
                <div>
                    {
                    loadingpage ? 
                    ( 
                        <div style={{fontSize:"100px", textAlign:"center"}}>
                             <TailSpin color="#00BFFF" height={80} width={80} />
                        </div>
                    ) 
                    : 
                    (
                        <div style={{ padding:"20px", textAlign:"center",margin:"5px 0 5px 0",height:"80vh",top:"50%", left:"50%", display:"flex", alignItems:"center",justifyContent:"center" ,flexDirection:"column"  }}> 
                            <div style={{fontSize:"18px"}}>
                                You have No Starred Memes Go back to Create Memes 
                            </div>
                            <button onClick={create} style={{padding:"10px 15px", marginLeft:"10px",color:"black",marginTop:"10px",
                            backgroundColor:"greenyellow",fontSize:"14px",borderRadius:"10px", border:"none"}}> 
                                Create Meme
                            </button>
                        </div>
                    )
                    }
                </div>
            )
           }
           if(starredMemes.length > 0){
            return(
                <div >
                <h3 style={{textAlign:"center"}}>
                    YOUR STARRED MEMES
                </h3>
              
                <div className='row d-flex' style={{flexDirection:"row"}}>
                    {
                        starredMemes.map((card,i) => {
                            return(  
                                <div key={i} className='col-md-3 p-3'>   
                                    {
                                        (!card.Name == " " && !card.Description == " " && card.NumberOfStars >= 1) &&

                                            <div className={styles.Memebox} style={{borderRadius:"25px", height:"auto",padding:"10px"}}>
                                                <div className={styles.upperimg}  style={{borderRadius:"15px",height:"150px",overflow:"hidden" ,flexDirection:"column"}}>
                                                <a href={card.File} target='_blank' rel="noreferrer" style={{padding:"0", margin:"0", textDecoration:"none", }}>  
                                                    <img src={card.File} className={styles.change} alt="..." style={{height:"150px",width:"auto",}}/>
                                                </a>
                                                <div className={styles.nameOfOwner} >
                                                        {
                                                            memberDetails.map((lists,i) => {
                                                                
                                                                return(
                                                                    
                                                                    <div key={i}  style={{fontSize:"14px",fontWeight:"500"}}>
                                                                    {
                                                                        lists.Address == card.AddressOfOwner &&
                                                                        <div>
                                                                            {lists.Name}
                                                                        </div>
                                                                    }
                                                                    </div>
                                                                )
                                                            })
                                                        
                                                        }
                                                    </div>
                                                    <div className={styles.dateOfMeme} >
                                                        {
                                                            card.Date
                                                        
                                                        }
                                                    </div>
                                               </div>
                                                <div className='py-2 px-3' style={{borderRadius:"25px",border:"1px black solid",height:"auto",marginTop:"10px"}}>
                                                    <div className='d-flex justify-content-between ' >
                                                    {
                                                                card.Name.length > 7 ?
                                                                (
                                                                    <div style={{borderRadius:"10px",width:"130px",height:"25px",marginTop:"20px", fontWeight:"900",fontSize:"12px"}}>
                                                                        {card.Name}
                                                                    </div> 
                                                                ) : 
                                                                (
                                                                    <div style={{borderRadius:"10px",width:"130px",height:"25px",marginTop:"20px", fontWeight:"700",fontSize:"18px"}}>
                                                                        {card.Name}
                                                                    </div> 
                                                                )
                                                            }
                                                        <div className={styles.download} style={{borderRadius:"10px",display:"flex",alignItems:"center",justifyContent:"center",width:"40px",height:"40px"}}>
                                                        <a href={card.File} download target='_blank' rel="noreferrer"  onClick={(e) =>download(card.File,card.Name)}>  
                                                        <img src='./arrow.png' alt='' style={{width:"20px", height:"20px"}} />
                                                        </a>
                                                       
                                                        </div>
                                                    </div>
                                                    
                                                    <div style={{borderRadius:"10px",width:"190px",height:"auto",marginTop:"13px",fontSize:"14px"}}>
                                                        {card.Description} 
                                                    </div>
                                                    <div className='' >
                                                    {
                                                        loading ?
                                                        (
                                                            <button className={styles.ToggleButtonLoading} 
                                                         style={{borderRadius:"5px",border:"1px black solid",width:"100%",height:"30px",marginTop:"13px",display:"flex",alignItems:"center", justifyContent:"space-around"}}>
                                                            <h4>
                                                            <FaSpinner icon="spinner" className={styles.spinner} />
                                                            </h4>
                                                            </button>
                                                        )
                                                        :
                                                        (
                                                            <button className={styles.ToggleButton} onClick={() => StarMeme(card.Id, card.DidMemberStarMe)}
                                                         style={{borderRadius:"5px",border:"1px black solid",width:"100%",height:"30px",marginTop:"13px",display:"flex",alignItems:"center", justifyContent:"space-around"}}>
                                                            { 
                                                            // This was complicated for me when getting the logic lol
                                                            // so whatrs happening here is we wanna know 3 things: 
                                                            // Did I star this Meme?
                                                            // What Did I Star?
                                                            // Who starred this Meme?
                                                            // so i asnwer these questions by checking if the cuurent user has starred this meme
                                                            /*
                                                                so i check using the id whether this person starred it already them if so show that 
                                                                it has been starred then if not check if i clicked the button 
                                                                if i did then show starred star 
                                                                if i have never starred this item before and i didnt click the button then show empty star

                                                            */
                                                             (card.DidMemberStarMe == true) ?
                                                                (
                                                                    <>
                                                                    <img src='./filledStar.png' alt='STAR'  style={{width:"20px",height:"20px"}}  />
                                                                    {card.NumberOfStars}
                                                                    </>
                                                                ) 
                                                                :
                                                                (
                                                                   
                                                                    <>
                                                                            <img src='./strokeStar.png' alt='STAR' style={{width:"20px",height:"20px"}}  />
                                                                            {card.NumberOfStars}
                                                                    </>
                                                                )
                                                            }
                                                            
                                                         </button>
                                                       
                                                        )
                                                    }
                                                         
                                                        
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
            <div> 
                {renderButton()}
            </div>
        </div>
    </div>
    )
}

async function GetData() {
    const data = await client.query(MemesQuery).toPromise()
    return (data.data.memes)
  }
  async function MemInfo() {
    const info = await client.query(MemberQuery).toPromise()
    return (info.data.memebers)
  }
  export async function getServerSideProps() {
    const data = await GetData()
    const info = await MemInfo()
    return{
      props:{
        memes:data,
        members:info
      }
    }
  }