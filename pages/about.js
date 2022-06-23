import Head from 'next/head'
import Image from 'next/image'
import 'bootstrap/dist/css/bootstrap.css'
import styles from '../styles/Home.module.css'
import Link from 'next/link'


export default function About() {
    return (
        <div className="container-fluid">
            <div className="row d-flex align-items-center justfy-content-space-evenly" style={{flexDirection:"column", paddingTop:"20px"}}>
            <div className="col-md-4" style={{width:"auto", marginBottom:"40px"}} >
               <img src='./LogoForest.png'  style={{width:"425px", height:"160px"}}/>

          
            </div>
            <div className="col-md-8" style={{ marginTop:"20px", width:"auto"}}>
                <span style={{ fontSize:"18px",lineHeight:"30px", fontWeight:"700"}}>
                    This project was made by Adebayo Olamilekan (Oleanji) to put on my portfolio 
                    as a dapp project i did solely using these technologies:
                    <br/>
                    <div style={{paddingLeft:"50px"}}>
                    --&gt; Rainbow [WAGMI Client]  : for wallet connection 
                    <br/>
                    --&gt; Arweave & Bundlr : for keeping the data of the meme
                    <br/>
                    --&gt; Next JS : frontend
                    <br/>
                    --&gt; Solidity : Backend
                    <br/>
                    --&gt; Hardhat
                    <br/>
                    </div>
                    
                    And if you notice this is really a MemeForest 😂😜
                    you can upload your meme and later retreive it (by downloading it)
                    You can explore the pages on this app from 
                    joining and funding to creating your meme to either liking or starring any 
                    memes and probably withdrawing or funding your wallet again.<br/>
                    A preview of the Feed page is shown below alog with a diagram explaining how a memewould look like:

                </span>
            </div>
            </div>
              <div className="row d-flex align-items-center justify-content-space-evenly" style={{padding:"20px 5px"}} >
               
                <div className="col-md-6" style={{padding:"10px"}}>
                    <img src="ex.png" style={{width: "550px", height:"auto", borderRadius:"25px"}} />
                </div>
                <div className="col-md-6"style={{padding:"10px"}}>
                <img src="Screenshot (197).png"  style={{width: "500px", height:"auto", borderRadius:"25px"}}/>
                    </div>
              </div>
              <div className='row d-flex align-items-center ' style={{flexDirection:"row",justifyContent:"space-around", paddingTop:"30px",paddingBottom:"30px"}}>
              
              <div className='col-md-6 d-flex align-items-center' style={{flexDirection:'column', width:"auto"}}>
                <div className={styles.image}>
                  <Image src='/IMG_9965.jpg'  width={240} height ={210}/>
                </div>
                <div className='d-flex align-items-center ' style={{justifyContent:"space-around", width:"auto"}}>
                
                <h5>
                    I  AM  ADEBAYO (Oleanji) Im the Creator of MemeForest 
                </h5>
               
                
                </div>
               
            </div>
            <div className='col-md-3' style={{ width:"300px", height:"300px", padding:"90px"}}>
              <img src="twitter.png" style={{width: "48px", height:"48px", borderRadius:"25px"}} /> 
             
              <a  href="https://twitter.com/Oleanji_sol"   target="_blank" rel="noreferrer">
                 Twitter
             </a>
             <br/>
              <img src="linkedin.png" style={{width: "48px", height:"48px", borderRadius:"25px"}} />
              <a href="https://www.linkedin.com/in/Adebayo-olamilekan-oleanji"  target="_blank" rel="noreferrer">
                 LinkedIn
             </a>
             
              </div>
          </div>
        </div>
    )
}