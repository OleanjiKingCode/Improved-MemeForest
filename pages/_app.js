import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import {
  apiProvider,
  configureChains,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { chain, createClient, WagmiProvider } from "wagmi";
import Navbar from "../components/Navbar";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.polygonMumbai],
  [apiProvider.alchemy(process.env.ANKR_ID), apiProvider.fallback()]
);
const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }) { 

  return (
    <div>
      <WagmiProvider client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <div>
            <>
              <Navbar />
              <div className="h-24 w-full"></div>
              <Component {...pageProps} />
            </>
          </div>
        </RainbowKitProvider>
      </WagmiProvider>
    </div>
  );
}

export default MyApp;
