import { useState, useRef, useEffect } from 'react';
import { 
  Circle, Square, Play, Pause, Download, Trash2, 
  Monitor, Settings, Clock, Disc, Film
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped';

interface Recording {
  id: string;
  name: string;
  blob: Blob;
  duration: number;
  timestamp: Date;
  size: number;
}

export const ScreenRecorderApp = () => {
  const [state, setState] = useState<RecordingState>('idle');
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [currentDuration, setCurrentDuration] = useState(0);
  const [selectedQuality, setSelectedQuality] = useState<'720p' | '1080p'>('1080p');
  const [includeAudio, setIncludeAudio] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const constraints: any = {
        video: {
          width: selectedQuality === '1080p' ? 1920 : 1280,
          height: selectedQuality === '1080p' ? 1080 : 720,
          frameRate: 30
        }
      };

      if (includeAudio) {
        constraints.audio = {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        };
      }

      const displayStream = await navigator.mediaDevices.getDisplayMedia(constraints);
      
      let tracks = displayStream.getTracks();
      
      if (includeAudio) {
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          tracks = [...tracks, ...audioStream.getAudioTracks()];
        } catch (err) {
          console.warn('Could not get audio:', err);
        }
      }

      streamRef.current = new MediaStream(tracks);
      
      const options = { mimeType: 'video/webm;codecs=vp9' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'video/webm';
      }
      
      mediaRecorderRef.current = new MediaRecorder(streamRef.current, options);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const recording: Recording = {
          id: Date.now().toString(),
          name: `Gravação ${new Date().toLocaleString('pt-BR')}`,
          blob,
          duration: currentDuration,
          timestamp: new Date(),
          size: blob.size
        };
        setRecordings([recording, ...recordings]);
        chunksRef.current = [];
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorderRef.current.start(1000);
      setState('recording');
      startTimeRef.current = Date.now();
      pausedTimeRef.current = 0;
      
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current - pausedTimeRef.current;
        setCurrentDuration(Math.floor(elapsed / 1000));
      }, 1000);

      streamRef.current.getTracks()[0].onended = () => {
        stopRecording();
      };

    } catch (err) {
      console.error('Error starting recording:', err);
      alert('Não foi possível iniciar a gravação. Certifique-se de conceder as permissões necessárias.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && state === 'recording') {
      mediaRecorderRef.current.pause();
      setState('paused');
      pausedTimeRef.current = Date.now() - startTimeRef.current - pausedTimeRef.current;
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && state === 'paused') {
      mediaRecorderRef.current.resume();
      setState('recording');
      startTimeRef.current = Date.now();
      const currentPausedTime = pausedTimeRef.current;
      
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current + currentPausedTime;
        setCurrentDuration(Math.floor(elapsed / 1000));
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && (state === 'recording' || state === 'paused')) {
      mediaRecorderRef.current.stop();
      setState('stopped');
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setTimeout(() => {
        setState('idle');
        setCurrentDuration(0);
      }, 500);
    }
  };

  const downloadRecording = (recording: Recording) => {
    const url = URL.createObjectURL(recording.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recording.name}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const deleteRecording = (id: string) => {
    setRecordings(recordings.filter(r => r.id !== id));
  };

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="flex flex-col h-full bg-[hsl(var(--window-bg))]">
      {/* Header */}
      <div className="p-6 border-b border-border/50 bg-card/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl">
              <Film className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Gravação de Tela</h2>
              <p className="text-sm text-muted-foreground">Grave sua tela com áudio</p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-white/5 rounded-lg transition-all active:scale-95"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-white/5 rounded-xl space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <label className="text-sm">Qualidade</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedQuality('720p')}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        selectedQuality === '720p' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      720p
                    </button>
                    <button
                      onClick={() => setSelectedQuality('1080p')}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        selectedQuality === '1080p' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      1080p
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm">Incluir Áudio</label>
                  <button
                    onClick={() => setIncludeAudio(!includeAudio)}
                    className={`w-12 h-6 rounded-full transition-all ${
                      includeAudio ? 'bg-primary' : 'bg-white/10'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      includeAudio ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recording Controls */}
        <div className="flex flex-col items-center gap-4">
          {/* Timer Display */}
          <div className="flex items-center gap-3 px-6 py-3 bg-black/20 rounded-2xl">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <span className="text-3xl font-mono font-bold tabular-nums">
              {formatDuration(currentDuration)}
            </span>
            {state === 'recording' && (
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-3 h-3 bg-red-500 rounded-full"
              />
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-3">
            {state === 'idle' && (
              <button
                onClick={startRecording}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-2xl text-white font-semibold transition-all active:scale-95 shadow-lg shadow-red-500/20"
              >
                <Circle className="w-6 h-6 fill-current" />
                <span>Iniciar Gravação</span>
              </button>
            )}

            {state === 'recording' && (
              <>
                <button
                  onClick={pauseRecording}
                  className="p-4 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-2xl text-yellow-500 transition-all active:scale-95"
                  title="Pausar"
                >
                  <Pause className="w-6 h-6" />
                </button>
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-2xl text-white font-semibold transition-all active:scale-95"
                >
                  <Square className="w-5 h-5 fill-current" />
                  <span>Parar</span>
                </button>
              </>
            )}

            {state === 'paused' && (
              <>
                <button
                  onClick={resumeRecording}
                  className="p-4 bg-green-500/20 hover:bg-green-500/30 rounded-2xl text-green-500 transition-all active:scale-95"
                  title="Continuar"
                >
                  <Play className="w-6 h-6" />
                </button>
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-2xl text-white font-semibold transition-all active:scale-95"
                >
                  <Square className="w-5 h-5 fill-current" />
                  <span>Parar</span>
                </button>
              </>
            )}
          </div>

          {state !== 'idle' && (
            <p className="text-sm text-muted-foreground">
              {state === 'recording' && 'Gravando sua tela...'}
              {state === 'paused' && 'Gravação pausada'}
              {state === 'stopped' && 'Salvando gravação...'}
            </p>
          )}
        </div>
      </div>

      {/* Recordings List */}
      <div className="flex-1 overflow-auto p-6 custom-scrollbar">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Gravações Recentes</h3>
          <span className="text-sm text-muted-foreground">{recordings.length} {recordings.length === 1 ? 'gravação' : 'gravações'}</span>
        </div>

        {recordings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Disc className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg mb-2">Nenhuma gravação</p>
            <p className="text-sm">Clique em "Iniciar Gravação" para começar</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {recordings.map((recording) => (
                <motion.div
                  key={recording.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-4 bg-card/50 border border-border/30 rounded-xl hover:bg-card hover:border-border/50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl">
                      <Film className="w-6 h-6 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{recording.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDuration(recording.duration)}
                        </span>
                        <span>{formatFileSize(recording.size)}</span>
                        <span>{recording.timestamp.toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => downloadRecording(recording)}
                        className="p-2 hover:bg-primary/20 hover:text-primary rounded-lg transition-all active:scale-95"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteRecording(recording.id)}
                        className="p-2 hover:bg-destructive/20 hover:text-destructive rounded-lg transition-all active:scale-95"
                        title="Deletar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
