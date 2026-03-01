import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useEnsName, useEnsAvatar, useConnectors } from 'wagmi';
import './ConnectButton.css';

function WalletOption({ connector, onClick, ready }) {
  const [icon, setIcon] = useState(null);
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    const getIcon = async () => {
      if (connector.name.toLowerCase().includes('metamask')) {
        setIcon('🦊');
      } else if (connector.name.toLowerCase().includes('coinbase')) {
        setIcon('🔵');
      } else if (connector.name.toLowerCase().includes('walletconnect')) {
        setIcon('🔗');
      } else if (connector.name.toLowerCase().includes('safe')) {
        setIcon('🛡️');
      } else {
        setIcon('⬡');
      }
    };
    getIcon();
  }, [connector.name]);

  useEffect(() => {
    const checkReady = async () => {
      try {
        const provider = await connector.getProvider();
        setIsReady(!!provider);
      } catch (e) {
        setIsReady(false);
      }
    };
    checkReady();
  }, [connector]);

  const isDisabled = !ready || (connector.type === 'injected' && !isReady);

  return (
    <button 
      className="wallet-option" 
      onClick={onClick} 
      disabled={isDisabled}
    >
      <span className="wallet-option-icon">{icon}</span>
      <span className="wallet-option-name">{connector.name}</span>
    </button>
  );
}

export default function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName(address ? { address } : { address: undefined });
  const { data: ensAvatar } = useEnsAvatar(ensName ? { name: ensName } : { name: undefined });
  const connectors = useConnectors();
  const [showOptions, setShowOptions] = useState(false);

  const shortenAddress = (addr) => {
    if (!addr) return '';
    return addr.slice(0, 6) + '...' + addr.slice(-4);
  };

  const handleConnect = (connector) => {
    console.log('Connecting with connector:', connector.name, connector.uid);
    connect({ connector });
    setShowOptions(false);
  };

  useEffect(() => {
    console.log('Available connectors:', connectors.map(c => ({ name: c.name, uid: c.uid, type: c.type })));
  }, [connectors]);

  if (isConnected && address) {
    return (
      <div className="wallet-container">
        <button 
          className="wallet-btn account"
          onClick={() => disconnect()}
        >
          {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} className="ens-avatar" />}
          <span className="wallet-address">
            {ensName ? ensName : shortenAddress(address)}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="wallet-container">
      <button 
        className="wallet-btn connect"
        onClick={() => setShowOptions(!showOptions)}
      >
        Connect Wallet
      </button>
      
      {showOptions && (
        <div className="wallet-options-dropdown">
          {connectors.map((connector) => (
            <WalletOption
              key={connector.uid}
              connector={connector}
              onClick={() => handleConnect(connector)}
              ready={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
