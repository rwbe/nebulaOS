import { useState, useRef, useEffect } from 'react';
import { 
  Mic, Square, Play, Pause, Download, Trash2, 
  Clock, AudioLines, Settings, Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped';

interface VoiceRecording {
  id: string;
  name: string;
  blob: Blob;
  duration: number;
  timestamp: Date;
  size: number;
}

export const VoiceRecorderApp = () => {
  const [state, setState] = useState<RecordingState>('idle');
  const [recordings, setRecordings] = useState<VoiceRecording[]>([]);
  const [currentDuration, setCurrentDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<'low' | 'medium' | 'high'>('high');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
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
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const setupAudioAnalyser = (stream: MediaStream) => {
    audioContextRef.current = new AudioContext();
    analyserRef.current = audioContextRef.current.createAnalyser();
    const source = audioContextRef.current.createMediaStreamSource(stream);
    source.connect(analyserRef.current);
    analyserRef.current.fftSize = 256;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateAudioLevel = () => {
      if (analyserRef.current && state === 'recording') {
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / bufferLength;
        setAudioLevel(average / 255);
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      }
    };

    updateAudioLevel();
  };

  const startRecording = async () => {
    try {
      const qualitySettings = {
        low: { sampleRate: 22050, audioBitsPerSecond: 64000 },
        medium: { sampleRate: 44100, audioBitsPerSecond: 128000 },
        high: { sampleRate: 48000, audioBitsPerSecond: 192000 }
      };

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: qualitySettings[selectedQuality].sampleRate
        }
      });

      streamRef.current = stream;
      setupAudioAnalyser(stream);
      
      const options = {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: qualitySettings[selectedQuality].audioBitsPerSecond
      };

      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'audio/webm';
      }
      
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const recording: VoiceRecording = {
          id: Date.now().toString(),
          name: `Gravação de Voz ${new Date().toLocaleString('pt-BR')}`,
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
        
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
        
        setAudioLevel(0);
      };

      mediaRecorderRef.current.start(1000);
      setState('recording');
      startTimeRef.current = Date.now();
      pausedTimeRef.current = 0;
      
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current - pausedTimeRef.current;
        setCurrentDuration(Math.floor(elapsed / 1000));
      }, 1000);

    } catch (err) {
      console.error('Error starting recording:', err);
      alert('Não foi possível iniciar a gravação. Certifique-se de conceder permissão para usar o microfone.');
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
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setAudioLevel(0);
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

      if (streamRef.current && analyserRef.current) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const updateAudioLevel = () => {
          if (analyserRef.current) {
            analyserRef.current.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / bufferLength;
            setAudioLevel(average / 255);
            animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
          }
        };
        updateAudioLevel();
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && (state === 'recording' || state === 'paused')) {
      mediaRecorderRef.current.stop();
      setState('stopped');
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setTimeout(() => {
        setState('idle');
        setCurrentDuration(0);
      }, 500);
    }
  };

  const downloadRecording = (recording: VoiceRecording) => {
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
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
              <Mic className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Gravador de Voz</h2>
              <p className="text-sm text-muted-foreground">Grave áudio com qualidade</p>
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
                  <label className="text-sm">Qualidade do Áudio</label>
                  <div className="flex gap-2">
                    {(['low', 'medium', 'high'] as const).map((quality) => (
                      <button
                        key={quality}
                        onClick={() => setSelectedQuality(quality)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          selectedQuality === quality 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        {quality === 'low' && 'Baixa'}
                        {quality === 'medium' && 'Média'}
                        {quality === 'high' && 'Alta'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recording Interface */}
        <div className="flex flex-col items-center gap-6">
          {/* Audio Visualizer */}
          <div className="w-full max-w-md h-24 bg-black/20 rounded-2xl p-4 flex items-center justify-center gap-1">
            {Array.from({ length: 40 }).map((_, i) => {
              const randomHeight = state === 'recording' 
                ? Math.random() * audioLevel * 100 + 10
                : 10;
              return (
                <motion.div
                  key={i}
                  animate={{
                    height: state === 'recording' ? randomHeight : 10,
                  }}
                  transition={{ duration: 0.1 }}
                  className="w-1 bg-gradient-to-t from-blue-500 to-cyan-500 rounded-full"
                />
              );
            })}
          </div>

          {/* Timer */}
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
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-2xl text-white font-semibold transition-all active:scale-95 shadow-lg shadow-blue-500/20"
              >
                <Mic className="w-6 h-6" />
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
              {state === 'recording' && 'Gravando áudio...'}
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
            <AudioLines className="w-16 h-16 mb-4 opacity-20" />
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
                    <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
                      <Volume2 className="w-6 h-6 text-blue-500" />
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
