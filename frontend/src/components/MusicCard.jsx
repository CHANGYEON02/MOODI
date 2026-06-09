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
    const result = addToLibrary(track, emotionTag);
    // Toast notification could be added here
  };

  const handlePlay = () => {
    if (track.youtube?.url) {
      window.open(track.youtube.url, '_blank', 'noopener,noreferrer');
    }
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
          <button
            className="music-card__action-btn music-card__action-btn--play"
            onClick={handlePlay}
            type="button"
          >
            ▶ 재생
          </button>
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
