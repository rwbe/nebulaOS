import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const ParallaxWallpaper = ({ wallpaper }: { wallpaper: string }) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isEnabled) return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Movimento sutil: -15px a +15px
      const moveX = ((clientX / innerWidth) - 0.5) * 30;
      const moveY = ((clientY / innerHeight) - 0.5) * 30;
      
      mouseX.set(moveX);
      mouseY.set(moveY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isEnabled, mouseX, mouseY]);

  return (
    <motion.div
      style={{
        x,
        y,
        backgroundImage: `url(${wallpaper})`,
      }}
      className="absolute inset-0 bg-cover bg-center transition-[background-image] duration-700"
    >
      {/* Overlay gradiente para melhor contraste */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
    </motion.div>
  );
};
