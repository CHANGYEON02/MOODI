import { useState, useEffect, useCallback } from 'react';
import MoodiLogo from '../components/MoodiLogo';
import EmotionButtons from '../components/EmotionButtons';
import EmotionInput from '../components/EmotionInput';
import RecommendationResult from '../components/RecommendationResult';
import EmotionCalendar from '../components/EmotionCalendar';
import { fetchRecommendation } from '../api/recommendApi';
import { EMOTIONS } from '../components/EmotionButtons';
import { trackEmotion } from '../utils/emotionHistory';
import '../styles/home.css';

// 감정별 은은한 배경색 (눈 피로 방지를 위해 매우 연한 파스텔 계열)
const EMOTION_BG = {
  joy:     '#fffbeb', // 따뜻한 연한 노란색 (amber-50)
  sadness: '#eff6ff', // 차분한 연한 하늘색 (blue-50)
  anger:   '#fff1f2', // 부드러운 연한 장밋빛 (rose-50)
  tired:   '#f5f3ff', // 나른한 연한 라벤더 (violet-50)
  excited: '#fdf2f8', // 설레는 연한 분홍 (pink-50)
};

export default function HomePage() {
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [detail, setDetail] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  // 캘린더 리렌더 트리거 (감정 기록 시 캘린더가 최신 데이터를 반영하도록)
  const [calendarKey, setCalendarKey] = useState(0);

  // 감정 선택 시 body 배경색 부드럽게 전환
  useEffect(() => {
    if (selectedEmotion && EMOTION_BG[selectedEmotion]) {
      document.body.style.backgroundColor = EMOTION_BG[selectedEmotion];
    } else {
      document.body.style.backgroundColor = '';
    }
    // 페이지 언마운트 시 원래 색으로 복원
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [selectedEmotion]);

  const handleSubmit = useCallback(async () => {
    if (!selectedEmotion && !detail.trim()) return;

    setIsLoading(true);
    setError(false);
    setResult(null);

    try {
      const emotionLabel = selectedEmotion
        ? EMOTIONS.find((e) => e.id === selectedEmotion)?.label || selectedEmotion
        : '';
      const data = await fetchRecommendation(selectedEmotion || emotionLabel, detail);
      setResult(data);
    } catch (err) {
      console.error('추천 API 호출 실패:', err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, [selectedEmotion, detail]);

  const handleEmotionSelect = useCallback((emotionId) => {
    setSelectedEmotion(emotionId);

    if (emotionId) {
      // 감정 기록 저장 + 캘린더 갱신
      trackEmotion(emotionId);
      setCalendarKey((k) => k + 1);

      // 자동 추천 요청
      setIsLoading(true);
      setError(false);
      setResult(null);
      fetchRecommendation(emotionId, detail)
        .then((data) => setResult(data))
        .catch(() => setError(true))
        .finally(() => setIsLoading(false));
    } else {
      // 감정 선택 해제 시 결과 초기화
      setResult(null);
      setError(false);
    }
  }, [detail]);

  const showCalendar = !selectedEmotion && !result && !isLoading && !error;

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

        {/* 아무것도 선택하지 않은 초기 상태: 이번 주 감정 캘린더 표시 */}
        {showCalendar && (
          <EmotionCalendar key={calendarKey} refreshKey={calendarKey} />
        )}
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
