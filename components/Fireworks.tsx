'use client';
import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  alpha: number; color: string; radius: number;
}

const COLORS = ['#b22234','#ffffff','#3c5a9a','#e8c94a','#ff4444','#aac4ff'];

export default function Fireworks({ opacity = 0.55 }: { opacity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animId: number;
    let particles: Particle[] = [];
    let lastBurst = 0;

    function resize() {
      if (!canvas) return;
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function burst(x: number, y: number) {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const count = 55 + Math.floor(Math.random() * 35);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = 1.8 + Math.random() * 3.5;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color,
          radius: 1.5 + Math.random() * 2,
        });
      }
    }

    function loop(ts: number) {
      animId = requestAnimationFrame(loop);
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Launch a new burst every 2.2 seconds at a random position
      if (ts - lastBurst > 2200) {
        burst(
          canvas.width  * (0.15 + Math.random() * 0.7),
          canvas.height * (0.05 + Math.random() * 0.5)
        );
        lastBurst = ts;
      }

      particles = particles.filter(p => p.alpha > 0.02);
      for (const p of particles) {
        p.x  += p.vx;
        p.y  += p.vy;
        p.vy += 0.045; // gravity
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.alpha -= 0.016;
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle   = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    animId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity }}
    />
  );
}
