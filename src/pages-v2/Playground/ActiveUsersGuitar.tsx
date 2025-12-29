import { useMemo, useRef, useState, useEffect } from "react";
import { useDashboard } from "../../contexts/DashboardContext";
import { useActiveUsersData } from "./useActiveUsersData";

import "./ActiveUsersGuitar.css";

type StringDatum = { label: string; count: number; freq: number };

type PluckState = { index: number; ts: number } | null;

export default function ActiveUsersGuitar() {
  const { timePeriod } = useDashboard();
  const { data, loading, error } = useActiveUsersData(timePeriod as any);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [pluck, setPluck] = useState<PluckState>(null);

  useEffect(() => {
    return () => {
      audioCtxRef.current?.close();
    };
  }, []);

  const strings = useMemo<StringDatum[]>(() => {
    const limited = data.slice(0, 12);
    const max = Math.max(...limited.map((d) => d.count), 1);
    return limited.map((d, i) => ({
      label: d.label,
      count: d.count,
      freq: 180 + (d.count / max) * 420 + i * 6,
    }));
  }, [data]);

  const triggerTone = (freq: number) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.value = 0.001;
      osc.connect(gain).connect(ctx.destination);
      const now = ctx.currentTime;
      gain.gain.exponentialRampToValueAtTime(0.3, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
      osc.start(now);
      osc.stop(now + 0.6);
    } catch (e) {
      console.warn("audio not available", e);
    }
  };

  const onPluck = (idx: number, freq: number) => {
    triggerTone(freq);
    setPluck({ index: idx, ts: performance.now() });
  };

  return (
    <div className="active-guitar-page">
      <div className="active-guitar-header">
        <div>
          <h1>Active Users Guitar</h1>
          <p className="subtitle">
            Each string is a period; pluck to hear activity (pitch) and see
            counts.
          </p>
        </div>
        <div className="status-chip">
          {loading ? "Loading…" : error ? "Using fallback" : timePeriod}
        </div>
      </div>
      <div className="active-guitar-body">
        <svg
          className="guitar-svg"
          viewBox="0 0 100 120"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="neck" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#111827" />
            </linearGradient>
          </defs>
          <rect
            x="12"
            y="8"
            width="76"
            height="104"
            rx="10"
            fill="url(#neck)"
            stroke="#1f2937"
            strokeWidth="1"
          />
          {strings.map((s, idx) => {
            const y = 16 + idx * (88 / Math.max(1, strings.length - 1));
            const isPlucked =
              pluck &&
              pluck.index === idx &&
              performance.now() - pluck.ts < 300;
            const t = s.count / Math.max(...strings.map((d) => d.count), 1);
            const color = `hsl(${40 + 180 * t}, 80%, ${55 - t * 8}%)`;
            return (
              <g key={idx}>
                <line
                  x1={18}
                  x2={82}
                  y1={y}
                  y2={y}
                  stroke={color}
                  strokeWidth={isPlucked ? 1.8 : 1.2 + t * 1.4}
                  strokeLinecap="round"
                  onMouseEnter={() => onPluck(idx, s.freq)}
                  onClick={() => onPluck(idx, s.freq)}
                  className="guitar-string"
                />
                <text x={84} y={y + 2} className="guitar-label">
                  {s.label} ({s.count})
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
