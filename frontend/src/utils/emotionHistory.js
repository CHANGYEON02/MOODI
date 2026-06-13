// 감정 기록을 localStorage에 저장/조회하는 유틸리티

const HISTORY_KEY = 'moodi_emotion_history';
const MAX_ENTRIES = 365; // 최대 1년치 보관

/**
 * 선택된 감정을 오늘 날짜와 함께 기록
 * @param {string} emotionId
 */
export function trackEmotion(emotionId) {
  try {
    const today = new Date();
    const dateStr = formatDate(today);

    const stored = localStorage.getItem(HISTORY_KEY);
    const history = stored ? JSON.parse(stored) : [];

    // 같은 날 같은 감정은 중복 저장 방지
    const alreadyToday = history.some(
      (e) => e.date === dateStr && e.emotionId === emotionId
    );
    if (!alreadyToday) {
      history.push({ emotionId, date: dateStr });
    }

    // 최대 항목 수 초과 시 오래된 것부터 제거
    const trimmed = history.slice(-MAX_ENTRIES);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage 사용 불가 환경에서 무시
  }
}

/**
 * 전체 감정 기록 반환
 * @returns {Array<{emotionId: string, date: string}>}
 */
export function getEmotionHistory() {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Date 객체를 'YYYY-MM-DD' 문자열로 변환
 * @param {Date} date
 * @returns {string}
 */
export function formatDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/**
 * 이번 주(월~일) 날짜 배열 반환
 * @returns {Date[]}
 */
export function getThisWeekDates() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=일, 1=월, ..., 6=토
  // 월요일을 시작으로 조정
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}
