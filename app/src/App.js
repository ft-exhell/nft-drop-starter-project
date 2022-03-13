import React, { useState, useEffect } from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';
import CandyMachine from './CandyMachine';
import { candyMachineProgram } from './CandyMachine/helpers';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);

  const checkWalletConnect = async () => {
    try {
      const { solana } = window;
      
      if (solana && solana.isPhantom) {
        console.log('Phantom wallet found.');

        const response = await solana.connect({ onlyIfTrusted: true })
        console.log(
          'Connected with PK: ',
          response.publicKey.toString()
        )

        setWalletAddress(response.publicKey.toString())
      } else {
        alert('Please install Phantom wallet.')
      }
    } catch (err) {
      console.error(err);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with PK: ', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  }

  const renderNotConnectedContainer = () => (
    <button 
      className='cta-button connect-wallet-button'
      onClick={connectWallet}
    >
      Connect Wallet
    </button>

  )

  useEffect(() => {
    const onLoad = async () => {
      await checkWalletConnect();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🍭 Candy Drop</p>
          <p className="sub-text">NFT drop machine with fair mint</p>
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && <CandyMachine walletAddress={window.solana} />}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
