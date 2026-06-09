// frontend/src/App.jsx
import React, { useState } from 'react';

// 팀원들이 작업할 컴포넌트 (규칙 6번, 7번 반영)
import EmotionButtons from './components/EmotionButtons';
import EmotionInput from './components/EmotionInput';
import RecommendationResult from './components/RecommendationResult';

// 작성한 API 함수
import { fetchRecommendation } from './api/recommendApi';

function App() {
  // 사용자 입력 상태 관리
  const [emotion, setEmotion] = useState('');
  const [detail, setDetail] = useState('');

  // API 결과 및 UI 상태 관리
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  // 결과 요청 핸들러
  const handleSubmit = async () => {
    if (!emotion) {
      alert('감정을 먼저 선택해주세요!');
      return;
    }

    // 요청 시작 전 초기화
    setIsLoading(true);
    setError(false);
    setResult(null);

    try {
      // 1번 파일에서 만든 함수 호출
      const data = await fetchRecommendation(emotion, detail);
      setResult(data);
    } catch (err) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>감정 맞춤형 추천 서비스</h1>
      
      {/* EmotionButtons: 감정을 선택하는 컴포넌트
        - onSelect prop을 통해 선택된 감정을 App의 상태로 끌어올림
      */}
      <EmotionButtons 
        selectedEmotion={emotion} 
        onSelect={setEmotion} 
      />

      {/* EmotionInput: 상세 내용을 입력하고 제출을 트리거하는 컴포넌트
        - onChange로 텍스트 업데이트, onSubmit으로 API 호출 함수 실행
      */}
      <EmotionInput 
        value={detail} 
        onChange={setDetail} 
        onSubmit={handleSubmit} 
      />

      {/* RecommendationResult: 결과를 보여주는 컴포넌트
      */}
      <RecommendationResult 
        result={result} 
        isLoading={isLoading} 
        error={error} 
      />
    </div>
  );
}

export default App;