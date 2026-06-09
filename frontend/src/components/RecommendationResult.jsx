import MusicCard from './MusicCard';
import '../styles/music-card.css';

export default function RecommendationResult({ result, isLoading, error, selectedEmotion }) {
  if (isLoading) {
    return (
      <div className="recommendation-section">
        <div className="recommendation-loading">
          <div className="recommendation-loading__spinner" />
          <p className="recommendation-loading__text">
            AI가 당신의 감정에 맞는 음악을 찾고 있어요...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendation-section">
        <div className="recommendation-error">
          <span className="recommendation-error__icon">😔</span>
          <p className="recommendation-error__text">
            추천을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
          </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="recommendation-section">
      <div className="recommendation-header">
        <h2 className="recommendation-title">🎧 오늘의 MooDI 추천</h2>
        <p className="recommendation-summary">{result.emotion_summary}</p>
        {result.caution_note && (
          <p className="recommendation-caution">{result.caution_note}</p>
        )}
      </div>

      <div className="music-cards-grid">
        {result.recommendations.map((track, index) => (
          <MusicCard
            key={`${track.title}-${index}`}
            track={track}
            emotionTag={selectedEmotion}
          />
        ))}
      </div>
    </div>
  );
}
