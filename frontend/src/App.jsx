import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ProfileMenu from './components/ProfileMenu';
import LoginModal from './components/LoginModal';
import HomePage from './pages/HomePage';
import LibraryPage from './pages/LibraryPage';
import MusicMixPage from './pages/MusicMixPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="app">
      <Header
        onMenuClick={() => setIsSidebarOpen(true)}
        onProfileClick={() => setIsProfileOpen((prev) => !prev)}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <ProfileMenu
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <LoginModal />

      <main className="app__main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/music-mix" element={<MusicMixPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
    </div>
  );
}
