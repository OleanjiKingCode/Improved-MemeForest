import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useContract, useProvider,useSigner,useAccount,useBalance,useConnect  } from 'wagmi'
import {MemeForestAddress,Token, ApiUriv} from '../constant'
import { useEffect, useRef, useState, useContext } from "react";
import MEME from '../artifacts/contracts/MemeForest.sol/MemeForest.json'
import 'bootstrap/dist/css/bootstrap.css'
import axios from "axios"
import { FaSpinner } from 'react-icons/fa';
import { createClient } from 'urql'
import { Web3Storage } from 'web3.storage'



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


export default function Feed (props) {
    const Memeslength  = props.memes.length
    const Memberslength  = props.members.length
    const { data} = useAccount()
    const person = data?.address;
    const [memes,setMemes] = useState([])
    const[loadingStar, setLoadingStar] = useState(false)
    const[memberDetails,setMemberDetails] = useState([])
    const[loadingLike, setLoadingLike] = useState(false)
    const[DidIStarMeme, SetDidIStarMeme] =useState(false)
    const[DidILikeMeme, SetDidILikeMeme] =useState(false)
    const provider = useProvider()
    const { data: signer} = useSigner()
    const[loadingpage,setLoadingPage] = useState(false)
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
            FechMemeInfo(props)
    }, []);

    const PageLoad = async () =>{
        try {
            setLoadingPage(true)
            const delay = ms => new Promise(res => setTimeout(res, ms));
            await delay(20000);
            setLoadingPage(false)
        } catch (e) {
            console.log(e)
        }
    }

    const StarMeme = async (id,bool) =>{
        try {
            setLoadingStar(true)
          
            if (bool == true) {
               
                const data= await contractWithSigner.RemoveStarMeme(id)
                await data.wait()
                await fetchAllMemes();
               
            }
            else {
                const data= await contractWithSigner.StarMeme(id)
                await data.wait()
                await fetchAllMemes();
                
            }
            setLoadingStar(false)

        } catch (e) {
            console.log(e)
        }
    }
    const download = (e,name) => {
        try {
            const Link = `https://${e}.ipfs.dweb.link/image`
            axios({
                url: Link, //your url
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
        } catch (error) {
            console.log(error)
        }
      };
    const LikeMeme = async (id,bool) =>{
        try {
            setLoadingLike(true)
            if (bool == true) {
               
                const data= await contractWithSigner.UnLikeMeme(id)
                await data.wait()
                await fetchAllMemes(); 
            
            }
            else {
                const data= await contractWithSigner.LikeMeme(id)
                await data.wait()
                await fetchAllMemes();
                
            }
            setLoadingLike(false)

        } catch (e) {
            console.log(e)
        }
    }
    function getAccessToken () {
    
        return Token;
    }
        
    function makeStorageClient () {
    return new Web3Storage({ token: getAccessToken() })
    }
    const FechMemeInfo = async (props) => {
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
        setMemberDetails(tx)
    }
    const renderButton = () => {
        
        if (Memeslength>0){
            return(
                <div className='row d-flex' style={{flexDirection:"row"}}>
                    {
                        memberDetails.map((card,i) => {
                            return(  
                                <div key={i} className='col-md-3 p-3'>
                                    {
                                          <div className={styles.Memebox} style={{borderRadius:"25px", height:"auto",padding:"10px"}}>
                                                <div className={styles.upperimg}  style={{borderRadius:"15px",height:"150px",overflow:"hidden", flexDirection:"column"}}>
                                                    <a href={card.File} target='_blank' rel="noreferrer" style={{padding:"0", margin:"0", textDecoration:"none", }}>  
                                                       {
                                                           (card.FileType == "img/png") ?
                                                           (
                                                            <img src={`https://${card.image}.ipfs.dweb.link/image`}  className={styles.change} alt="..." style={{height:"150px",width:"auto",}}/>
                                                           )
                                                           :
                                                           (
                                                            <video src={`https://${card.image}.ipfs.dweb.link/image`}  className={styles.change} width="500px" height="500px"  controls="controls"/> 
                                                           )
                                                       } 
                                                       
                                                    </a>
                                                    <div className={styles.nameOfOwner} >
                                                        {
                                                            props.members.map((lists,i) => {
                                                                return(
                                                                    
                                                                    <div key={i}  style={{fontSize:"14px",fontWeight:"500"}}>
                                                                    {
                                                                        lists.Adddress == card.Owner &&
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
                                                        {
                                                            card.IsDownloadable &&
                                                            <div className={styles.download} style={{borderRadius:"10px",display:"flex",alignItems:"center",justifyContent:"center",width:"40px",height:"40px"}}>
                                                                <a href={`https://${card.image}.ipfs.dweb.link/image`} download target='_blank' rel="noreferrer" onClick={(e) =>download(card.image,card.Name)}>  
                                                                <img src='./arrow.png' alt='' style={{width:"20px", height:"20px"}} />
                                                                </a>
                                                       
                                                             </div>
                                                        }
                                                        
                                                    </div>
                                                    
                                                    <div style={{borderRadius:"10px",width:"190px",height:"auto",marginTop:"13px",fontSize:"14px"}}>
                                                        {card.Description} 
                                                    </div>
                                                    <div className='d-flex justify-content-between'>
                                                        <button className={styles.ToggleButton} onClick={() => StarMeme(card.Id, card.DidMemberStarMe)}
                                                            style={{borderRadius:"5px",border:"1px black solid",width:"90px",height:"30px",marginTop:"13px",display:"flex",alignItems:"center", justifyContent:"space-around"}}>
                                                            {
                                                                loadingStar ? 
                                                                (
                                                                    <button className={styles.ToggleButtonLoading} 
                                                                        style={{borderRadius:"5px",border:"1px black solid",width:"90px",height:"30px",marginTop:"13px",display:"flex",alignItems:"center", justifyContent:"space-around"}}>
                                                                        <h4>
                                                                        <FaSpinner icon="spinner" className={styles.spinner} />
                                                                        </h4>
                                                                    </button>
                                                                ) 
                                                                : 
                                                                (
                                                                    DidIStarMeme ?
                                                                    (
                                                                        <>
                                                                        <img src='./filledStar.png' alt='STAR'  style={{width:"20px",height:"20px"}}  />
                                                                        {card.Stars}
                                                                        </>
                                                                    ) 
                                                                    :
                                                                    (
                                                                        <>
                                                                        <img src='./strokeStar.png' alt='STAR' style={{width:"20px",height:"20px"}}  />
                                                                        {card.Stars}
                                                                        </>
                                                                    )
                                                                )
                                                            }
                                                        </button>
                                                       <button className={styles.ToggleButton2}  onClick={() => LikeMeme(card.Id, card.DidMemberLikeMe)}
                                                            style={{borderRadius:"5px",border:"1px black solid",width:"90px",height:"30px",marginTop:"13px",display:"flex",alignItems:"center", justifyContent:"space-around"}}>
                                                                {
                                                                loadingLike?
                                                                (
                                                                    <button className={styles.ToggleButton2Loading}  
                                                                    style={{borderRadius:"5px",border:"1px black solid",width:"90px",height:"30px",marginTop:"13px",display:"flex",alignItems:"center", justifyContent:"space-around"}}>
                                                                        <h4>
                                                                            <FaSpinner icon="spinner" className={styles.spinner} />
                                                                        </h4>
                                                                    </button>
                                                                ) 
                                                                :
                                                                (
                                                                    DidILikeMeme ?
                                                                        (
                                                                            
                                                                            <>
                                                                                <img src='./filledLove.png' alt='STAR'  style={{width:"20px",height:"20px"}}  />
                                                                                {card.Likes}
                                                                            </>
                                                                        ) 
                                                                        :
                                                                        (
                                                                            <>
                                                                                <img src='./UnfilledLove.png' alt='STAR' style={{width:"20px",height:"20px"}}  />
                                                                                {card.Likes}
                                                                            </>
                                                                        )
                                                                )
                                                            }
                                                        </button>
                                                        
                                                    </div>
                                                    
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

        if(memes.length == 0) {
            return (
                <div className='row d-flex align-items-center justify-content-center' style={{flexDirection:"row"}}>

                
                    {
                        loadingpage ? 
                        ( 
                            <div style={{fontSize:"100px", textAlign:"center"}}>
                                <FaSpinner icon="spinner" className={styles.spinner} />
                            </div>
                        ) 
                        : 
                        (
                            <h4 style={{textAlign:"center"}}>
                                There are no Memes For Display
                            </h4>
                        )
                    }
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
            <img src='./LogoForest.png'  style={{width:"283px", height:"107px", marginTop:"-20px"}}/>
            <div>
                <ConnectButton />
            </div>
            <div> 
                {renderButton()}
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