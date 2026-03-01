import { NavLink } from 'react-router-dom';
import { useAccount, useDisconnect } from 'wagmi';
import ConnectButton from './ConnectButton';
import './NavRail.css';

const navItems = [
  { icon: 'grid', label: 'Dashboard', path: '/dashboard' },
  { icon: 'streams', label: 'Streams', path: '/streams' },
  { icon: 'clock', label: 'Vesting', path: '/vesting' },
];

const icons = {
  grid: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
  streams: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12V7H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16v10a2 2 0 0 1-2 2h-1"></path><path d="M3 15h18v-2H3v1.8c0 1.3.8 2.2 2.2 2.2h.8v-4"></path></svg>,
  clock: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
};

export default function NavRail() {
  const { address, isConnected } = useAccount();

  const shortenAddress = (addr) => {
    if (!addr) return '';
    return addr.slice(0, 6) + '...' + addr.slice(-4);
  };

  return (
    <nav className="nav-rail">
      <div>
        <NavLink to="/" className="nav-logo">
          <span></span>
          Stablestream
        </NavLink>
        <div className="nav-menu">
          {navItems.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {icons[item.icon]}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      <div className="user-profile">
        <div className="user-avatar"></div>
        {isConnected ? (
          <div style={{ flex: 1 }}>
            <div className="user-name">Wallet</div>
            <div className="user-address">{shortenAddress(address)}</div>
          </div>
        ) : (
          <ConnectButton />
        )}
      </div>
    </nav>
  );
}
