import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import styles from './IslandFormation.module.css';

/*
  Island formation (homepage only)

  The background video is cut into a grid of shards on a canvas. On load the
  shards float apart in the mist, with only the middle of the island visible.
  As you scroll the first ~1.2 screens, the shards rise and lock together from
  the centre outward, the mist parts, and a soft light sweeps across once the
  island is whole. Then the canvas hands over to the real <video> element
  (same pixels, so the switch is invisible) and the normal camera zoom takes over.

  Uses canvas 2D drawImage, which works with a video from another domain
  without needing CORS headers. Only one video is decoded.

  Tuning:
    FORM_DISTANCE   how many screen heights of scrolling it takes to form
    COLS_DESKTOP    shard columns on wide screens (rows follow the aspect ratio)
    COLS_MOBILE     shard columns on narrow screens
    RISE            how far below its place a shard starts (fraction of height)
    SCATTER         how far out from the centre a shard starts (fraction of width)
*/
const FORM_DISTANCE = 1.2;
const COLS_DESKTOP = 12;
const COLS_MOBILE = 6;
const RISE = 0.22;
const SCATTER = 0.3;

// Small seeded random so the shard layout is the same on every visit
function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOutBack = (t) => {
  const c1 = 1.2;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

export default function IslandFormation({ active, videoRef, cameraRef, focusX = 53, focusY = 56 }) {
  const canvasRef = useRef(null);
  const fogLeftRef = useRef(null);
  const fogRightRef = useRef(null);
  const sweepRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const camera = cameraRef.current;
    const fogs = [fogLeftRef.current, fogRightRef.current];
    const sweep = sweepRef.current;
    if (!canvas || !video || !camera) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const showFormed = () => {
      canvas.style.visibility = 'hidden';
      video.style.opacity = '1';
      gsap.set(fogs, { opacity: 0 });
      gsap.set(sweep, { opacity: 0 });
    };

    if (!active || reduce) {
      showFormed();
      return undefined;
    }

    const ctx2d = canvas.getContext('2d');
    let tiles = [];
    let W = 0;
    let H = 0;
    let target = 0;
    let progress = 0;
    let time = 0;
    let formed = false;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      W = Math.round(camera.clientWidth * dpr);
      H = Math.round(camera.clientHeight * dpr);
      canvas.width = W;
      canvas.height = H;

      const cols = window.innerWidth < 768 ? COLS_MOBILE : COLS_DESKTOP;
      const rows = Math.max(4, Math.round((cols * H) / W));
      const rand = seeded(20260917);
      const fx = (focusX / 100) * W;
      const fy = (focusY / 100) * H;
      const maxD = Math.hypot(Math.max(fx, W - fx), Math.max(fy, H - fy));

      tiles = [];
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          const w = W / cols;
          const h = H / rows;
          const cx = c * w + w / 2;
          const cy = r * h + h / 2;
          const dx = cx - fx;
          const dy = cy - fy;
          const d = Math.hypot(dx, dy) / maxD; // 0 at the island centre, 1 at the far corner
          const len = Math.hypot(dx, dy) || 1;
          const spread = (SCATTER * 0.4 + rand() * SCATTER) * W * d;
          tiles.push({
            u: c / cols,
            v: r / rows,
            uw: 1 / cols,
            vh: 1 / rows,
            x: cx,
            y: cy,
            w,
            h,
            delay: d * 0.62 + rand() * 0.1,
            ox: (dx / len) * spread + (rand() - 0.5) * w * 0.6,
            oy: (dy / len) * spread * 0.6 + RISE * H * (0.4 + rand() * 0.8),
            rot: (rand() - 0.5) * 0.8,
            scale: 0.55 + rand() * 0.25,
            alpha0: Math.max(0, 0.7 - d * 1.1),
            phase: rand() * Math.PI * 2,
          });
        }
      }
    };

    // Same maths as object-fit: cover, so canvas pixels line up with the video
    const coverRect = () => {
      const vw = video.videoWidth;
      const vh = video.videoHeight;
      const boxAR = W / H;
      if (vw / vh > boxAR) {
        const sw = vh * boxAR;
        return { sx: (vw - sw) / 2, sy: 0, sw, sh: vh };
      }
      const sh = vw / boxAR;
      return { sx: 0, sy: (vh - sh) / 2, sw: vw, sh };
    };

    const draw = () => {
      ctx2d.clearRect(0, 0, W, H);
      if (video.readyState < 2 || !video.videoWidth) return;
      const { sx, sy, sw, sh } = coverRect();
      const f = progress * 1.12; // lets the last (outer) shards finish

      for (let i = 0; i < tiles.length; i += 1) {
        const t = tiles[i];
        const local = clamp01((f - t.delay) / 0.42);
        const pos = easeOutBack(local);
        const settle = easeOutCubic(local);
        const drift = (1 - settle) * Math.sin(time * 0.9 + t.phase);
        const alpha = t.alpha0 + (1 - t.alpha0) * settle;
        if (alpha <= 0.01) continue;

        const x = t.x + t.ox * (1 - pos);
        const y = t.y + t.oy * (1 - pos) + drift * t.h * 0.08;
        const rot = t.rot * (1 - settle) + drift * 0.02;
        const sc = t.scale + (1 - t.scale) * settle;

        ctx2d.save();
        ctx2d.globalAlpha = alpha;
        ctx2d.translate(x, y);
        if (rot) ctx2d.rotate(rot);
        if (sc !== 1) ctx2d.scale(sc, sc);
        // +1px overlap hides hairline seams once shards lock together
        ctx2d.drawImage(
          video,
          sx + t.u * sw, sy + t.v * sh, t.uw * sw, t.vh * sh,
          -t.w / 2 - 0.5, -t.h / 2 - 0.5, t.w + 1, t.h + 1,
        );
        if (settle < 0.98) {
          // faint lit edge while a shard is still in flight
          ctx2d.strokeStyle = `rgba(255, 228, 190, ${0.28 * (1 - settle)})`;
          ctx2d.lineWidth = 1;
          ctx2d.strokeRect(-t.w / 2, -t.h / 2, t.w, t.h);
        }
        ctx2d.restore();
      }
    };

    const tick = (_, deltaMs) => {
      const dt = Math.min((deltaMs || 16) / 1000, 0.1);
      time += dt;
      progress += (target - progress) * (1 - Math.exp(-6 * dt)); // smooth follow

      const done = progress > 0.995 && target >= 1;
      if (done) {
        if (!formed) { formed = true; showFormed(); }
        return;
      }
      if (formed) {
        formed = false;
        canvas.style.visibility = 'visible';
        video.style.opacity = '0';
      }

      // Mist parts to the sides as the island forms
      const mist = clamp01(progress / 0.8);
      gsap.set(fogs[0], { xPercent: -mist * 70, opacity: 0.95 * (1 - mist) });
      gsap.set(fogs[1], { xPercent: mist * 70, opacity: 0.95 * (1 - mist) });

      // One soft light pass when the last shards lock in
      const s = clamp01((progress - 0.78) / 0.22);
      gsap.set(sweep, { xPercent: -120 + s * 240, opacity: Math.sin(s * Math.PI) * 0.9 });

      draw();
    };

    build();
    canvas.style.visibility = 'visible';
    video.style.opacity = '0';

    const trigger = ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: () => `+=${window.innerHeight * FORM_DISTANCE}`,
      invalidateOnRefresh: true,
      onUpdate: (self) => { target = self.progress; },
      onRefresh: (self) => { target = self.progress; },
    });
    target = trigger.progress;
    progress = target;

    gsap.ticker.add(tick);
    const onResize = () => build();
    window.addEventListener('resize', onResize);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('resize', onResize);
      trigger.kill();
      showFormed();
    };
  }, [active, videoRef, cameraRef, focusX, focusY]);

  return (
    <>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <div ref={fogLeftRef} className={`${styles.fog} ${styles.fogLeft}`} aria-hidden="true" />
      <div ref={fogRightRef} className={`${styles.fog} ${styles.fogRight}`} aria-hidden="true" />
      <div ref={sweepRef} className={styles.sweep} aria-hidden="true" />
    </>
  );
}
