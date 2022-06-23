import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useContract, useProvider,useSigner,useAccount,useBalance,useConnect  } from 'wagmi'
import {MemeForestAddress} from '../constant'
import { useEffect, useRef, useState, useContext } from "react";
import MEME from '../artifacts/contracts/MemeForest.sol/MemeForest.json'
import 'bootstrap/dist/css/bootstrap.css'
import axios from "axios"
import { FaSpinner } from 'react-icons/fa';



export default function Feed () {
   
    const { data} = useAccount()
    const person = data?.address;
    const [memes,setMemes] = useState([])
    const[loadingStar, setLoadingStar] = useState(false)
    const[memberDetails,setMemberDetails] = useState([])
    const[loadingLike, setLoadingLike] = useState(false)
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
        
            fetchAllMemes();
            PageLoad();
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
    const fetchAllMemes = async () => {
        try {
            const data= await contractWithProvider.fetchAllMemes();
            const tx = await Promise.all(data.map(async i => {
                const Info = await axios.get(i.Memeinfo)
               
                const StarAnswer= await contractWithProvider.WhatDidIStar(i.fileId,person);
                
                const LikeAnswer= await contractWithProvider.WhatDidILike(i.fileId,person);
               
               
                
                let List = {
                    
                    Name:Info.data.nameOfFile,
                    AddressOfOwner : i.Owner,
                    Id :i.fileId.toNumber(),
                    File: Info.data.image,
                    IsStarred:i.starred,
                    NumberOfStars:i.Stars.toNumber(),
                    NumberOfLikes:i.Likes.toNumber(),
                    Date:i.DateOfCreation,
                    FileType:i.FileType,
                    Description:Info.data.DescriptionOfFile,
                    DidMemberStarMe: StarAnswer,
                    DidMemberLikeMe:LikeAnswer
                   
                }
               
                return List
                
            }));
            setMemes(tx);
            const delay = ms => new Promise(res => setTimeout(res, ms));
                await delay(7000);
            const ata= await contractWithProvider.fetchMembers();
    
            const txn = await Promise.all(ata.map(async i =>{
               let list = {
                Name : i.Name,
                Address : i.MemeberAddress,
                Date: i.Datejoined,
                Memes : i.MyMemes.toNumber(),
                Starred :i.MyStarredMemes.toNumber()
               
              }
              return list
             }));
             setMemberDetails(txn)
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
    
    const renderButton = () => {
        
        if (memes.length >0){
            return(
                <div className='row d-flex' style={{flexDirection:"row"}}>
                    {
                        memes.map((card,i) => {
                            return(  
                                <div key={i} className='col-md-3 p-3'>   
                                    {

                                        (!card.Name == " " && !card.Description == " ") &&

                                            <div className={styles.Memebox} style={{borderRadius:"25px", height:"auto",padding:"10px"}}>
                                                <div className={styles.upperimg}  style={{borderRadius:"15px",height:"150px",overflow:"hidden", flexDirection:"column"/*, backgroundImage:`url(${card.File})`, backgroundSize:"cover",backgroundPosition:"center"*/}}>
                                                    <a href={card.File} target='_blank' rel="noreferrer" style={{padding:"0", margin:"0", textDecoration:"none", }}>  
                                                       {
                                                           (card.FileType == "img/png") ?
                                                           (
                                                            <img src={card.File} className={styles.change} alt="..." style={{height:"150px",width:"auto",}}/>
                                                           )
                                                           :
                                                           (
                                                            <video src={card.File} className={styles.change} width="500px" height="500px"  controls="controls"/> 
                                                           )
                                                       }
                                                       
                                                            
                                                           
                                                        {/*  */}
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
                                                        <a href={card.File} download target='_blank' rel="noreferrer" onClick={(e) =>download(card.File,card.Name)}>  
                                                        <img src='./arrow.png' alt='' style={{width:"20px", height:"20px"}} />
                                                        </a>
                                                       
                                                        </div>
                                                    </div>
                                                    
                                                    <div style={{borderRadius:"10px",width:"190px",height:"auto",marginTop:"13px",fontSize:"14px"}}>
                                                        {card.Description} 
                                                    </div>
                                                    <div className='d-flex justify-content-between ' >
                                                    
                                                        
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
                                                                    
                                                                   
                                                                    <button className={styles.ToggleButton} onClick={() => StarMeme(card.Id, card.DidMemberStarMe)}
                                                                    style={{borderRadius:"5px",border:"1px black solid",width:"90px",height:"30px",marginTop:"13px",display:"flex",alignItems:"center", justifyContent:"space-around"}}>
                                                                   {
                                                                   // This was complicated for me when getting the logic lol
                                                                        // so whatrs happening here is we wanna know 3 things: 
                                                                        // Did I star this Meme?
                                                                        // What Did I Star?
                                                                        // Who starred this Meme?
                                                                        // so i asnwer these questions by checking if the cuurent user has starred this meme
                                                                        
                                                                        //     so i check using the id whether this person starred it already them if so show that 
                                                                        //     it has been starred then if not check if i clicked the button 
                                                                        //     if i did then show starred star 
                                                                        //     if i have never starred this item before and i didnt click the button then show empty star

                                                                        

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
                                                                        <button className={styles.ToggleButton2}  onClick={() => LikeMeme(card.Id, card.DidMemberLikeMe)}
                                                                        style={{borderRadius:"5px",border:"1px black solid",width:"90px",height:"30px",marginTop:"13px",display:"flex",alignItems:"center", justifyContent:"space-around"}}>
                                                                            {
                                                                                (card.DidMemberLikeMe == true) ?
                                                                                (
                                                                                    <>
                                                                                    <img src='./filledLove.png' alt='STAR'  style={{width:"20px",height:"20px"}}  />
                                                                                    {card.NumberOfLikes}
                                                                                    </>
                                                                                ) 
                                                                                :
                                                                                (
                                                                                    
                                                                                    <>
                                                                                            <img src='./UnfilledLove.png' alt='STAR' style={{width:"20px",height:"20px"}}  />
                                                                                            {card.NumberOfLikes}
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
        <div className={styles.container}>
          <Head>
            <title>Home</title>
            <meta name="description" content="By Oleanji" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
        <div className={styles.topper} >
        <img src='./LogoForest.png'  style={{width:"283px", height:"107px", marginTop:"-20px"}}/>
          <div className={styles.connect}>
            <ConnectButton />
          </div>
        </div>
        <div style={{padding:"120px 20px 20px 20px"}}> 
       
          {renderButton()}
        

      </div>
    
          
        </div>
      )
}