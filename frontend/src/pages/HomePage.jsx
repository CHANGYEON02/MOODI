import { useState } from 'react';
import MoodiLogo from '../components/MoodiLogo';
import EmotionButtons from '../components/EmotionButtons';
import EmotionInput from '../components/EmotionInput';
import RecommendationResult from '../components/RecommendationResult';
import { fetchRecommendation } from '../api/recommendApi';
import { EMOTIONS } from '../components/EmotionButtons';
import '../styles/home.css';

export default function HomePage() {
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [detail, setDetail] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async () => {
    if (!selectedEmotion && !detail.trim()) {
      return;
    }

    setIsLoading(true);
    setError(false);
    setResult(null);

    try {
      const emotionLabel = selectedEmotion
        ? EMOTIONS.find(e => e.id === selectedEmotion)?.label || selectedEmotion
        : '';
      const data = await fetchRecommendation(selectedEmotion || emotionLabel, detail);
      setResult(data);
    } catch (err) {
      console.error('추천 API 호출 실패:', err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmotionSelect = (emotionId) => {
    setSelectedEmotion(emotionId);
    // 감정 버튼을 선택하면 자동으로 추천 요청
    if (emotionId) {
      setIsLoading(true);
      setError(false);
      setResult(null);
      const emotionLabel = EMOTIONS.find(e => e.id === emotionId)?.label || emotionId;
      fetchRecommendation(emotionId, detail)
        .then(data => setResult(data))
        .catch(() => setError(true))
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <div className="home-page" id="home-page">
      <div className="home-page__content">
        <MoodiLogo />
        <EmotionButtons
          selectedEmotion={selectedEmotion}
          onSelectEmotion={handleEmotionSelect}
        />
        <EmotionInput
          value={detail}
          onChange={setDetail}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>

      {(result || isLoading || error) && (
        <div className="home-page__recommendation">
          <RecommendationResult
            result={result}
            isLoading={isLoading}
            error={error}
            selectedEmotion={selectedEmotion}
          />
        </div>
      )}
    </div>
  );
}
