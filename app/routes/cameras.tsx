import {
  AlertCircle,
  Camera,
  Circle,
  Cog,
  Factory,
  Maximize2, Minimize2,
  Radio,
  Snowflake,
  Volume2, VolumeX,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { StatusIndicator } from "~/components/ui/status-indicator";
import { useSimulationContext } from "~/context/simulation-context";

interface CameraFeed {
  id: string;
  label: string;
  floorId: string;
  floorIcon: typeof Cog;
  zone: string;
}

const cameras: CameraFeed[] = [
  { id: "cam-1", label: "CAM 01", floorId: "assembly", floorIcon: Cog, zone: "Assemblage - Cellule Robot A" },
  { id: "cam-2", label: "CAM 02", floorId: "cold-storage", floorIcon: Snowflake, zone: "Stockage Froid - Chambre A" },
  { id: "cam-3", label: "CAM 03", floorId: "machines", floorIcon: Factory, zone: "Machines - CNC Alpha" },
];

export const meta = () => {
  return [
    { title: "Caméras" },
  ];
};

export default function Cameras() {
  const { floors } = useSimulationContext();
  const [fullscreen, setFullscreen] = useState<string | null>(null);

  const getFloorStatus = (floorId: string) => {
    const floor = floors.find((f) => f.id === floorId);
    if (!floor) return "ok";
    if (floor.sensors.some((s) => s.status === "critical")) return "critical";
    if (floor.sensors.some((s) => s.status === "warning")) return "warning";
    return "ok";
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Camera className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Caméras</h1>
            <p className="text-sm text-[var(--color-text-muted)]">Surveillance temps réel : 3 flux actifs</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
          <Radio className="h-3 w-3 text-red-400 animate-pulse" />
          <span>LIVE</span>
        </div>
      </div>

      {fullscreen ? (
        <FullscreenView
          camera={cameras.find((c) => c.id === fullscreen)!}
          floorStatus={getFloorStatus(cameras.find((c) => c.id === fullscreen)!.floorId)}
          onExit={() => setFullscreen(null)}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {cameras.map((cam) => {
            const status = getFloorStatus(cam.floorId);
            return (
              <CameraCard
                key={cam.id}
                camera={cam}
                floorStatus={status}
                onFullscreen={() => setFullscreen(cam.id)}
              />
            );
          })}
        </div>
      )}

      <AlertCameraLinks cameras={cameras} getFloorStatus={getFloorStatus} onOpenFullscreen={setFullscreen} />
    </div>
  );
}

function CameraCard({
  camera,
  floorStatus,
  onFullscreen,
}: {
  camera: CameraFeed;
  floorStatus: string;
  onFullscreen: () => void;
}) {
  const [muted, setMuted] = useState(true);
  const FloorIcon = camera.floorIcon;

  return (
    <div className={`rounded-2xl overflow-hidden border transition-all duration-300
      bg-gradient-to-br from-[var(--color-surface-700)] to-[var(--color-surface-800)]
      ${floorStatus === "critical"
        ? "border-red-500/40 shadow-lg shadow-red-500/10"
        : floorStatus === "warning"
        ? "border-amber-500/30 shadow-lg shadow-amber-500/5"
        : "border-[var(--color-surface-500)]/20"
      }`}
    >
      <div className="relative aspect-video bg-[var(--color-surface-900)] overflow-hidden group cursor-pointer" onClick={onFullscreen}>
        <VideoPlaceholder cameraId={camera.id} muted={muted} />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/90 text-white text-[10px] font-bold uppercase tracking-wider">
            <Circle className="h-1.5 w-1.5 fill-current" />
            REC
          </span>
          {floorStatus === "critical" && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/30 animate-pulse">
              <AlertCircle className="h-3 w-3" />
              ALERTE
            </span>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <p className="text-white text-sm font-bold">{camera.label}</p>
            <p className="text-white/60 text-[10px]">{camera.zone}</p>
          </div>
          <div className="text-white/50 text-[10px] font-mono">
            {new Date().toLocaleTimeString("fr-FR")}
          </div>
        </div>

        <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); setMuted(!muted); }}
            className="h-7 w-7 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-all"
          >
            {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onFullscreen(); }}
            className="h-7 w-7 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-all"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FloorIcon className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
          <span className="text-xs text-[var(--color-text-secondary)]">{camera.zone.split(" — ")[0]}</span>
        </div>
        <div className="flex items-center gap-2">
          <StatusIndicator status={floorStatus as "ok" | "warning" | "critical"} size="sm" />
          <Link
            to={`/floor/${camera.floorId}`}
            className="text-[10px] text-[var(--color-accent-cyan)] hover:underline"
          >
            Voir capteurs →
          </Link>
        </div>
      </div>
    </div>
  );
}

function FullscreenView({
  camera,
  floorStatus,
  onExit,
}: {
  camera: CameraFeed;
  floorStatus: string;
  onExit: () => void;
}) {
  const [muted, setMuted] = useState(true);
  const FloorIcon = camera.floorIcon;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onExit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onExit]);

  return (
    <div className="rounded-2xl overflow-hidden border border-[var(--color-surface-500)]/20 bg-[var(--color-surface-800)]">
      <div className="relative aspect-video bg-[var(--color-surface-900)] overflow-hidden">
        <VideoPlaceholder cameraId={camera.id} fullscreen muted={muted} />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/90 text-white text-xs font-bold uppercase tracking-wider">
              <Circle className="h-2 w-2 fill-current" />
              LIVE
            </span>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm">
              <FloorIcon className="h-4 w-4 text-white/70" />
              <span className="text-white text-sm font-medium">{camera.label} : {camera.zone}</span>
            </div>
            {floorStatus === "critical" && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30 animate-pulse">
                <AlertCircle className="h-3.5 w-3.5" />
                ALERTE ZONE
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setMuted(!muted)}
              className="h-9 w-9 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-all"
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <button
              onClick={onExit}
              className="h-9 w-9 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-all"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div className="text-white/50 text-xs font-mono">
            {new Date().toLocaleDateString("fr-FR")} {new Date().toLocaleTimeString("fr-FR")}
          </div>
          <Link
            to={`/floor/${camera.floorId}`}
            className="px-3 py-1.5 rounded-lg bg-[var(--color-accent-cyan)]/20 text-[var(--color-accent-cyan)] text-xs font-medium border border-[var(--color-accent-cyan)]/30 hover:bg-[var(--color-accent-cyan)]/30 transition-colors"
          >
            Voir capteurs →
          </Link>
        </div>
      </div>
    </div>
  );
}

