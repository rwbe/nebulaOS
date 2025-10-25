import { useAppearance } from '@/contexts/AppearanceContext';
import { motion } from 'framer-motion';

export const WallpaperRenderer = () => {
  const { wallpaper } = useAppearance();

  const renderWallpaper = () => {
    switch (wallpaper.type) {
      case 'video':
        return (
          <motion.video
            key={wallpaper.id}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <source src={wallpaper.videoUrl || wallpaper.url} type="video/mp4" />
          </motion.video>
        );

      case 'image':
        return (
          <motion.div
            key={wallpaper.id}
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${wallpaper.url})` }}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        );

      case 'animated':
        return (
          <motion.div
            key={wallpaper.id}
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat animated-wallpaper"
            style={{ backgroundImage: `url(${wallpaper.url})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
        );

      case 'gradient':
      default:
        return (
          <motion.div
            key={wallpaper.id}
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${wallpaper.url})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
        );
    }
  };

  return (
    <>
      {renderWallpaper()}
      
      {/* Premium grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }} 
        />
      </div>

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/10" />

      {/* Vignette effect */}
      <div 
        className="absolute inset-0" 
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.15) 100%)'
        }}
      />
    </>
  );
};
