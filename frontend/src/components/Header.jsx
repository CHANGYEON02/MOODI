import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/header.css';

export default function Header({ onMenuClick, onProfileClick }) {
  return (
    <header className="header" id="main-header">
      <button
        className="header__menu-btn"
        onClick={onMenuClick}
        aria-label="메뉴 열기"
        type="button"
        id="hamburger-menu-btn"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <div className="header__logo">
        <span className="header__logo-text">Moo<span className="header__logo-accent">DI</span></span>
      </div>

      <button
        className="header__profile-btn"
        onClick={onProfileClick}
        aria-label="프로필 메뉴"
        type="button"
        id="profile-menu-btn"
      >
        <ProfileIcon />
      </button>
    </header>
  );
}

function ProfileIcon() {
  const { user } = useAuth();
  
  if (user?.profileImage) {
    return <img src={user.profileImage} alt="프로필" />;
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  );
}
