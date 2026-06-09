import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth-modal.css'; // modal/auth 관련 style 공유 사용

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const effectRan = useRef(false); // React 18 StrictMode double-call 방지

  useEffect(() => {
    // 이미 API 호출이 발생했다면 중복 방지
    if (effectRan.current) return;
    effectRan.current = true;

    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
      setStatus('error');
      setErrorMsg('인가 코드(code)가 존재하지 않습니다.');
      return;
    }

    const authenticateNaver = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/auth/naver`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, state: state || '' }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.detail || '네이버 로그인에 실패했습니다.');
        }

        const profileData = await response.json();
        
        // AuthContext에 로그인 처리 진행
        login(profileData);
        setStatus('success');
        
        // 홈 화면으로 리다이렉트
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1000);

      } catch (err) {
        console.error(err);
        setStatus('error');
        setErrorMsg(err.message || '네이버 인증 서버와 통신하는 중 문제가 발생했습니다.');
      }
    };

    authenticateNaver();
  }, [searchParams, login, navigate]);

  return (
    <div className="login-callback-page" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      color: 'var(--text-primary)',
      fontFamily: 'Noto Sans KR, sans-serif'
    }}>
      <div style={{
        background: 'var(--bg-secondary)',
        padding: '40px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-glow)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '90%'
      }}>
        {status === 'processing' && (
          <>
            <div className="recommendation-loading__spinner" style={{ margin: '0 auto 20px auto', width: '40px', height: '40px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--accent-violet)', borderRadius: '50%', animation: 'spin-slow 1s linear infinite' }} />
            <h3 style={{ fontFamily: 'Gowun Dodum, serif', fontSize: '1.25rem', marginBottom: '10px' }}>네이버로 로그인하는 중</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>네이버로부터 프로필 정보를 안전하게 가져오고 있습니다...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ fontSize: '2.5rem', marginBottom: '15px', color: '#03C75A' }}>✓</div>
            <h3 style={{ fontFamily: 'Gowun Dodum, serif', fontSize: '1.25rem', marginBottom: '10px' }}>로그인 성공!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>MooDI 홈 화면으로 이동합니다.</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>😔</div>
            <h3 style={{ fontFamily: 'Gowun Dodum, serif', fontSize: '1.25rem', marginBottom: '10px', color: '#EF4444' }}>로그인에 실패했습니다</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '24px', lineHeight: '1.5' }}>{errorMsg}</p>
            <button 
              className="auth-modal__btn" 
              onClick={() => navigate('/', { replace: true })}
              style={{ marginTop: '0', display: 'inline-block' }}
            >
              홈으로 돌아가기
            </button>
          </>
        )}
      </div>
    </div>
  );
}
