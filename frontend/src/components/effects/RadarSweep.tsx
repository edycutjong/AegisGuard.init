"use client";

import { useEffect, useRef } from "react";

export default function RadarSweep({ active = true, size = 200 }: { active?: boolean; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const maxR = size / 2 - 4;

    let angle = 0;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);

      // Rings
      for (let r = 1; r <= 3; r++) {
        const ringR = (maxR / 3) * r;
        ctx.beginPath();
        ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(6, 182, 212, ${0.08 + r * 0.02})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Cross hairs
      ctx.beginPath();
      ctx.moveTo(cx, cy - maxR);
      ctx.lineTo(cx, cy + maxR);
      ctx.moveTo(cx - maxR, cy);
      ctx.lineTo(cx + maxR, cy);
      ctx.strokeStyle = "rgba(6, 182, 212, 0.06)";
      ctx.lineWidth = 0.5;
      ctx.stroke();

      if (active) {
        // Sweep cone
        const sweepGrad = ctx.createConicGradient(angle - Math.PI / 2, cx, cy);
        sweepGrad.addColorStop(0, "rgba(6, 182, 212, 0.15)");
        sweepGrad.addColorStop(0.08, "rgba(6, 182, 212, 0.08)");
        sweepGrad.addColorStop(0.15, "rgba(6, 182, 212, 0)");
        sweepGrad.addColorStop(1, "rgba(6, 182, 212, 0)");
        
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, maxR, angle, angle + Math.PI * 0.3);
        ctx.closePath();
        ctx.fillStyle = sweepGrad;
        ctx.fill();

        // Sweep line
        const endX = cx + Math.cos(angle) * maxR;
        const endY = cy + Math.sin(angle) * maxR;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = "rgba(6, 182, 212, 0.6)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Blip dots (fake signal contact points)
        const blips = [
          { a: angle - 0.8, r: maxR * 0.6, fade: 0.8 },
          { a: angle - 1.5, r: maxR * 0.35, fade: 0.5 },
          { a: angle - 2.2, r: maxR * 0.8, fade: 0.3 },
          { a: angle - 3.0, r: maxR * 0.5, fade: 0.15 },
        ];

        for (const blip of blips) {
          const bx = cx + Math.cos(blip.a) * blip.r;
          const by = cy + Math.sin(blip.a) * blip.r;
          
          const blipGrad = ctx.createRadialGradient(bx, by, 0, bx, by, 6);
          blipGrad.addColorStop(0, `rgba(6, 182, 212, ${blip.fade})`);
          blipGrad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.fillStyle = blipGrad;
          ctx.arc(bx, by, 6, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.fillStyle = `rgba(6, 182, 212, ${blip.fade})`;
          ctx.arc(bx, by, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Center pulse
        const pulseAlpha = 0.3 + Math.sin(Date.now() * 0.003) * 0.2;
        const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 8);
        centerGrad.addColorStop(0, `rgba(6, 182, 212, ${pulseAlpha})`);
        centerGrad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.fillStyle = centerGrad;
        ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = "rgba(6, 182, 212, 0.8)";
        ctx.arc(cx, cy, 2, 0, Math.PI * 2);
        ctx.fill();

        angle += 0.015;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [active, size]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none"
      style={{ width: size, height: size }}
    />
  );
}
