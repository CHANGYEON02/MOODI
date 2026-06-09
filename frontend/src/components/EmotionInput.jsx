import { useState } from 'react';
import '../styles/emotion-input.css';

const MAX_LENGTH = 200;

export default function EmotionInput({ value, onChange, onSubmit, isLoading }) {
  const [isFocused, setIsFocused] = useState(false);

  const charCount = value.length;
  const isNearLimit = charCount >= MAX_LENGTH * 0.8;
  const isAtLimit = charCount >= MAX_LENGTH;

  const handleChange = (e) => {
    const text = e.target.value;
    if (text.length <= MAX_LENGTH) {
      onChange(text);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading) {
        onSubmit();
      }
    }
  };

  const containerClass = [
    'emotion-input-container',
    isNearLimit && !isAtLimit ? 'near-limit' : '',
    isAtLimit ? 'at-limit' : '',
  ].filter(Boolean).join(' ');

  const charCountClass = [
    'emotion-char-count',
    isNearLimit && !isAtLimit ? 'near-limit' : '',
    isAtLimit ? 'at-limit' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="emotion-input-wrapper">
      <div className={containerClass}>
        <textarea
          className="emotion-textarea"
          placeholder="How are you feeling today?"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          rows={2}
          id="emotion-text-input"
          aria-label="감정 입력"
        />
        <div className="emotion-textarea-border-animation" />
      </div>
      <div className="emotion-input-footer">
        <span className="emotion-input-hint">
          {isFocused ? 'Enter로 전송 · Shift+Enter로 줄바꿈' : '감정이나 현재 상황을 자유롭게 적어보세요'}
        </span>
        <span className={charCountClass}>
          {charCount}<span className="char-divider">/</span>{MAX_LENGTH}
        </span>
      </div>
      <div className="emotion-input-actions">
        <button
          className="emotion-submit-btn"
          onClick={onSubmit}
          disabled={isLoading}
          type="button"
          id="emotion-submit-btn"
        >
          {isLoading ? (
            <>
              <span className="emotion-submit-spinner" />
              추천 중...
            </>
          ) : (
            '🎵 음악 추천받기'
          )}
        </button>
      </div>
    </div>
  );
}
