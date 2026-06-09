import '../styles/music-mix.css';

export default function MusicMixPage() {
  return (
    <div className="music-mix-page" id="music-mix-page">
      <div className="music-mix-page__placeholder">
        <div className="music-mix-page__icon">🎛️</div>
        <h1 className="music-mix-page__title">Music Mix</h1>
        <p className="music-mix-page__desc">
          좋아하는 음악의 분위기를 바꿔보세요.
          <br />
          더 잔잔하게, 더 신나게, 더 몽환적으로 —
          <br />
          AI가 새로운 음악 경험을 만들어드릴게요.
        </p>
        <span className="music-mix-page__badge">
          🚀 Coming Soon
        </span>
        <div className="music-mix-page__features">
          <div className="music-mix-page__feature">
            <span className="music-mix-page__feature-icon">🎹</span>
            <span>더 잔잔하게</span>
          </div>
          <div className="music-mix-page__feature">
            <span className="music-mix-page__feature-icon">🎸</span>
            <span>더 신나게</span>
          </div>
          <div className="music-mix-page__feature">
            <span className="music-mix-page__feature-icon">✨</span>
            <span>더 몽환적으로</span>
          </div>
          <div className="music-mix-page__feature">
            <span className="music-mix-page__feature-icon">📖</span>
            <span>집중용으로</span>
          </div>
          <div className="music-mix-page__feature">
            <span className="music-mix-page__feature-icon">💝</span>
            <span>위로받는 느낌으로</span>
          </div>
        </div>
      </div>
    </div>
  );
}
