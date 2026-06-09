import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/auth-modal.css';

export default function LoginModal() {
  const { showLoginModal, setShowLoginModal, login } = useAuth();
  const [nickname, setNickname] = useState('');

  if (!showLoginModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nickname.trim()) {
      login(nickname.trim());
      setNickname('');
    }
  };

  const handleClose = () => {
    setShowLoginModal(false);
    setNickname('');
  };

  const handleNaverLogin = () => {
    const clientId = 'qXIXfKqpyGTB9weoj_Cd';
    const currentOrigin = window.location.origin;
    const redirectUri = encodeURIComponent(`${currentOrigin}/login`);
    const state = 'moodi_naver_state_1234';
    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;
    window.location.href = naverAuthUrl;
  };

  return (
    <div className="auth-modal-overlay" onClick={handleClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="auth-modal__close"
          onClick={handleClose}
          aria-label="닫기"
          type="button"
        >
          ✕
        </button>

        <h2 className="auth-modal__title">MooDI에 오신 것을 환영해요 🎵</h2>
        <p className="auth-modal__desc">
          닉네임을 입력하고 나만의 라이브러리를 시작하세요
        </p>

        <form onSubmit={handleSubmit}>
          <input
            className="auth-modal__input"
            type="text"
            placeholder="닉네임을 입력하세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={20}
            autoFocus
            id="login-nickname-input"
          />
          <button
            className="auth-modal__btn"
            type="submit"
            disabled={!nickname.trim()}
            id="login-submit-btn"
          >
            시작하기
          </button>
        </form>

        <div className="auth-modal__divider">또는</div>
        
        <button className="auth-modal__naver-btn" onClick={handleNaverLogin} type="button">
          <span className="auth-modal__naver-logo">N</span> 네이버 로그인
        </button>
      </div>
    </div>
  );
}
