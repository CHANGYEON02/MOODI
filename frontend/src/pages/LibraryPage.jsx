import { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import '../styles/library.css';

export default function LibraryPage() {
  const {
    library,
    removeFromLibrary,
    playlists,
    createPlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
  } = useLibrary();

  const [activeTab, setActiveTab] = useState('all'); // 'all' 또는 'playlists'
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null); // 라이브러리 곡 삭제 확인용 { id, type: 'track' | 'playlist' }
  const [playlistTrackToAdd, setPlaylistTrackToAdd] = useState(null); // 플레이리스트 추가 모달용 track 객체

  const handleDeleteClick = (id, type = 'track') => {
    setConfirmDelete({ id, type });
  };

  const confirmRemove = () => {
    if (confirmDelete) {
      if (confirmDelete.type === 'track') {
        removeFromLibrary(confirmDelete.id);
      } else if (confirmDelete.type === 'playlist') {
        deletePlaylist(confirmDelete.id);
        if (selectedPlaylistId === confirmDelete.id) {
          setSelectedPlaylistId(null);
        }
      }
      setConfirmDelete(null);
    }
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    const res = createPlaylist(newPlaylistName);
    alert(res.message);
    if (res.success) {
      setNewPlaylistName('');
    }
  };

  const handleAddToPlaylist = (playlistId) => {
    if (!playlistTrackToAdd) return;
    const res = addTrackToPlaylist(playlistId, playlistTrackToAdd.id);
    alert(res.message);
    setPlaylistTrackToAdd(null);
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
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
    return emotionTagColors[tag] || { bg: 'rgba(0,0,0,0.05)', color: 'var(--text-muted)' };
  };

  const emotionLabels = {
    joy: '기쁨', sadness: '슬픔', anger: '화남', tired: '피곤함', excited: '설렘',
  };

  // 플레이리스트 상세 조회 데이터 조합
  const currentPlaylist = playlists.find(p => p.id === selectedPlaylistId);
  const playlistTracks = currentPlaylist
    ? library.filter(track => currentPlaylist.trackIds.includes(track.id))
    : [];

  return (
    <div className="library-page" id="library-page">
      <h1 className="library-page__title">📚 Library</h1>
      <p className="library-page__subtitle">
        나만의 감정 보관함과 음악 플레이리스트
      </p>

      {/* 탭 네비게이션 */}
      <div className="library-tabs">
        <button
          className={`library-tab-btn${activeTab === 'all' ? ' active' : ''}`}
          onClick={() => {
            setActiveTab('all');
            setSelectedPlaylistId(null);
          }}
          type="button"
        >
          모든 노래 ({library.length})
        </button>
        <button
          className={`library-tab-btn${activeTab === 'playlists' ? ' active' : ''}`}
          onClick={() => setActiveTab('playlists')}
          type="button"
        >
          플레이리스트 ({playlists.length})
        </button>
      </div>

      {/* 탭 1: 모든 노래 */}
      {activeTab === 'all' && (
        library.length === 0 ? (
          <div className="library-page__empty">
            <div className="library-page__empty-icon">🎵</div>
            <p className="library-page__empty-text">아직 저장된 노래가 없어요</p>
            <p className="library-page__empty-hint">홈에서 음악을 추천받고 마음에 드는 곡을 저장해보세요</p>
          </div>
        ) : (
          <div className="library-list">
            {library.map((item) => {
              const tagStyle = getTagStyle(item.emotionTag);
              const thumbnailUrl = item.image ||
                (item.youtube?.video_id
                  ? `https://img.youtube.com/vi/${item.youtube.video_id}/mqdefault.jpg`
                  : null);

              const playUrl = (item.youtube?.video_id && item.youtube.video_id !== 'None' && item.youtube.video_id !== 'null')
                ? `https://www.youtube.com/watch?v=${item.youtube.video_id}`
                : `https://www.youtube.com/results?search_query=${encodeURIComponent(item.title + ' ' + item.artist)}`;

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
                    {/* 가로 배열 재생/삭제 버튼 */}
                    <div className="library-item__actions" style={{ marginTop: '8px', justifyContent: 'flex-start' }}>
                      <a
                        className="library-item__action-btn library-item__action-btn--play"
                        href={playUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        ▶ 재생
                      </a>
                      <button
                        className="library-item__action-btn library-item__action-btn--delete"
                        onClick={() => handleDeleteClick(item.id, 'track')}
                        type="button"
                      >
                        🗑 삭제
                      </button>
                      <button
                        className="library-item__action-btn library-item__action-btn--add"
                        onClick={() => setPlaylistTrackToAdd(item)}
                        type="button"
                        title="플레이리스트에 추가"
                      >
                        ➕ 담기
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* 탭 2: 플레이리스트 */}
      {activeTab === 'playlists' && (
        !selectedPlaylistId ? (
          <div className="playlists-container">
            {/* 생성 폼 */}
            <form className="playlist-form" onSubmit={handleCreatePlaylist}>
              <input
                className="playlist-form__input"
                type="text"
                placeholder="새 플레이리스트 이름 입력"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
              />
              <button className="playlist-form__btn" type="submit">만들기</button>
            </form>

            {/* 목록 */}
            {playlists.length === 0 ? (
              <div className="library-page__empty">
                <div className="library-page__empty-icon">📁</div>
                <p className="library-page__empty-text">생성된 플레이리스트가 없습니다</p>
                <p className="library-page__empty-hint">나만의 음악 묶음을 만들어보세요</p>
              </div>
            ) : (
              <div className="playlist-grid">
                {playlists.map((playlist) => (
                  <div
                    className="playlist-card"
                    key={playlist.id}
                    onClick={() => setSelectedPlaylistId(playlist.id)}
                  >
                    <div className="playlist-card__icon">💿</div>
                    <div className="playlist-card__info">
                      <h4 className="playlist-card__name">{playlist.name}</h4>
                      <p className="playlist-card__count">{playlist.trackIds.length}곡 저장됨</p>
                    </div>
                    <button
                      className="playlist-card__delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(playlist.id, 'playlist');
                      }}
                      type="button"
                      title="플레이리스트 삭제"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* 플레이리스트 상세 조회 뷰 */
          <div className="playlist-detail">
            <div className="playlist-detail-header">
              <button
                className="playlist-detail-back-btn"
                onClick={() => setSelectedPlaylistId(null)}
                type="button"
                title="뒤로 가기"
              >
                ←
              </button>
              <h2 className="playlist-detail-title">
                {currentPlaylist?.name}
                <span className="playlist-detail-count">({playlistTracks.length}곡)</span>
              </h2>
            </div>

            {playlistTracks.length === 0 ? (
              <div className="library-page__empty">
                <div className="library-page__empty-icon">🎵</div>
                <p className="library-page__empty-text">플레이리스트가 비어있습니다</p>
                <p className="library-page__empty-hint">'모든 노래' 탭에서 노래를 추가해보세요</p>
              </div>
            ) : (
              <div className="library-list">
                {playlistTracks.map((item) => {
                  const tagStyle = getTagStyle(item.emotionTag);
                  const thumbnailUrl = item.image ||
                    (item.youtube?.video_id
                      ? `https://img.youtube.com/vi/${item.youtube.video_id}/mqdefault.jpg`
                      : null);

                  const playUrl = (item.youtube?.video_id && item.youtube.video_id !== 'None' && item.youtube.video_id !== 'null')
                    ? `https://www.youtube.com/watch?v=${item.youtube.video_id}`
                    : `https://www.youtube.com/results?search_query=${encodeURIComponent(item.title + ' ' + item.artist)}`;

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
                        </div>
                        {/* 플레이리스트 내부 가로 버튼 */}
                        <div className="library-item__actions" style={{ marginTop: '8px', justifyContent: 'flex-start' }}>
                          <a
                            className="library-item__action-btn library-item__action-btn--play"
                            href={playUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            ▶ 재생
                          </a>
                          <button
                            className="library-item__action-btn library-item__action-btn--delete"
                            onClick={() => removeTrackFromPlaylist(selectedPlaylistId, item.id)}
                            type="button"
                            title="플레이리스트에서 제외"
                          >
                            제외
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )
      )}

      {/* 플레이리스트 추가 모달 팝업 */}
      {playlistTrackToAdd && (
        <div className="playlist-select-overlay" onClick={() => setPlaylistTrackToAdd(null)}>
          <div className="playlist-select-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="playlist-select-modal__title">플레이리스트에 담기</h3>
            {playlists.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <p style={{ marginBottom: '12px' }}>생성된 플레이리스트가 없습니다.</p>
                <button
                  className="confirm-modal__btn confirm-modal__btn--cancel"
                  style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                  onClick={() => {
                    setActiveTab('playlists');
                    setPlaylistTrackToAdd(null);
                  }}
                  type="button"
                >
                  플레이리스트 만들기
                </button>
              </div>
            ) : (
              <div className="playlist-select-list">
                {playlists.map(p => (
                  <button
                    className="playlist-select-item"
                    key={p.id}
                    onClick={() => handleAddToPlaylist(p.id)}
                    type="button"
                  >
                    <span className="playlist-select-item__name">💿 {p.name}</span>
                    <span className="playlist-select-item__count">({p.trackIds.length}곡)</span>
                  </button>
                ))}
              </div>
            )}
            <button
              className="playlist-select-modal__close-btn"
              onClick={() => setPlaylistTrackToAdd(null)}
              type="button"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {confirmDelete && (
        <div className="confirm-modal-overlay" onClick={cancelDelete}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="confirm-modal__title">
              {confirmDelete.type === 'track' ? '노래를 삭제할까요?' : '플레이리스트를 삭제할까요?'}
            </h3>
            <p className="confirm-modal__desc">
              {confirmDelete.type === 'track'
                ? '라이브러리에서 이 노래를 완전히 삭제합니다.'
                : '선택하신 플레이리스트를 삭제합니다. (수록곡은 보존됩니다.)'}
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
