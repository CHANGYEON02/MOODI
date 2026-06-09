// frontend/src/components/RecommendationResult.jsx
import React from 'react';
// 규칙 7: CSS 파일은 각자 따로 만들기 (디자인 작업 시 아래 파일을 생성해 주세요)
// import './RecommendationResult.css'; 

const RecommendationResult = ({ result, isLoading, error }) => {
  // 요구사항 4: 로딩 중 처리
  if (isLoading) {
    return <div className="loading-message">추천을 생성하는 중...</div>;
  }

  // 요구사항 5: 에러 발생 처리
  if (error) {
    return <div className="error-message">추천을 불러오지 못했습니다.</div>;
  }

  // 아직 요청 전이거나 결과가 없을 때
  if (!result) {
    return null; 
  }

  // 공통 규칙 3: 응답 데이터 형식에 맞춘 렌더링
  return (
    <div className="recommendation-result">
      <h2 className="result-summary">{result.summary}</h2>
      
      <p className="result-comfort">"{result.comfort}"</p>
      
      <div className="result-recommendations">
        <h3>이렇게 해보는 건 어떨까요?</h3>
        <ul>
          {result.recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>

      {/* warning 항목이 있을 경우에만 렌더링 */}
      {result.warning && (
        <p className="result-warning">⚠️ {result.warning}</p>
      )}
    </div>
  );
};

export default RecommendationResult;