import { ethers } from 'ethers';

export const CONTRACT_ADDRESS = '0xa163743e196D2328Ce619F6B911ED24B7F42c824';

export const CONTRACT_ABI = [
  'function createStream(address _recipient, address _token, uint256 _ratePerSecond, uint256 _startTime, uint256 _duration) external returns (uint256)',
  'function withdrawFromStream(uint256 _streamId, uint256 _amount) external',
  'function cancelStream(uint256 _streamId) external',
  'function getAvailableBalance(uint256 _streamId) external view returns (uint256)',
  'function getSenderStreams(address _sender) external view returns (uint256[])',
  'function streams(uint256) external view returns (address sender, address recipient, address token, uint256 deposit, uint256 ratePerSecond, uint256 startTime, uint256 stopTime, uint256 withdrawnAmount, bool cancelled)',
  'function nextStreamId() external view returns (uint256)',
  'event StreamCreated(uint256 indexed streamId, address indexed sender, address indexed recipient, address token, uint256 deposit, uint256 ratePerSecond, uint256 startTime, uint256 stopTime)',
  'event StreamWithdrawn(uint256 indexed streamId, address indexed recipient, uint256 amount)',
  'event StreamCancelled(uint256 indexed streamId, address indexed sender, uint256 refundAmount)',
];

export const TEST_TOKENS = {
  ETH: '0x0000000000000000000000000000000000000000',
  USDC: '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582', // Amoy USDC
  DAI: '0xE5504697E323a054Dc83100964D6b2dB04cDE6a7', // Amoy DAI (example)
};

export async function getContract() {
  if (!window.ethereum) {
    throw new Error('No wallet found');
  }
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

export async function getProvider() {
  if (!window.ethereum) {
    throw new Error('No wallet found');
  }
  return new ethers.BrowserProvider(window.ethereum);
}
