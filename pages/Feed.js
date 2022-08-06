import Head from 'next/head'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useContract, useProvider,useSigner,useAccount,useBalance,useConnect  } from 'wagmi'
import {MemeForestAddress,Token, ApiUriv} from '../constant'
import { useEffect, useState } from "react";
import MEME from '../artifacts/contracts/MemeForest.sol/MemeForest.json'
import 'bootstrap/dist/css/bootstrap.css'
import axios from "axios"
import { createClient } from 'urql'
import { Web3Storage } from 'web3.storage'



const MemesQuery= `
query {
    memes(
    orderBy : id,
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
    const { data} = useAccount()
    const person = data?.address;
    const[loadingStar, setLoadingStar] = useState(false)
    const[memberDetails,setMemberDetails] = useState([])
    const[loadingLike, setLoadingLike] = useState(false)
    const[loadingLikeId, setLoadingLikeId] = useState(0)
    const[loadingStarId, setLoadingStarId] = useState(0)
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
            FechMemeInfo(props);
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
            setLoadingStarId(id)
            if (bool == true) {
                const data= await contractWithSigner.RemoveStarMeme(id)
                await data.wait()
                await FechMemeInfo(props);
            }
            else {
                
                const data= await contractWithSigner.StarMeme(id)
                await data.wait()
                await FechMemeInfo(props);
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
            setLoadingLikeId(id)
            if (bool == true) {
               
                const data= await contractWithSigner.UnLikeMeme(id)
                await data.wait()
                await FechMemeInfo(props); 
            
            }
            else {
                const data= await contractWithSigner.LikeMeme(id)
                await data.wait()
                await FechMemeInfo(props);
                
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
           
                const StarAnswer= signer ? await contractWithProvider.WhatDidIStar(i.id,person) : false;
                const LikeAnswer= signer ? await contractWithProvider.WhatDidILike(i.id,person) : false;
                
                
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
                FileType :i.FileType,
                DidMemberStarMe: StarAnswer,
                DidMemberLikeMe:LikeAnswer

            }
            return List
        })); 
        setMemberDetails(tx)
    }
    const renderButton = () => {
        


        if(Memeslength == 0) {
            return (
                <div className='flex flex-row items-center justify-center' >

                
                    {
                        loadingpage ? 
                        ( 
                            <div className='text-center text-8xl'>
                              <img src="/loading.png" alt="loading..." />
                            </div>
                        ) 
                        : 
                        (
                            <h4 className='text-center'>
                                There are no Memes For Display
                            </h4>
                        )
                    }
                </div>
            )
        }
        if (Memeslength>0){
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
                        <div className='grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4 px-5 py-2 ' >
                        {
                            memberDetails.map((card,i) => {
                                return(  
                                    <div key={i} className='w-full shadow-md p-3 rounded-3xl bg-gray-50 '>
                                        {
                                              <div className='flex flex-col' >
                                                    <div className='group flex flex-row items-center justify-center overflow-hidden rounded-lg '  >
                                                        <a href={card.File} target='_blank' rel="noreferrer" >  
                                                           {
                                                               (card.FileType == "img/png") ?
                                                               (
                                                                <img src={`https://${card.image}.ipfs.dweb.link/image`}  className='w-full rounded-lg h-36 group-hover:scale-150 transition ease duration-300' alt="..." />
                                                               )
                                                               :
                                                               (
                                                                <video src={`https://${card.image}.ipfs.dweb.link/image`}  className='w-full rounded-lg h-36 group-hover:scale-150 transition ease duration-300' alt="..."  width="500px" height="500px"  controls="controls"/> 
                                                               )
                                                           } 
                                                           
                                                        </a>
                                                        <div className=' hidden p-1 rounded-lg bg-gray-700 text-gray-100 font-medium text-xs group-hover:inline absolute self-start  ' >
                                                            {
                                                                props.members.map((lists,i) => {
                                                                    return(
                                                                        
                                                                        <div key={i}  >
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
                                                        <div className='hidden p-1 rounded-lg bg-gray-700 text-gray-100 font-thin text-xs group-hover:inline absolute self-end'  >
                                                            {
                                                                card.Date
                                                            
                                                            }
                                                        </div>
                                                   </div>
                                                    <div className='py-2 px-3 border-2 border-gray-500 h-auto mx-2 mt-4 rounded-lg' >
                                                        <div className='grid grid-rows grid-flow-col gap-1  ' >
                                                            
                                                        {
                                                                card.Name.length > 7 ?
                                                            (
                                                                <div className='flex items-end row-start-2 row-span-2 rounded-lg font-black text-xs  ' >
                                                                    {card.Name}
                                                                </div> 
                                                            ) : 
                                                            (
                                                                <div className='flex items-end row-start-2 row-span-2 rounded-lg font-black text-sm  '>
                                                                      {card.Name}
                                                                </div> 
                                                            )
    
                                                         }
                                                            {
                                                                card.IsDownloadable ?
                                                                <div className='row-start-2 row-span-2 flex items-center justify-center rounded-lg shadow-md py-2 hover:shadow-xl transition ease ' >
                                                                    <a href={`https://${card.image}.ipfs.dweb.link/image`} download target='_blank' rel="noreferrer" onClick={(e) =>download(card.image,card.Name)}>  
                                                                    <img src='./arrow.png' alt='' className='h-5 w-5 mt-1' />
                                                                    </a>
                                                           
                                                                 </div>
                                                                 :
                                                                 <div className='row-start-2 h-10 row-span-2 flex items-center justify-center rounded-lg py-2 ' >
                                                                
                                                                </div>
                                                            }
                                                            
                                                        </div>
                                                        
                                                        <div className='rounded-md mt-3 text-sm h-auto ' >
                                                            {card.Description} 
                                                        </div>
                                                        <div className='flex flex-row  justify-between space-x-1'>
                                                            <button className='rounded-md border-2 border-black flex mt-3  items-center justify-around h-8 w-24 hover:bg-[#FFFF00] 'onClick={() => StarMeme(card.Id, card.DidMemberStarMe)}>
                                                                
                                                                {
                                                                   ((loadingStarId == card.Id) && loadingStar ) ? 
                                                                    (
                                                                        <button className='bg-[#FFFF00] rounded-md flex items-center justify-around h-7 w-24'>
                                                                            <h4>
                                                                            
                                                                            <img src="/loader.png" alt="loading..." className='w-8 h-8 mt-2' />
                                                                            </h4>
                                                                        </button>
                                                                    ) 
                                                                    : 
                                                                    (
                                                                        (card.DidMemberStarMe == true) ?
                                                                        (
                                                                            <>
                                                                            <img src='./filledStar.png' alt='STAR'  className='w-5 h-5'  />
                                                                            {card.NumberOfStars}
                                                                            </>
                                                                        ) 
                                                                        :
                                                                        (
                                                                            <>
                                                                            <img src='./strokeStar.png' alt='STAR' className='w-5 h-5'  />
                                                                            {card.NumberOfStars}
                                                                            </>
                                                                        )
                                                                    )
                                                                }
                                                            </button>
                                                           <button className='rounded-md border-2 border-black flex mt-3  items-center justify-around h-8 w-24 hover:bg-[#ff0000] '  onClick={() => LikeMeme(card.Id, card.DidMemberLikeMe)}
                                                               >
                                                                    {
                                                                    ((loadingLikeId == card.Id) && loadingLike) ?
                                                                    (
                                                                        <button className='rounded-md border-2 border-black flex  items-center justify-around h-8 w-24 bg-[#FFFF00] ' >
                                                                            <h4>
                                                                            <img src='./filledStar.png' alt='STAR'  className='w-5 h-5'  />
                                                                            </h4>
                                                                        </button>
                                                                    ) 
                                                                    :
                                                                    (
                                                                        (card.DidMemberLikeMe == true) ?
                                                                            (
                                                                                
                                                                                <>
                                                                                    <img src='./filledLove.png' alt='STAR'  className='w-5 h-5'  />
                                                                                    {card.NumberOfLikes}
                                                                                </>
                                                                            ) 
                                                                            :
                                                                            (
                                                                                <>
                                                                                    <img src='./UnfilledLove.png' alt='STAR' className='w-5 h-5'  />
                                                                                    {card.NumberOfLikes}
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