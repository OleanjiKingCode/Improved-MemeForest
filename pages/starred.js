import Head from 'next/head'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useContract, useProvider,useSigner,useAccount,useBalance,useConnect  } from 'wagmi'
import {MemeForestAddress,Token, ApiUriv} from '../constant'
import { useEffect, useState } from "react";
import MEME from '../artifacts/contracts/MemeForest.sol/MemeForest.json'
import axios from "axios"
import { createClient } from 'urql'
import { Web3Storage } from 'web3.storage'
import { useRouter } from 'next/router';

    
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
    
    
export default function Starred (props) {  
    const { data} = useAccount()
    const person = data?.address;
    const[loadingStarId, setLoadingStarId] = useState(0)
    const[loadingStar, setLoadingStar] = useState(false)
    const[DidIStarMeme, SetDidIStarMeme] =useState(false)
    const [AMember,setAMember] = useState(false)
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
        checkIfAMember(props);
        StarredMemes(props);
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
            const StarredAddress = i.StarredAddresses;
         
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
            const StarAnswer= await contractWithProvider.WhatDidIStar(i.id,person);
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
            }
            return List
        })); 
        setMemeDetails(tx)
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
                        <div className='flex flex-row items-center justify-center text-8xl '>
                           <img src="/loading.png" alt="loading..." />
                        </div>
                    ) 
                    : 
                    (
                        <div className='flex flex-col items-center justify-center space-y-5 '> 
                            <div className='text-center font-bold text-lg '>
                                Go Back Home and Register before Seeing Starred Memes 
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
        if(AMember) {
           if(memeDetails.length == 0) 
           {
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
                        <div className='flex flex-col items-center justify-center space-y-5 ' > 
                            <div className='text-center font-bold text-lg '>
                                You have No Starred Memes Go back to Create Memes 
                            </div>
                            <img src='/sad.png' className='w-1/6'/>  
                            <button onClick={create} className='no-underline bg-green-500 py-2 px-3 rounded-lg font-bold text-teal-50 hover:bg-orange-500 cursor-pointer '> 
                                Create Meme
                            </button>
                        </div>
                    )
                    }
                </div>
            )
           }
           if(memeDetails.length > 0){
            return(
                <div className='flex flex-col ' >
                <h3 className='text-center font-bold text-lg self-center'>
                    YOUR STARRED NFTS ART(S)
                </h3>
              
                <div className='grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4 px-5 py-2 ' >
                    {
                        memeDetails.map((card,i) => {
                            return(  
                                <>
                                 {
                                    (card.DidMemberStarMe == true)&& 
                                     
                                    <div key={i} className='w-full shadow-md p-3 rounded-3xl bg-gray-50 '>
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
                                            <div className=''>
                                                <button className='rounded-md border-2 border-black flex mt-3  items-center justify-around h-8 w-full hover:bg-[#FFFF00] 'onClick={() => StarMeme(card.Id, card.DidMemberStarMe)}>
                                                    
                                                    {
                                                        ((loadingStarId == card.Id) && loadingStar ) ? 
                                                        (
                                                            <button className='bg-[#FFFF00] rounded-md flex  items-center justify-around h-7 w-full'>
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
                                               
                                                
                                            </div>
                                            
                                        </div>
                                    </div>
                                    </div> 
                                        
                                }
                                
                                </>
                            )
                        })
                    }
                </div>
                <div className='flex items-center justify-center space-x-3 py-3 w-full '>      
                    <img src='/sad.png' className='w-[40px]'/>
                    <div className='px-5 text-center text-sm'>
                        Thats all of your Starred Nft Art(s)
                    </div> 
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