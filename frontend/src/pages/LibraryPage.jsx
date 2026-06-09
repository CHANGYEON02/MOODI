import { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import '../styles/library.css';

export default function LibraryPage() {
  const { library, removeFromLibrary } = useLibrary();
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleDelete = (id) => {
    setConfirmDelete(id);
  };

  const confirmRemove = () => {
    if (confirmDelete) {
      removeFromLibrary(confirmDelete);
      setConfirmDelete(null);
    }
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const emotionTagColors = {
    joy: { bg: 'rgba(245,166,35,0.15)', color: '#F5A623' },
    sadness: { bg: 'rgba(59,130,246,0.15)', color: '#3B82F6' },
    anger: { bg: 'rgba(239,68,68,0.15)', color: '#EF4444' },
    tired: { bg: 'rgba(139,92,246,0.15)', color: '#8B5CF6' },
    excited: { bg: 'rgba(247,37,133,0.15)', color: '#F72585' },
  };

  const getTagStyle = (tag) => {
    return emotionTagColors[tag] || { bg: 'rgba(255,255,255,0.08)', color: '#9b95b0' };
  };

  const emotionLabels = {
    joy: '기쁨', sadness: '슬픔', anger: '화남', tired: '피곤함', excited: '설렘',
  };

  return (
    <div className="library-page" id="library-page">
      <h1 className="library-page__title">📚 Library</h1>
      <p className="library-page__subtitle">
        내가 저장한 노래 · {library.length}곡
      </p>

      {library.length === 0 ? (
        <div className="library-page__empty">
          <div className="library-page__empty-icon">🎵</div>
          <p className="library-page__empty-text">
            아직 저장된 노래가 없어요
          </p>
          <p className="library-page__empty-hint">
            홈에서 음악을 추천받고 마음에 드는 곡을 저장해보세요
          </p>
        </div>
      ) : (
        <div className="library-list">
          {library.map((item) => {
            const tagStyle = getTagStyle(item.emotionTag);
            const thumbnailUrl = item.image ||
              (item.youtube?.video_id
                ? `https://img.youtube.com/vi/${item.youtube.video_id}/mqdefault.jpg`
                : null);

            // Construct fallback play URL if direct video URL is not saved
            const playUrl = item.youtube?.url || 
              `https://www.youtube.com/results?search_query=${encodeURIComponent(item.title + ' ' + item.artist)}`;

            return (
              <div className="library-item" key={item.id}>
                <div className="library-item__thumbnail">
                  {thumbnailUrl ? (
                    <img src={thumbnailUrl} alt={item.title} loading="lazy" />
                  ) : (
                    <div className="library-item__thumbnail-placeholder">🎵</div>
                  )}
                </div>
                <div className="library-item__info">
                  <h4 className="library-item__title">{item.title}</h4>
                  <p className="library-item__artist">{item.artist}</p>
                  <div className="library-item__meta">
                    <span
                      className="library-item__emotion-tag"
                      style={{ background: tagStyle.bg, color: tagStyle.color }}
                    >
                      {emotionLabels[item.emotionTag] || item.emotionTag || '기타'}
                    </span>
                    <span className="library-item__date">
                      {formatDate(item.savedAt)}
                    </span>
                  </div>
                  <div className="library-item__actions">
                    <a
                      className="library-item__action-btn library-item__action-btn--play"
                      href={playUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none' }}
                    >
                      ▶ 재생
                    </a>
                    <button
                      className="library-item__action-btn library-item__action-btn--delete"
                      onClick={() => handleDelete(item.id)}
                      type="button"
                    >
                      🗑 삭제
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {confirmDelete && (
        <div className="confirm-modal-overlay" onClick={cancelDelete}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="confirm-modal__title">노래를 삭제할까요?</h3>
            <p className="confirm-modal__desc">
              라이브러리에서 이 노래를 삭제합니다.
            </p>
            <div className="confirm-modal__actions">
              <button
                className="confirm-modal__btn confirm-modal__btn--cancel"
                onClick={cancelDelete}
                type="button"
              >
                취소
              </button>
              <button
                className="confirm-modal__btn confirm-modal__btn--confirm"
                onClick={confirmRemove}
                type="button"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
