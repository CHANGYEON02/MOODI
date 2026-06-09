// Mock data with real YouTube video IDs for thumbnails (used as fallback)
const MOCK_RECOMMENDATIONS = {
  joy: {
    emotion_summary: '기쁘고 즐거운 기분이시군요! 밝은 에너지를 더해줄 음악을 골라봤어요.',
    caution_note: '음악 추천은 감정 상태에 대한 진단이 아닌, 분위기에 맞는 제안입니다.',
    recommendations: [
      { title: 'Dynamite', artist: 'BTS', reason: '밝고 에너지 넘치는 팝 사운드가 기쁜 기분을 더해줄 거예요', youtube: { url: 'https://www.youtube.com/watch?v=gdZLi9oWNZg', video_id: 'gdZLi9oWNZg' }, image: 'https://img.youtube.com/vi/gdZLi9oWNZg/mqdefault.jpg' },
      { title: 'Permission to Dance', artist: 'BTS', reason: '춤추고 싶어지는 리듬이 즐거운 순간에 딱이에요', youtube: { url: 'https://www.youtube.com/watch?v=CuklIb9d3fI', video_id: 'CuklIb9d3fI' }, image: 'https://img.youtube.com/vi/CuklIb9d3fI/mqdefault.jpg' },
      { title: 'Supernova', artist: 'aespa', reason: '강렬하고 신나는 비트가 기분을 한층 업시켜줄 거예요', youtube: { url: 'https://www.youtube.com/watch?v=pClGmI_jHOQ', video_id: 'pClGmI_jHOQ' }, image: 'https://img.youtube.com/vi/pClGmI_jHOQ/mqdefault.jpg' },
      { title: 'Love Lee', artist: 'AKMU', reason: '사랑스럽고 따뜻한 멜로디가 행복한 순간을 더 빛나게 해줘요', youtube: { url: 'https://www.youtube.com/watch?v=4bZ2N2eFV1w', video_id: '4bZ2N2eFV1w' }, image: 'https://img.youtube.com/vi/4bZ2N2eFV1w/mqdefault.jpg' },
    ]
  },
  sadness: {
    emotion_summary: '슬프고 가라앉은 기분이시군요. 마음을 다독여줄 음악을 준비했어요.',
    caution_note: '음악 추천은 감정 상태에 대한 진단이 아닌, 분위기에 맞는 제안입니다.',
    recommendations: [
      { title: '사랑은 늘 도망가', artist: '임영웅', reason: '잔잔한 발라드가 슬픈 마음을 부드럽게 감싸줄 거예요', youtube: { url: 'https://www.youtube.com/watch?v=YGMOuEhp0s4', video_id: 'YGMOuEhp0s4' }, image: 'https://img.youtube.com/vi/YGMOuEhp0s4/mqdefault.jpg' },
      { title: '봄날', artist: 'BTS', reason: '그리움과 위로가 담긴 가사가 마음에 닿을 거예요', youtube: { url: 'https://www.youtube.com/watch?v=xEeFrLSkMm8', video_id: 'xEeFrLSkMm8' }, image: 'https://img.youtube.com/vi/xEeFrLSkMm8/mqdefault.jpg' },
      { title: '밤편지', artist: '아이유', reason: '고요한 밤에 듣기 좋은 따뜻한 멜로디예요', youtube: { url: 'https://www.youtube.com/watch?v=BzYnNdChW0g', video_id: 'BzYnNdChW0g' }, image: 'https://img.youtube.com/vi/BzYnNdChW0g/mqdefault.jpg' },
      { title: '눈의 꽃', artist: '박효신', reason: '서정적인 보컬이 슬픈 감정을 부드럽게 풀어줄 거예요', youtube: { url: 'https://www.youtube.com/watch?v=OgTAKx-oRgU', video_id: 'OgTAKx-oRgU' }, image: 'https://img.youtube.com/vi/OgTAKx-oRgU/mqdefault.jpg' },
    ]
  },
  anger: {
    emotion_summary: '화가 나고 스트레스가 쌓인 상태시군요. 감정을 해소할 수 있는 음악을 골라봤어요.',
    caution_note: '음악 추천은 감정 상태에 대한 진단이 아닌, 분위기에 맞는 제안입니다.',
    recommendations: [
      { title: 'FIRE', artist: 'BTS', reason: '강렬한 비트로 쌓인 스트레스를 시원하게 날려버려요', youtube: { url: 'https://www.youtube.com/watch?v=4ujQOR2DMFM', video_id: '4ujQOR2DMFM' }, image: 'https://img.youtube.com/vi/4ujQOR2DMFM/mqdefault.jpg' },
      { title: 'Kill This Love', artist: 'BLACKPINK', reason: '파워풀한 사운드가 화난 감정을 분출시켜줘요', youtube: { url: 'https://www.youtube.com/watch?v=2S24-y0Ij3Y', video_id: '2S24-y0Ij3Y' }, image: 'https://img.youtube.com/vi/2S24-y0Ij3Y/mqdefault.jpg' },
      { title: 'TOMBOY', artist: '(G)I-DLE', reason: '당당하고 강한 에너지가 분노를 건강하게 표현해줘요', youtube: { url: 'https://www.youtube.com/watch?v=Jh4QFaPmdss', video_id: 'Jh4QFaPmdss' }, image: 'https://img.youtube.com/vi/Jh4QFaPmdss/mqdefault.jpg' },
      { title: 'Ditto', artist: 'NewJeans', reason: '중독성 있는 리듬이 기분 전환에 도움을 줄 거예요', youtube: { url: 'https://www.youtube.com/watch?v=pSUydWEqKwE', video_id: 'pSUydWEqKwE' }, image: 'https://img.youtube.com/vi/pSUydWEqKwE/mqdefault.jpg' },
    ]
  },
  tired: {
    emotion_summary: '피곤하고 지친 상태시군요. 편안하게 쉴 수 있는 음악을 골라봤어요.',
    caution_note: '음악 추천은 감정 상태에 대한 진단이 아닌, 분위기에 맞는 제안입니다.',
    recommendations: [
      { title: 'Blueming', artist: '아이유', reason: '잔잔하면서도 몽환적인 분위기가 피로를 풀어줘요', youtube: { url: 'https://www.youtube.com/watch?v=D1PvIWdJ8xo', video_id: 'D1PvIWdJ8xo' }, image: 'https://img.youtube.com/vi/D1PvIWdJ8xo/mqdefault.jpg' },
      { title: '좋니', artist: '윤종신', reason: '편안한 목소리가 지친 마음을 다독여줄 거예요', youtube: { url: 'https://www.youtube.com/watch?v=k-UGeFa11eg', video_id: 'k-UGeFa11eg' }, image: 'https://img.youtube.com/vi/k-UGeFa11eg/mqdefault.jpg' },
      { title: 'Still Life', artist: 'BIGBANG', reason: '차분하고 깊은 멜로디가 쉬어가는 시간에 어울려요', youtube: { url: 'https://www.youtube.com/watch?v=dP_CApOb6CE', video_id: 'dP_CApOb6CE' }, image: 'https://img.youtube.com/vi/dP_CApOb6CE/mqdefault.jpg' },
      { title: '에잇', artist: '아이유 (Prod. SUGA)', reason: '나지막한 멜로디가 평온한 휴식을 선사해줘요', youtube: { url: 'https://www.youtube.com/watch?v=TgOu00Mf3kI', video_id: 'TgOu00Mf3kI' }, image: 'https://img.youtube.com/vi/TgOu00Mf3kI/mqdefault.jpg' },
    ]
  },
  excited: {
    emotion_summary: '설레고 두근거리는 기분이시군요! 그 감정을 더 빛나게 할 음악이에요.',
    caution_note: '음악 추천은 감정 상태에 대한 진단이 아닌, 분위기에 맞는 제안입니다.',
    recommendations: [
      { title: 'Hype Boy', artist: 'NewJeans', reason: '풋풋하고 설레는 분위기가 두근거림에 딱 맞아요', youtube: { url: 'https://www.youtube.com/watch?v=11cta61wi0g', video_id: '11cta61wi0g' }, image: 'https://img.youtube.com/vi/11cta61wi0g/mqdefault.jpg' },
      { title: 'Magnetic', artist: 'ILLIT', reason: '몽환적이면서 설레는 분위기의 음악이에요', youtube: { url: 'https://www.youtube.com/watch?v=Vk5-c_v4gMU', video_id: 'Vk5-c_v4gMU' }, image: 'https://img.youtube.com/vi/Vk5-c_v4gMU/mqdefault.jpg' },
      { title: 'Super Shy', artist: 'NewJeans', reason: '수줍으면서 설레는 감정을 표현하는 노래예요', youtube: { url: 'https://www.youtube.com/watch?v=ArmDp-zijuc', video_id: 'ArmDp-zijuc' }, image: 'https://img.youtube.com/vi/ArmDp-zijuc/mqdefault.jpg' },
      { title: 'LOVE DIVE', artist: 'IVE', reason: '매력적인 멜로디가 설레는 기분을 배로 만들어줘요', youtube: { url: 'https://www.youtube.com/watch?v=Y8JFxS1HlDo', video_id: 'Y8JFxS1HlDo' }, image: 'https://img.youtube.com/vi/Y8JFxS1HlDo/mqdefault.jpg' },
    ]
  }
};