function AlertCameraLinks({
  cameras,
  getFloorStatus,
  onOpenFullscreen,
}: {
  cameras: CameraFeed[];
  getFloorStatus: (id: string) => string;
  onOpenFullscreen: (id: string) => void;
}) {
  const criticalCams = cameras.filter((c) => getFloorStatus(c.floorId) === "critical");
  if (criticalCams.length === 0) return null;

  return (
    <div className="rounded-2xl p-4 bg-red-500/5 border border-red-500/20 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle className="h-4 w-4 text-red-400" />
        <span className="text-sm font-medium text-red-400">Zones en alerte : Accès rapide caméra</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {criticalCams.map((cam) => (
          <button
            key={cam.id}
            onClick={() => onOpenFullscreen(cam.id)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl
              bg-red-500/10 border border-red-500/20
              hover:bg-red-500/20 transition-colors text-sm"
          >
            <Camera className="h-3.5 w-3.5 text-red-400" />
            <span className="text-red-300 font-medium">{cam.label}</span>
            <span className="text-red-400/60 text-xs">{cam.zone}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function VideoPlaceholder({ cameraId, fullscreen = false, muted = true }: { cameraId: string; fullscreen?: boolean; muted?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (muted) {
      const ctx = audioContextRef.current;
      if (ctx && gainNodeRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
      }
      return;
    }

    let ctx = audioContextRef.current;
    if (!ctx) {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      ctx = new AudioContextClass();
      audioContextRef.current = ctx;
      
      if (ctx) {
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        sourceRef.current = ctx.createBufferSource();
        sourceRef.current.buffer = noiseBuffer;
        sourceRef.current.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 1500;

        gainNodeRef.current = ctx.createGain();
        gainNodeRef.current.gain.value = 0;

        sourceRef.current.connect(filter);
        filter.connect(gainNodeRef.current);
        gainNodeRef.current.connect(ctx.destination);
        sourceRef.current.start();
      }
    }

    if (ctx && ctx.state === "suspended") {
      ctx.resume();
    }

    if (ctx) {
      gainNodeRef.current?.gain.setTargetAtTime(0.015, ctx.currentTime, 0.1);
    }

    return () => {
      if (gainNodeRef.current && audioContextRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0, audioContextRef.current.currentTime, 0.1);
      }
    };
  }, [muted]);

  useEffect(() => {
    return () => {
      if (sourceRef.current) {
        sourceRef.current.stop();
        sourceRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const drawNoise = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = "#0a0e17";
    ctx.fillRect(0, 0, w, h);

    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 18;
      data[i] = 10 + noise;     // R
      data[i + 1] = 14 + noise; // G
      data[i + 2] = 23 + noise; // B
      data[i + 3] = 255;        // A
    }
    ctx.putImageData(imageData, 0, 0);

    ctx.fillStyle = "rgba(0,0,0,0.15)";
    for (let y = 0; y < h; y += 3) {
      ctx.fillRect(0, y, w, 1);
    }

    ctx.strokeStyle = "rgba(34, 211, 238, 0.08)";
    ctx.lineWidth = 1;

    const bSize = Math.min(w, h) * 0.08;
    const margin = 20;
    ctx.beginPath();
    ctx.moveTo(margin, margin + bSize);
    ctx.lineTo(margin, margin);
    ctx.lineTo(margin + bSize, margin);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w - margin - bSize, margin);
    ctx.lineTo(w - margin, margin);
    ctx.lineTo(w - margin, margin + bSize);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(margin, h - margin - bSize);
    ctx.lineTo(margin, h - margin);
    ctx.lineTo(margin + bSize, h - margin);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w - margin - bSize, h - margin);
    ctx.lineTo(w - margin, h - margin);
    ctx.lineTo(w - margin, h - margin - bSize);
    ctx.stroke();

    const cx = w / 2;
    const cy = h / 2;
    ctx.strokeStyle = "rgba(34, 211, 238, 0.06)";
    ctx.beginPath();
    ctx.moveTo(cx - 20, cy);
    ctx.lineTo(cx + 20, cy);
    ctx.moveTo(cx, cy - 20);
    ctx.lineTo(cx, cy + 20);
    ctx.stroke();

    ctx.fillStyle = "rgba(148, 163, 184, 0.25)";
    ctx.font = `${fullscreen ? 14 : 11}px Inter, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("FLUX RTSP EN ATTENTE DE CONNEXION", cx, cy + 50);
  }, [fullscreen]);

  useEffect(() => {
    drawNoise();
    const id = setInterval(drawNoise, 150);
    return () => clearInterval(id);
  }, [drawNoise]);

  return (
    <canvas
      ref={canvasRef}
      width={fullscreen ? 1280 : 640}
      height={fullscreen ? 720 : 360}
      className="w-full h-full object-cover"
    />
  );
}
