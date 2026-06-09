import { useAuth } from '../context/AuthContext';
import '../styles/profile-menu.css';

export default function ProfileMenu({ isOpen, onClose }) {
  const { user, isLoggedIn, logout, setShowLoginModal } = useAuth();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    setShowLoginModal(true);
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      <div className="profile-menu-overlay" onClick={onClose} />
      <div className="profile-menu" id="profile-dropdown">
        {isLoggedIn ? (
          <>
            <div className="profile-menu__user">
              <div className="profile-menu__avatar">
                {user.nickname?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div>
                <div className="profile-menu__name">{user.nickname}</div>
                <div className="profile-menu__email">{user.email}</div>
              </div>
            </div>
            <div className="profile-menu__divider" />
            {/* TODO: 프로필 변경 기능 구현 */}
            <button className="profile-menu__item" onClick={onClose} type="button">
              <span>👤</span> 프로필 변경
            </button>
            {/* TODO: 설정 변경 기능 구현 */}
            <button className="profile-menu__item" onClick={onClose} type="button">
              <span>⚙️</span> 설정 변경
            </button>
            <div className="profile-menu__divider" />
            <button
              className="profile-menu__item profile-menu__item--danger"
              onClick={handleLogout}
              type="button"
            >
              <span>🚪</span> 로그아웃
            </button>
          </>
        ) : (
          <>
            <div className="profile-menu__user">
              <div className="profile-menu__avatar">?</div>
              <div>
                <div className="profile-menu__name">게스트</div>
                <div className="profile-menu__email">로그인이 필요합니다</div>
              </div>
            </div>
            <div className="profile-menu__divider" />
            <button
              className="profile-menu__item"
              onClick={handleLogin}
              type="button"
            >
              <span>🔑</span> 로그인
            </button>
          </>
        )}
      </div>
    </>
  );
}
