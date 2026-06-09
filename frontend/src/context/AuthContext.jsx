import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const STORAGE_KEY = 'moodi_auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  // TODO: 네이버 로그인 API 연동
  // 현재는 간단한 닉네임 입력 방식의 모킹 로그인
  // 추후 네이버 OAuth2.0 인증 플로우로 교체 예정
  // - 네이버 개발자센터 앱 등록
  // - OAuth 인증 URL로 리다이렉트
  // - 콜백에서 access_token 수신
  // - /v1/nid/me API로 사용자 정보 조회
  const login = (userData) => {
    if (typeof userData === 'string') {
      const mockUser = {
        id: 'moodi_' + Date.now(),
        nickname: userData,
        email: userData.toLowerCase().replace(/\s/g, '') + '@moodi.app',
        profileImage: null,
        platform: '게스트',
      };
      setUser(mockUser);
    } else {
      const naverUser = {
        id: userData.id,
        nickname: userData.nickname,
        email: userData.email,
        profileImage: userData.profile_image,
        platform: '네이버',
      };
      setUser(naverUser);
    }
    setShowLoginModal(false);
  };

  const logout = () => {
    setUser(null);
  };

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn,
      login,
      logout,
      showLoginModal,
      setShowLoginModal,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
