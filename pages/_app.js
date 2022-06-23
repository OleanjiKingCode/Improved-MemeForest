import '../styles/globals.css'
import Head from 'next/head'
import styles from "../styles/Home.module.css";
import Link from "next/link"
import 'bootstrap/dist/css/bootstrap.css'
import '@rainbow-me/rainbowkit/styles.css';
import {
  apiProvider,
  configureChains,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import 'bootstrap/dist/css/bootstrap.css'
import { chain, createClient, WagmiProvider } from 'wagmi';
import {WebBundlr} from '@bundlr-network/client';
import { useEffect, useRef, useState, useContext } from "react";
import { fetchBalance } from '@wagmi/core';
import { utils } from 'ethers';
import { MainContext } from '../context';
import { providers } from "ethers"
import { HiMenu } from "react-icons/hi";
import { BiX } from "react-icons/bi";




const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.polygonMumbai],
  [
    apiProvider.alchemy(process.env.ALCHEMY_ID),
    apiProvider.fallback()
  ]
);
const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
});
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

function MyApp({ Component, pageProps }) {
  
  const [bundlrInstance, setBundlrInstance] = useState()
  const bundlrRef = useRef()
  const [balance , setBalance] = useState(0)
  const [toggle,setToggle] = useState(false)
    async function initialize(){
      try {
        await window.ethereum.enable()

      const provider = new providers.Web3Provider(window.ethereum);
      await provider._ready()
      const bundlr = new WebBundlr(
        "https://devnet.bundlr.network",
        "matic",
        provider,
        {  providerUrl: "https://polygon-mumbai.g.alchemy.com/v2/seH0s7cQOTefJ8KKCf46st-T5cCl4ZBZ"}
    );
      await bundlr.ready()
     
      
      setBundlrInstance(bundlr)
      bundlrRef.current = bundlr
      fetchBalance()
      } catch (e) {
        console.log(e)
      }
      
    }

    async function  fetchBalance() { 
      try {
        const bal = await bundlrRef.current.getLoadedBalance()

        setBalance(utils.formatEther(bal.toString()))
      } catch (error) {
        console.log(error)
      }
     
    }
    const displayResult = () => {
      if (clicked && !toggle) {
         setToggle(true)
       } else {
        setToggle(false)
       }
     }
     const openCloseMenu = () => {
      if (toggle) {
        setToggle(false)
      }
      else {
        setToggle(true)
      }
  }
    return (
<div  style={{backgroundColor:"#f1f1f1"}}>


    <div className='container-fluid' >
    
       {
       toggle ? 
       (
        <button className={styles.MenuClose} onClick={openCloseMenu}>
        <BiX/>
        </button>
       ) 
       : 
       (
        <button className={styles.Menu} onClick={openCloseMenu}>
        <HiMenu   />
        </button>
       )
       }
       
     
        <div className='row d-flex align-items-center justify-content-center' style={{flexDirection:"row"}}>
   
        <div className='col-md-2 text-white p-0 ' id='gone' >
          {
            toggle ?
            (
              <div className={styles.navbarexp} style={{backgroundColor:"#228B22", height:"100vh", overflow:"hidden"}}> 
            <Link href="/">
              <a  className={styles.first}>
                <div className='font-weight-bold px-2' style={{flexDirection:"column", color:"#b8c7ce", fontSize:"22px"}}>
                  <p>OLEANJI MemeForest</p>
                </div>
              </a>
            </Link>
            <div className='p-1 text-align-center my-3 ' style={{backgroundColor:"#1a2226"}}>
              <div style={{color:"white", fontSize:"12px"}}>
                Main Navigation
              </div>
            </div>
            <Link href="/" >
              
                <div className={styles.hover}>
                 Home
                </div>
        
            </Link>
            <Link href="/Feed">
              <div className={styles.hover}>
               Feed
              </div>
            </Link>
            <Link href="/starred">
              <div className={styles.hover}>
               Starred
              </div>
            </Link>
            <Link href="/creations">
              <div className={styles.hover}>
                Creations
              </div>
            </Link>
            
            <Link href="/funds">
              <div className={styles.hover}>
                Funds
              </div>
            </Link>
            <Link href="/about">
              <div className={styles.hover}>
                About
              </div>
            </Link>
            <Link href="/create">
              <div  className={styles.hoverMeme} /*className='mx-4 my-5 px-4 py-2 '*/ style={{ fontWeight:"500", borderRadius:"50px"}}>
                Create Meme
              </div>
            </Link>

            <Link href="https://forms.gle/ver9b7MBhrZ17pPi6">
              <div  className={styles.feedback} /*className='mx-4 my-5 px-4 py-2 '*/ style={{ fontWeight:"500", borderRadius:"50px"}}>
               Feedback
              </div>
            </Link>
            
          </div>
            ) 
            :
            (
              <div className={styles.navbar} style={{backgroundColor:"#228B22", height:"100vh", overflow:"hidden"}}> 
            <Link href="/">
              <a  className={styles.first}>
                <div className='font-weight-bold px-2' style={{flexDirection:"column", color:"#b8c7ce", fontSize:"22px"}}>
                  <p>OLEANJI MemeForest</p>
                </div>
              </a>
            </Link>
            <div className='p-1 text-align-center my-3 ' style={{backgroundColor:"#1a2226"}}>
              <div style={{color:"white", fontSize:"12px"}}>
                Main Navigation
              </div>
            </div>
            <Link href="/" >
              
                <div className={styles.hover}>
                 Home
                </div>
        
            </Link>
            <Link href="/Feed">
              <div className={styles.hover}>
               Feed
              </div>
            </Link>
            <Link href="/starred">
              <div className={styles.hover}>
               Starred
              </div>
            </Link>
            <Link href="/creations">
              <div className={styles.hover}>
                Creations
              </div>
            </Link>
            
            <Link href="/funds">
              <div className={styles.hover}>
                Funds
              </div>
            </Link>
            <Link href="/about">
              <div className={styles.hover}>
                About
              </div>
            </Link>
            <Link href="/create">
              <div  className={styles.hoverMeme} /*className='mx-4 my-5 px-4 py-2 '*/ style={{ fontWeight:"500", borderRadius:"50px"}}>
                Create Meme
              </div>
            </Link>

            <Link href="https://forms.gle/ver9b7MBhrZ17pPi6">
              <div  className={styles.feedback} /*className='mx-4 my-5 px-4 py-2 '*/ style={{ fontWeight:"500", borderRadius:"50px"}}>
               Feedback
              </div>
            </Link>
            
          </div>
            )
          }
            
          </div>
          <div className='col-md-10' >
              <div className='row d-flex align-items-center justify-content-center' style={{flexDirection:"column"}}>
              
        
          <div className='col-md-12 ' style={{height:"100vh",overflow:"hidden",overflowY:"scroll",  width:"100%",padding:"0",position:"relative"}} >
            <WagmiProvider client={wagmiClient}>
              <RainbowKitProvider chains={chains}>
                <MainContext.Provider value={{
                  initialize,
                  fetchBalance,
                  balance,
                  bundlrInstance
                }}
                >
                  <Component {...pageProps} />
                </MainContext.Provider>
               
              </RainbowKitProvider>
           </WagmiProvider>
          </div>
              </div>
         
          </div>

          
        </div>
        
      </div>








    

    </div>
  )
}

export default MyApp
