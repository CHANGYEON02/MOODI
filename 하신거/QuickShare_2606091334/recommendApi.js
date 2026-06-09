// frontend/src/api/recommendApi.js

/**
 * 백엔드 API에 감정 데이터를 보내고 추천 결과를 받아오는 함수
 * @param {string} emotion - 선택된 감정 (예: "불안")
 * @param {string} detail - 상세 내용 (예: "발표 준비 때문에 긴장되고 잠이 안 온다")
 * @returns {Promise<Object>} 응답 데이터 { summary, comfort, recommendations, warning }
 */
export const fetchRecommendation = async (emotion, detail) => {
  try {
    const response = await fetch('/api/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // 공통 규칙 2: 요청 데이터는 { emotion, detail } 형식으로 통일
      body: JSON.stringify({ emotion, detail }), 
    });

    if (!response.ok) {
      throw new Error('API 서버 응답에 문제가 발생했습니다.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('추천 API 호출 중 오류 발생:', error);
    throw error;
  }
};