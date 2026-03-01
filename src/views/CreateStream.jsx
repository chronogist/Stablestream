import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from 'wagmi';
import { ethers } from 'ethers';
import NavRail from '../components/NavRail';
import SuccessModal from '../components/SuccessModal';
import { CONTRACT_ADDRESS, CONTRACT_ABI, TEST_TOKENS } from '../config/contract';
import './CreateStream.css';

const POLYGON_AMOY_CHAIN_ID = 80002;

const tokens = [
  { symbol: 'ETH', name: 'Ethereum', borderColor: '#CF8BF3', color: '#CF8BF3', address: TEST_TOKENS.ETH, decimals: 18 },
  { symbol: 'USDC', name: 'USD Coin', borderColor: '#2775CA', color: '#2775CA', address: TEST_TOKENS.USDC, decimals: 6 },
  { symbol: 'DAI', name: 'Dai Stablecoin', borderColor: '#F3BA2F', color: '#F3BA2F', address: TEST_TOKENS.DAI, decimals: 18 },
];

const ERC20_ABI = [
  { name: 'approve', type: 'function', inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ name: '', type: 'bool' }], stateMutability: 'nonpayable' },
  { name: 'allowance', type: 'function', inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view' },
  { name: 'balanceOf', type: 'function', inputs: [{ name: 'account', type: 'address' }], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view' },
];

export default function CreateStream() {
  const navigate = useNavigate();
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { data: hash, writeContract, writeContractAsync, isPending: isWriting, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ 
    hash 
  });

  const [selectedToken, setSelectedToken] = useState(0);
  const [totalAmount, setTotalAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [streamLabel, setStreamLabel] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [approvalNeeded, setApprovalNeeded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const currentToken = tokens[selectedToken];
  const amount = parseFloat(totalAmount) || 0;
  
  const calculateDuration = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate).getTime() / 1000;
    const end = new Date(endDate).getTime() / 1000;
    return end > start ? end - start : 0;
  };

  const duration = calculateDuration();
  const ratePerSec = duration > 0 ? amount / duration : 0;
  const total = amount.toFixed(4);
  const monthlyBurn = (ratePerSec * 86400 * 30).toFixed(4);
  const gasEstimate = '0.004';
  const totalLockup = (parseFloat(total) + parseFloat(gasEstimate)).toFixed(3);
  const usdValue = `~$${(parseFloat(totalLockup) * 2500).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  useEffect(() => {
    console.log('Chain ID:', chainId, 'Hex:', chainId?.toString(16));
  }, [chainId]);

  const isWrongNetwork = chainId !== POLYGON_AMOY_CHAIN_ID;

  const handleApprove = async () => {
    if (isWrongNetwork) {
      await switchChain({ chainId: POLYGON_AMOY_CHAIN_ID });
      return;
    }
    
    try {
      const totalInWei = BigInt(Math.round(amount * 10 ** currentToken.decimals));
      await writeContractAsync({
        address: currentToken.address,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [CONTRACT_ADDRESS, totalInWei],
      });
    } catch (err) {
      console.error('Approval error:', err);
      setError(err.message || 'Failed to approve token');
    }
  };

  const createStream = () => {
    if (isWrongNetwork) {
      switchChain({ chainId: POLYGON_AMOY_CHAIN_ID });
      return;
    }
    
    setError('');
    
    if (!isConnected) {
      setError('Please connect your wallet');
      return;
    }

    if (!recipient || !ethers.isAddress(recipient)) {
      setError('Please enter a valid recipient address');
      return;
    }

    if (duration <= 0) {
      setError('Please select valid start and end dates');
      return;
    }

    if (amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      const tokenAddress = currentToken.address;
      const startTime = Math.floor(new Date(startDate).getTime() / 1000);
      const ratePerSecond = amount / duration;
      
      const rateInWei = BigInt(Math.round(ratePerSecond * 10 ** currentToken.decimals));
      
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'createStream',
        args: [
          recipient,
          tokenAddress,
          rateInWei,
          startTime,
          BigInt(duration)
        ],
      });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to create stream');
    }
  };

  useEffect(() => {
    if (isSuccess && !showSuccess) {
      const formattedEndDate = endDate ? new Date(endDate).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }) : '';
      
      setSuccessData({
        tokenSymbol: currentToken.symbol,
        totalAmount: totalAmount,
        recipient: recipient,
        flowRate: ratePerSec.toFixed(6),
        endDate: formattedEndDate,
      });
      setShowSuccess(true);
    }
  }, [isSuccess, showSuccess, currentToken.symbol, totalAmount, recipient, ratePerSec, endDate]);

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    navigate('/streams');
  };

  return (
    <div className="create-stream-page">
      <div className="noise-texture"></div>
      <NavRail />
      <main className="workspace">
        <div className="setup-container">
          <Link to="/streams" className="back-link">
            ← Back to Streams
          </Link>
          
          <header className="setup-header">
            <h1>New Stream Setup</h1>
            <p>Configure real-time automated outflows to any wallet.</p>
          </header>

          {!isConnected && (
            <div style={{ 
              padding: '12px 16px', 
              background: 'rgba(246, 80, 100, 0.1)', 
              border: '1px solid #F65064',
              borderRadius: '8px',
              marginBottom: '24px',
              color: '#F65064',
              fontSize: '14px'
            }}>
              Please connect your wallet to create a stream
            </div>
          )}

          {isWrongNetwork && isConnected && (
            <div style={{ 
              padding: '12px 16px', 
              background: 'rgba(246, 165, 47, 0.1)', 
              border: '1px solid #FBA52F',
              borderRadius: '8px',
              marginBottom: '24px',
              color: '#FBA52F',
              fontSize: '14px'
            }}>
              Wrong network. Please switch to Polygon Amoy testnet to continue.
            </div>
          )}

          {error && (
            <div style={{ 
              padding: '12px 16px', 
              background: 'rgba(246, 80, 100, 0.1)', 
              border: '1px solid #F65064',
              borderRadius: '8px',
              marginBottom: '24px',
              color: '#F65064',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          {writeError && (
            <div style={{ 
              padding: '12px 16px', 
              background: 'rgba(246, 80, 100, 0.1)', 
              border: '1px solid #F65064',
              borderRadius: '8px',
              marginBottom: '24px',
              color: '#F65064',
              fontSize: '14px'
            }}>
              {writeError.message}
            </div>
          )}

          {isConfirming && (
            <div style={{ 
              padding: '12px 16px', 
              background: 'rgba(0, 255, 148, 0.1)', 
              border: '1px solid #00FF94',
              borderRadius: '8px',
              marginBottom: '24px',
              color: '#00FF94',
              fontSize: '14px'
            }}>
              Transaction pending... Please wait
            </div>
          )}

          <div className="config-grid">
            <div className="setup-card">
              <div className="form-section">
                <label className="form-label">Select Asset</label>
                <div className="token-selector">
                  {tokens.map((token, idx) => (
                    <div
                      key={idx}
                      className={`token-opt ${selectedToken === idx ? 'selected' : ''}`}
                      onClick={() => setSelectedToken(idx)}
                    >
                      <div
                        className="token-sq"
                        style={{ border: `1px solid ${token.color}`, color: token.color }}
                      >
                        {token.symbol}
                      </div>
                      <span className="token-opt-label">{token.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <label className="form-label">Recipient Details</label>
                <div className="input-group">
                  <label>WALLET ADDRESS</label>
                  <input 
                    type="text" 
                    placeholder="0x..." 
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>STREAM LABEL (OPTIONAL)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Developer Retainer"
                    value={streamLabel}
                    onChange={(e) => setStreamLabel(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-section">
                <label className="form-label">Flow Configuration</label>
                <div className="input-group">
                  <label>TOTAL AMOUNT ({currentToken.symbol})</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="100"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                  />
                </div>
                <div className="date-row">
                  <div className="input-group">
                    <label>START DATE</label>
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label>END DATE</label>
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="preview-side">
              <div className="preview-card">
                <div className="preview-stat">
                  <div className="lbl">Calculated Rate</div>
                  <div className="val accent">{ratePerSec.toFixed(6)} {currentToken.symbol}/s</div>
                </div>

                <div className="preview-stat">
                  <div className="lbl">Total Amount</div>
                  <div className="val">{total} {currentToken.symbol}</div>
                </div>

                <div className="cost-breakdown">
                  <div className="breakdown-row">
                    <span>Monthly burn</span>
                    <span className="val-mono">{monthlyBurn} {currentToken.symbol}</span>
                  </div>
                  <div className="breakdown-row">
                    <span>Gas estimation</span>
                    <span className="val-mono">{gasEstimate} MATIC</span>
                  </div>
                  <div className="total-row">
                    <span>Total Lockup</span>
                    <span className="val-mono">{totalLockup} {currentToken.symbol}</span>
                  </div>
                  <div className="gas-note">
                    {usdValue} USD at current market price
                  </div>
                </div>

                {currentToken.symbol !== 'ETH' && (
                  <button 
                    className="submit-btn secondary" 
                    onClick={handleApprove}
                    disabled={isWriting || isConfirming || !isConnected || !amount || isWrongNetwork}
                  >
                    {isWrongNetwork ? 'Switch Network' : isWriting ? 'Approving...' : `Approve ${currentToken.symbol}`}
                  </button>
                )}

                <button 
                  className="submit-btn" 
                  onClick={createStream}
                  disabled={isWriting || isConfirming || !isConnected || isWrongNetwork}
                >
                  {isWrongNetwork ? 'Switch Network' : isWriting || isConfirming ? 'Processing...' : 'Initialize Stream'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SuccessModal 
        isOpen={showSuccess} 
        onClose={handleCloseSuccess}
        streamData={successData}
      />
    </div>
  );
}