const DEFAULT_MOCK = {
  emotion_summary: '입력하신 감정을 분석해 어울리는 음악을 찾아봤어요.',
  caution_note: '음악 추천은 감정 상태에 대한 진단이 아닌, 분위기에 맞는 제안입니다.',
  recommendations: [
    { title: 'Butter', artist: 'BTS', reason: '부드럽고 중독성 있는 멜로디가 기분 전환에 좋아요', youtube: { url: 'https://www.youtube.com/watch?v=WMweEpGlu_U', video_id: 'WMweEpGlu_U' }, image: 'https://img.youtube.com/vi/WMweEpGlu_U/mqdefault.jpg' },
    { title: 'Celebrity', artist: '아이유', reason: '밝고 경쾌한 분위기가 마음을 환하게 해줘요', youtube: { url: 'https://www.youtube.com/watch?v=0-q1KafFCLU', video_id: '0-q1KafFCLU' }, image: 'https://img.youtube.com/vi/0-q1KafFCLU/mqdefault.jpg' },
    { title: 'Attention', artist: 'NewJeans', reason: '트렌디하면서도 편안한 사운드예요', youtube: { url: 'https://www.youtube.com/watch?v=js1CtxSY38I', video_id: 'js1CtxSY38I' }, image: 'https://img.youtube.com/vi/js1CtxSY38I/mqdefault.jpg' },
    { title: '좋은 날', artist: '아이유', reason: '밝은 에너지가 기분을 전환시켜줄 거예요', youtube: { url: 'https://www.youtube.com/watch?v=jeqdYqsNLsQ', video_id: 'jeqdYqsNLsQ' }, image: 'https://img.youtube.com/vi/jeqdYqsNLsQ/mqdefault.jpg' },
  ]
};

