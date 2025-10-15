import { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  coverUrl: string;
}

const playlist: Song[] = [
  {
    id: '1',
    title: 'Imagine',
    artist: 'John Lennon',
    album: 'Imagine',
    duration: '3:04',
    coverUrl: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%233B82F6"/%3E%3Ctext x="100" y="100" font-size="60" fill="white" text-anchor="middle" dominant-baseline="middle"%3E🎵%3C/text%3E%3C/svg%3E',
  },
  {
    id: '2',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    duration: '5:55',
    coverUrl: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%238B5CF6"/%3E%3Ctext x="100" y="100" font-size="60" fill="white" text-anchor="middle" dominant-baseline="middle"%3E🎸%3C/text%3E%3C/svg%3E',
  },
  {
    id: '3',
    title: 'Hotel California',
    artist: 'Eagles',
    album: 'Hotel California',
    duration: '6:30',
    coverUrl: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%2322C55E"/%3E%3Ctext x="100" y="100" font-size="60" fill="white" text-anchor="middle" dominant-baseline="middle"%3E🎸%3C/text%3E%3C/svg%3E',
  },
  {
    id: '4',
    title: 'Stairway to Heaven',
    artist: 'Led Zeppelin',
    album: 'Led Zeppelin IV',
    duration: '8:02',
    coverUrl: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23F59E0B"/%3E%3Ctext x="100" y="100" font-size="60" fill="white" text-anchor="middle" dominant-baseline="middle"%3E🎤%3C/text%3E%3C/svg%3E',
  },
  {
    id: '5',
    title: 'Sweet Child O Mine',
    artist: "Guns N' Roses",
    album: 'Appetite for Destruction',
    duration: '5:56',
    coverUrl: 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23EF4444"/%3E%3Ctext x="100" y="100" font-size="60" fill="white" text-anchor="middle" dominant-baseline="middle"%3E🎸%3C/text%3E%3C/svg%3E',
  },
];

export const MusicApp = () => {
  const [currentSong, setCurrentSong] = useState(playlist[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  return (
    <div className="flex h-full">
      {/* Sidebar - Playlist */}
      <div className="w-80 bg-[hsl(var(--window-titlebar))] border-r border-border p-4 overflow-auto">
        <h3 className="text-lg font-semibold mb-4">Minha Playlist</h3>
        <div className="space-y-2">
          {playlist.map(song => (
            <button
              key={song.id}
              onClick={() => setCurrentSong(song)}
              className={`w-full p-3 rounded-lg text-left transition-colors ${
                currentSong.id === song.id
                  ? 'bg-primary/10 border border-primary'
                  : 'hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  className="w-12 h-12 rounded"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{song.title}</h4>
                  <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                </div>
                <span className="text-xs text-muted-foreground">{song.duration}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content - Now Playing */}
      <div className="flex-1 flex flex-col items-center justify-between p-8">
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl">
          {/* Album Art */}
          <img
            src={currentSong.coverUrl}
            alt={currentSong.title}
            className="w-62 h-62 rounded-2xl shadow-2xl mb-8"
          />

          {/* Song Info */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">{currentSong.title}</h2>
            <p className="text-xl text-muted-foreground">{currentSong.artist}</p>
            <p className="text-sm text-muted-foreground mt-1">{currentSong.album}</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full mb-6">
            <input
              type="range"
              min="0"
              max="100"
              value="30"
              className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>1:25</span>
              <span>{currentSong.duration}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6 mb-6">
            <button
              onClick={() => setShuffle(!shuffle)}
              className={`p-2 rounded-lg transition-colors ${
                shuffle ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-label="Embaralhar"
            >
              <Shuffle className="w-5 h-5" />
            </button>

            <button
              className="p-3 hover:bg-muted rounded-full transition-colors"
              aria-label="Anterior"
            >
              <SkipBack className="w-6 h-6" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-6 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all hover:scale-105"
              aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 ml-1" />
              )}
            </button>

            <button
              className="p-3 hover:bg-muted rounded-full transition-colors"
              aria-label="Próxima"
            >
              <SkipForward className="w-6 h-6" />
            </button>

            <button
              onClick={() => setRepeat(!repeat)}
              className={`p-2 rounded-lg transition-colors ${
                repeat ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-label="Repetir"
            >
              <Repeat className="w-5 h-5" />
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-3 w-64">
            <Volume2 className="w-5 h-5 text-muted-foreground" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="flex-1 h-1 bg-muted rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
            />
            <span className="text-xs text-muted-foreground w-8">{volume}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};