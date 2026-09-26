import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Nav, NavLink } from '@/lib/ui/Nav';
import { Container } from '@/lib/ui/Container';
import { Timer as TimerIcon, History as HistoryIcon } from 'lucide-react';
import TimerPage from '@/pages/TimerPage';
import HistoryPage from '@/pages/HistoryPage';

function AppNav() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <Nav brand={<span>Focusly</span>}>
      <NavLink
        href="/"
        active={location.pathname === '/'}
        onClick={(e) => {
          e.preventDefault();
          navigate('/');
        }}
      >
        <TimerIcon size={14} className="mr-2" />
        Timer
      </NavLink>
      <NavLink
        href="/history"
        active={location.pathname === '/history'}
        onClick={(e) => {
          e.preventDefault();
          navigate('/history');
        }}
      >
        <HistoryIcon size={14} className="mr-2" />
        History
      </NavLink>
    </Nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <AppNav />
        <main className="py-8">
          <Container>
            <Routes>
              <Route path="/" element={<TimerPage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Routes>
          </Container>
        </main>
      </div>
    </BrowserRouter>
  );
}