const EMOTION_MAP = {
  joy: '기쁨',
  sadness: '슬픔',
  anger: '화남',
  tired: '피곤함',
  excited: '설렘'
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const fetchRecommendation = async (emotion, detail) => {
  // Convert API emotion key to Korean text if it matches EMOTION_MAP
  const reqEmotion = EMOTION_MAP[emotion] || emotion;

  try {
    const response = await fetch(`${API_BASE_URL}/api/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emotion: reqEmotion,
        detail: detail || ''
      }),
    });

    if (!response.ok) {
      throw new Error(`API response error: ${response.status}`);
    }

    const data = await response.json();

    // If API succeeds but recommendations list is empty (e.g. no API keys configured on backend)
    // fallback to local mock data to guarantee a working demo.
    if (!data.recommendations || data.recommendations.length === 0) {
      console.warn("Backend returned empty recommendations. Falling back to mock data.");
      return getFallbackData(emotion);
    }

    // Adapt backend response fields if needed
    const mappedRecommendations = data.recommendations.map(track => ({
      ...track,
      image: track.spotify?.image || track.image || (track.youtube?.video_id ? `https://img.youtube.com/vi/${track.youtube.video_id}/mqdefault.jpg` : null)
    }));

    return {
      ...data,
      recommendations: mappedRecommendations
    };

  } catch (error) {
    console.error("Failed to fetch from backend API. Falling back to mock data:", error);
    // Simulate natural API delay on fallback to match UI loading spinner feeling
    await new Promise(resolve => setTimeout(resolve, 800));
    return getFallbackData(emotion);
  }
};

const getFallbackData = (emotion) => {
  if (emotion && MOCK_RECOMMENDATIONS[emotion]) {
    return MOCK_RECOMMENDATIONS[emotion];
  }
  return DEFAULT_MOCK;
};
