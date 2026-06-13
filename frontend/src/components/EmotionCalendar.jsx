import { useMemo } from 'react';
import { getEmotionHistory, formatDate, getThisWeekDates } from '../utils/emotionHistory';
import '../styles/emotion-calendar.css';

const EMOTIONS_INFO = {
  joy:     { emoji: '☀️', label: '기쁨',   color: '#F59E0B' },
  sadness: { emoji: '🌧️', label: '슬픔',   color: '#3B82F6' },
  anger:   { emoji: '🔥', label: '화남',   color: '#EF4444' },
  tired:   { emoji: '🌙', label: '피곤함', color: '#8B5CF6' },
  excited: { emoji: '💖', label: '설렘',   color: '#EC4899' },
};

const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

/**
 * 이번 주 감정 기록을 캘린더 형태로 보여주는 컴포넌트
 * @param {{ refreshKey?: number }} props
 */
export default function EmotionCalendar({ refreshKey }) {
  const weekDates = useMemo(() => getThisWeekDates(), []);
  const todayStr = useMemo(() => formatDate(new Date()), []);

  // refreshKey가 바뀔 때 history를 다시 읽어옴 (memo deps에 포함)
  const byDate = useMemo(() => {
    const history = getEmotionHistory();
    const map = {};
    history.forEach(({ emotionId, date }) => {
      if (!map[date]) map[date] = [];
      if (!map[date].includes(emotionId)) {
        map[date].push(emotionId);
      }
    });
    return map;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return (
    <div className="emotion-calendar" aria-label="이번 주 감정 캘린더">
      <h3 className="emotion-calendar__title">
        <span>📅</span> 이번 주 감정 기록
      </h3>

      <div className="emotion-calendar__grid">
        {weekDates.map((date, i) => {
          const key = formatDate(date);
          const emotions = byDate[key] || [];
          const isToday = key === todayStr;
          const isPast = date < now && !isToday;
          const isFuture = date > now;

          return (
            <div
              key={key}
              className={[
                'emotion-calendar__day',
                isToday ? 'today' : '',
                isFuture ? 'future' : '',
                isPast && emotions.length === 0 ? 'past-empty' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span className="emotion-calendar__day-label">
                {DAY_LABELS[i]}
              </span>
              <span className="emotion-calendar__day-num">
                {date.getDate()}
              </span>
              <div className="emotion-calendar__emotions">
                {emotions.length > 0 ? (
                  emotions.map((eid) => (
                    <span
                      key={eid}
                      className="emotion-calendar__emoji"
                      title={EMOTIONS_INFO[eid]?.label}
                    >
                      {EMOTIONS_INFO[eid]?.emoji ?? '❓'}
                    </span>
                  ))
                ) : (
                  <span className="emotion-calendar__empty-dot" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 범례 */}
      <div className="emotion-calendar__legend">
        {Object.entries(EMOTIONS_INFO).map(([id, info]) => (
          <span key={id} className="emotion-calendar__legend-item">
            <span>{info.emoji}</span>
            <span className="emotion-calendar__legend-label">{info.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
