import '../styles/globals.css'
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
import Navbar from '../components/Navbar';


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
  return(
    <div >
     
      <WagmiProvider client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
      <div className=''>
        <Navbar/>
          <Component {...pageProps} />
        </div>
      </RainbowKitProvider>
    </WagmiProvider>
    </div>
    
  )
}

export default MyApp
