import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';
import '../styles/music-card.css';

export default function MusicCard({ track, emotionTag, onMixClick }) {
  const { addToLibrary, isInLibrary } = useLibrary();
  const { isLoggedIn, setShowLoginModal } = useAuth();

  const saved = isInLibrary(track.title, track.artist);

  const handleSave = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    addToLibrary(track, emotionTag);
  };

  const thumbnailUrl = track.image || 
    (track.youtube?.video_id 
      ? `https://img.youtube.com/vi/${track.youtube.video_id}/mqdefault.jpg`
      : null);

  return (
    <div className="music-card" id={`music-card-${track.title.replace(/\s+/g, '-')}`}>
      <div className="music-card__thumbnail">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={track.title} loading="lazy" />
        ) : (
          <div className="music-card__thumbnail-placeholder">🎵</div>
        )}
      </div>
      <div className="music-card__info">
        <h4 className="music-card__title">{track.title}</h4>
        <p className="music-card__artist">{track.artist}</p>
        <p className="music-card__reason">{track.reason}</p>
        <div className="music-card__actions">
          {track.youtube?.url ? (
            <a
              className="music-card__action-btn music-card__action-btn--play"
              href={track.youtube.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              ▶ 재생
            </a>
          ) : (
            <button
              className="music-card__action-btn music-card__action-btn--play"
              disabled
              style={{ opacity: 0.5, cursor: 'not-allowed' }}
              type="button"
            >
              ▶ 재생
            </button>
          )}
          <button
            className={`music-card__action-btn music-card__action-btn--save${saved ? ' music-card__action-btn--saved' : ''}`}
            onClick={handleSave}
            type="button"
            disabled={saved}
          >
            {saved ? '✓ 저장됨' : '♡ 저장'}
          </button>
        </div>
      </div>
    </div>
  );
}
