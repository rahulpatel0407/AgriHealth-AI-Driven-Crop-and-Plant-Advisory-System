import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import LiveOverlay from "../components/LiveOverlay.jsx";
import { useCamera } from "../hooks/useCamera.js";
import { createLiveSocket, inferFrame } from "../services/liveApi.js";

const initialCandidates = [
  { label: "Early Blight", confidence: 0.0 },
  { label: "Late Blight", confidence: 0.0 },
  { label: "Healthy", confidence: 0.0 },
];

export default function LiveScan({ onAutoCapture, onAsk }) {
  const { t } = useTranslation();
  const [consent, setConsent] = useState(false);
  const [lowBandwidth, setLowBandwidth] = useState(false);
  const [mode, setMode] = useState("live");
  const [useServer, setUseServer] = useState(false);
  const [candidates, setCandidates] = useState(initialCandidates);
  const [autoCapturing, setAutoCapturing] = useState(false);
  const [tutorial, setTutorial] = useState(() => !localStorage.getItem("ah_tutorial_seen"));
  const fileInputRef = useRef(null);
  const socketRef = useRef(null);
  const stableLabelRef = useRef(null);
  const stableCountRef = useRef(0);

  const sampleIntervalMs = useMemo(() => (lowBandwidth ? 1400 : 800), [lowBandwidth]);

  const { videoRef, isStreaming, error, startCamera, stopCamera, captureFrame } = useCamera({
    onSample: async (frame) => {
      if (!consent || mode !== "live") return;
      try {
        if (useServer && socketRef.current?.readyState === 1) {
          socketRef.current.send(
            JSON.stringify({
              type: "frame",
              frame_id: `${Date.now()}`,
              jpeg_b64: frame.split(",")[1],
            })
          );
          return;
        }
        const result = useServer
          ? await inferFrame(frame)
          : {
              candidates: [
                { label: "Early Blight", confidence: 0.88 },
                { label: "Late Blight", confidence: 0.08 },
                { label: "Healthy", confidence: 0.04 },
              ],
            };
        if (result?.candidates?.length) {
          setCandidates(result.candidates);
          const top = result.candidates[0];
          if (top.confidence > 0.85) {
            if (stableLabelRef.current === top.label) {
              stableCountRef.current += 1;
            } else {
              stableLabelRef.current = top.label;
              stableCountRef.current = 1;
            }
            if (stableCountRef.current >= 2) {
              setAutoCapturing(true);
              setTimeout(() => {
                setAutoCapturing(false);
                onAutoCapture?.(result);
              }, 500);
              stableCountRef.current = 0;
            }
          } else {
            stableCountRef.current = 0;
          }
        }
      } catch {
        return;
      }
    },
    sampleIntervalMs,
  });

  useEffect(() => {
    if (consent && !isStreaming) startCamera();
    if (!consent && isStreaming) stopCamera();
  }, [consent, isStreaming, startCamera, stopCamera]);

  useEffect(() => {
    if (!useServer || !consent) return undefined;
    socketRef.current = createLiveSocket({
      onInference: (data) => {
        if (data?.candidates?.length) {
          setCandidates(data.candidates);
          const top = data.candidates[0];
          if (top.confidence > 0.85) {
            if (stableLabelRef.current === top.label) {
              stableCountRef.current += 1;
            } else {
              stableLabelRef.current = top.label;
              stableCountRef.current = 1;
            }
            if (stableCountRef.current >= 2) {
              setAutoCapturing(true);
              setTimeout(() => {
                setAutoCapturing(false);
                onAutoCapture?.(data);
              }, 500);
              stableCountRef.current = 0;
            }
          } else {
            stableCountRef.current = 0;
          }
        }
      },
      onClose: () => {
        socketRef.current = null;
      },
    });
    return () => {
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [useServer, consent, onAutoCapture]);

  const handleCapture = () => {
    const frame = captureFrame();
    if (frame) onAutoCapture?.({ frame, candidates });
  };

  const handleFilePick = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const result = await inferFrame(reader.result);
        onAutoCapture?.(result);
      } catch {
        return;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDismissTutorial = () => {
    localStorage.setItem("ah_tutorial_seen", "1");
    setTutorial(false);
  };

  const modeLabel = mode === "live" ? t("live_mode") : t("single_mode");
  const inferenceLabel = useServer ? t("live_server") : t("live_on_device");

  return (
    <section className="relative bg-clay-900 text-white rounded-3xl overflow-hidden h-[70vh]">
      <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />

      {!isStreaming && (
        <div className="absolute inset-0 flex items-center justify-center bg-clay-900/70">
          <div className="text-center px-6">
            <p className="text-lg font-display">{t("camera_ready")}</p>
            {error && <p className="text-sm text-white/70">{t("camera_error")}</p>}
            {error && (
              <button
                className="mt-4 bg-white text-clay-900 px-4 py-2 rounded-xl"
                onClick={() => fileInputRef.current?.click()}
              >
                {t("upload_cta")}
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFilePick}
            />
          </div>
        </div>
      )}

      <LiveOverlay
        candidates={candidates}
        confidence={candidates[0]?.confidence}
        modeLabel={`${modeLabel} - ${inferenceLabel}`}
        autoCapturing={autoCapturing}
        onCapture={handleCapture}
        onSave={handleCapture}
        onAsk={onAsk}
      />

      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 text-clay-900 px-4 py-2 rounded-full text-xs flex gap-2">
        <button
          className={mode === "live" ? "font-semibold" : "text-clay-600"}
          onClick={() => setMode("live")}
        >
          {t("live_tab")}
        </button>
        <span className="text-clay-300">|</span>
        <button
          className={mode === "single" ? "font-semibold" : "text-clay-600"}
          onClick={() => setMode("single")}
        >
          {t("single_tab")}
        </button>
      </div>

      <div className="absolute bottom-24 left-4 right-4 flex flex-col gap-2 pointer-events-auto">
        <label className="bg-white/90 text-clay-900 px-4 py-3 rounded-2xl flex items-start gap-3">
          <input
            type="checkbox"
            className="mt-1"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span className="text-sm">{t("consent_label")}</span>
        </label>
        <label className="bg-white/80 text-clay-900 px-4 py-3 rounded-2xl flex items-center justify-between">
          <span className="text-sm">{t("low_bandwidth")}</span>
          <input
            type="checkbox"
            checked={lowBandwidth}
            onChange={(e) => setLowBandwidth(e.target.checked)}
          />
        </label>
        <label className="bg-white/80 text-clay-900 px-4 py-3 rounded-2xl flex items-center justify-between">
          <span className="text-sm">{t("server_mode")}</span>
          <input
            type="checkbox"
            checked={useServer}
            onChange={(e) => setUseServer(e.target.checked)}
          />
        </label>
      </div>

      {tutorial && (
        <div className="absolute inset-0 bg-clay-900/80 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white text-clay-900 rounded-3xl p-6 mx-6"
          >
            <h3 className="font-display text-lg mb-2">{t("tutorial_title")}</h3>
            <p className="text-sm text-clay-700">{t("tutorial_body")}</p>
            <button
              className="mt-4 bg-leaf-500 text-white px-4 py-2 rounded-xl"
              onClick={handleDismissTutorial}
            >
              {t("tutorial_cta")}
            </button>
          </motion.div>
        </div>
      )}
    </section>
  );
}
