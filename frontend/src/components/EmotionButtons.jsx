import '../styles/emotion-buttons.css';

const EMOTIONS = [
  { id: 'joy',     label: '기쁨',   emoji: '☀️' },
  { id: 'sadness', label: '슬픔',   emoji: '🌧️' },
  { id: 'anger',   label: '화남',   emoji: '🔥' },
  { id: 'tired',   label: '피곤함', emoji: '🌙' },
  { id: 'excited', label: '설렘',   emoji: '💖' },
];

export default function EmotionButtons({ selectedEmotion, onSelectEmotion }) {
  return (
    <div className="emotion-buttons-wrapper">
      <p className="emotion-buttons-prompt">지금 어떤 감정이신가요?</p>
      <div className="emotion-buttons-grid">
        {EMOTIONS.map(({ id, label, emoji }) => {
          const isSelected = selectedEmotion === id;
          return (
            <button
              key={id}
              className={`emotion-btn emotion-btn--${id}${isSelected ? ' emotion-btn--selected' : ''}`}
              onClick={() => onSelectEmotion(isSelected ? null : id)}
              aria-pressed={isSelected}
              type="button"
              id={`emotion-btn-${id}`}
            >
              <span className="emotion-btn__emoji" aria-hidden="true">{emoji}</span>
              <span className="emotion-btn__label">{label}</span>
              {isSelected && (
                <span className="emotion-btn__check" aria-hidden="true">✓</span>
              )}
            </button>
          );
        })}
      </div>
      {selectedEmotion && (
        <p className="emotion-buttons-selected-msg" role="status">
          <span className="emotion-buttons-selected-dot" />
          선택된 감정:{' '}
          <strong>
            {EMOTIONS.find(e => e.id === selectedEmotion)?.emoji}{' '}
            {EMOTIONS.find(e => e.id === selectedEmotion)?.label}
          </strong>
        </p>
      )}
    </div>
  );
}

export { EMOTIONS };
