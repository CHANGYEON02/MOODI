import { createContext, useContext, useState, useEffect } from 'react';

const LibraryContext = createContext();

const STORAGE_KEY = 'moodi_library';
const PLAYLISTS_STORAGE_KEY = 'moodi_playlists';

export function LibraryProvider({ children }) {
  const [library, setLibrary] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [playlists, setPlaylists] = useState(() => {
    try {
      const stored = localStorage.getItem(PLAYLISTS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
  }, [library]);

  useEffect(() => {
    localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(playlists));
  }, [playlists]);

  const addToLibrary = (track, emotionTag) => {
    // Check for duplicate
    const isDuplicate = library.some(
      item => item.title === track.title && item.artist === track.artist
    );
    if (isDuplicate) {
      return { success: false, message: '이미 라이브러리에 저장된 노래입니다.' };
    }

    const newItem = {
      id: Date.now().toString(),
      title: track.title,
      artist: track.artist,
      reason: track.reason,
      youtube: track.youtube,
      image: track.image,
      emotionTag: emotionTag || '기타',
      savedAt: new Date().toISOString(),
    };

    setLibrary(prev => [newItem, ...prev]);
    return { success: true, message: '라이브러리에 저장되었습니다.', item: newItem };
  };

  const removeFromLibrary = (id) => {
    // 라이브러리에서 삭제 시 플레이리스트 내 수록곡 리스트에서도 제거해 주어야 함
    setLibrary(prev => prev.filter(item => item.id !== id));
    setPlaylists(prev => prev.map(p => ({
      ...p,
      trackIds: p.trackIds.filter(tid => tid !== id)
    })));
  };

  const isInLibrary = (title, artist) => {
    return library.some(item => item.title === title && item.artist === artist);
  };

  // ── Playlist Management Helpers ──
  const createPlaylist = (name) => {
    const trimmed = name.trim();
    if (!trimmed) {
      return { success: false, message: '플레이리스트 이름을 입력해주세요.' };
    }
    const isDuplicate = playlists.some(p => p.name === trimmed);
    if (isDuplicate) {
      return { success: false, message: '이미 존재하는 플레이리스트 이름입니다.' };
    }

    const newPlaylist = {
      id: Date.now().toString(),
      name: trimmed,
      trackIds: []
    };
    setPlaylists(prev => [...prev, newPlaylist]);
    return { success: true, message: '플레이리스트가 생성되었습니다.' };
  };

  const deletePlaylist = (playlistId) => {
    setPlaylists(prev => prev.filter(p => p.id !== playlistId));
  };

  const addTrackToPlaylist = (playlistId, trackId) => {
    let message = '플레이리스트에 추가되었습니다.';
    let success = true;

    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        if (p.trackIds.includes(trackId)) {
          success = false;
          message = '이미 플레이리스트에 담긴 노래입니다.';
          return p;
        }
        return { ...p, trackIds: [...p.trackIds, trackId] };
      }
      return p;
    }));

    return { success, message };
  };

  const removeTrackFromPlaylist = (playlistId, trackId) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        return { ...p, trackIds: p.trackIds.filter(id => id !== trackId) };
      }
      return p;
    }));
  };

  return (
    <LibraryContext.Provider
      value={{
        library,
        addToLibrary,
        removeFromLibrary,
        isInLibrary,
        playlists,
        createPlaylist,
        deletePlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) throw new Error('useLibrary must be used within a LibraryProvider');
  return context;
}
