import { createContext, useContext, useState, useEffect } from 'react';

const LibraryContext = createContext();

const STORAGE_KEY = 'moodi_library';

export function LibraryProvider({ children }) {
  const [library, setLibrary] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
  }, [library]);

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
    return { success: true, message: '라이브러리에 저장되었습니다.' };
  };

  const removeFromLibrary = (id) => {
    setLibrary(prev => prev.filter(item => item.id !== id));
  };

  const isInLibrary = (title, artist) => {
    return library.some(item => item.title === title && item.artist === artist);
  };

  return (
    <LibraryContext.Provider value={{ library, addToLibrary, removeFromLibrary, isInLibrary }}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) throw new Error('useLibrary must be used within a LibraryProvider');
  return context;
}
