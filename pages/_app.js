import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import '@rainbow-me/rainbowkit/styles.css';
import {
  apiProvider,
  configureChains,
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme 
} from '@rainbow-me/rainbowkit';
import 'bootstrap/dist/css/bootstrap.css'
import { chain, createClient, WagmiProvider } from 'wagmi';
import Navbar from '../components/Navbar';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { useState } from 'react';
import Router from 'next/router';
import Loader from '../components/loader';


const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.polygonMumbai],
  [
    apiProvider.alchemy(process.env.ANKR_ID),
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
  const[loader,setLoader]= useState(false)
  Router.events.on("routeChangeStart" , (url) => {
    setLoader(true)
  })

  Router.events.on("routeChangeComplete" , (url) => {
    setLoader(false)
  })

  return(
    <div >
     
      <WagmiProvider client={wagmiClient}>
      <RainbowKitProvider 
    //   theme={darkTheme({
    //   accentColor: '#22c55e',
    //   accentColorForeground: 'white',
    //   borderRadius: 'large',
    //   fontStack: 'system'
    // })} 
    chains={chains}>
      <div className=''>
      {
      loader ?
      (
        <Loader/>
      ) 
      :
      ( 
        <>
          <Navbar/>
          <div  className='h-24 w-full'>
          </div>
          <Component {...pageProps} /> 
        </>
       
      )
       
      }
       </div>
      </RainbowKitProvider>
    </WagmiProvider>
    </div>
    
  )
}

export default MyApp
