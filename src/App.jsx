import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Web3Provider from './components/Web3Provider';
import PageTransition from './components/PageTransition';
import Landing from './views/Landing';
import Dashboard from './views/Dashboard';
import Streams from './views/Streams';
import Vesting from './views/Vesting';
import CreateStream from './views/CreateStream';

function App() {
  return (
    <Web3Provider>
      <BrowserRouter>
        <Routes>
          <Route element={<PageTransition />}>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/streams" element={<Streams />} />
            <Route path="/streams/create" element={<CreateStream />} />
            <Route path="/vesting" element={<Vesting />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Web3Provider>
  );
}

export default App;
