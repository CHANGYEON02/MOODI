import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/sidebar.css';

export default function Sidebar({ isOpen, onClose }) {
  const { user, isLoggedIn } = useAuth();

  const navItems = [
    { to: '/', icon: '🏠', label: 'Home' },
    { to: '/music-mix', icon: '🎛️', label: 'Music Mix' },
    { to: '/library', icon: '📚', label: 'Library' },
  ];

  return (
    <div
      className={`sidebar-overlay${isOpen ? ' open' : ''}`}
      onClick={onClose}
      id="sidebar-overlay"
    >
      <nav
        className="sidebar"
        onClick={(e) => e.stopPropagation()}
        aria-label="메인 네비게이션"
      >
        <div className="sidebar__header">
          <Link
            to="/"
            className="sidebar__logo"
            onClick={onClose}
            style={{ textDecoration: 'none' }}
          >
            Moo<span className="sidebar__logo-accent">DI</span>
          </Link>
          <button
            className="sidebar__close-btn"
            onClick={onClose}
            aria-label="메뉴 닫기"
            type="button"
          >
            ✕
          </button>
        </div>

        <div className="sidebar__nav">
          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar__nav-item${isActive ? ' active' : ''}`
              }
              onClick={onClose}
              end={to === '/'}
            >
              <span className="sidebar__nav-item-icon">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        <div className="sidebar__footer">
          {isLoggedIn ? (
            <>
              <div className="sidebar__user-avatar">
                {user.nickname?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div className="sidebar__user-info">
                <span className="sidebar__user-name">{user.nickname}</span>
                <span className="sidebar__user-platform">{user.platform}</span>
              </div>
            </>
          ) : (
            <span className="sidebar__login-hint">로그인이 필요합니다</span>
          )}
        </div>
      </nav>
    </div>
  );
}
