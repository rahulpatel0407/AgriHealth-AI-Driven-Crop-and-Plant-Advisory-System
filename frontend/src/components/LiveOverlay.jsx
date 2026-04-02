import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function LiveOverlay({
  candidates,
  confidence,
  modeLabel,
  autoCapturing,
  onCapture,
  onSave,
  onAsk,
  gradcamUrl,
}) {
  const { t } = useTranslation();
  const top = candidates?.[0];
  const confidencePercent = Math.round((confidence || 0) * 100);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-4 left-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
        {modeLabel}
      </div>

      <div className="absolute top-4 right-4 bg-white/90 rounded-2xl p-3 w-40 shadow-lg">
        <p className="text-xs text-clay-700">{t("top_match")}</p>
        <p className="text-sm font-semibold text-clay-900">{top?.label || "--"}</p>
        <div className="mt-2">
          <div className="text-xs text-clay-600">{confidencePercent}%</div>
          <div className="h-2 bg-clay-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-leaf-500"
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
        </div>
        <div className="mt-2 text-[11px] text-clay-600">
          {candidates?.slice(1, 3).map((item) => (
            <div key={item.label} className="flex justify-between">
              <span>{item.label}</span>
              <span>{Math.round(item.confidence * 100)}%</span>
            </div>
          ))}
        </div>
      </div>

      {gradcamUrl && (
        <img
          src={gradcamUrl}
          alt="Grad-CAM"
          className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-30"
        />
      )}

      <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-3 pointer-events-auto">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="bg-white/90 text-clay-800 px-4 py-3 rounded-2xl shadow-lg"
          onClick={onCapture}
        >
          {t("live_capture")}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="bg-leaf-500 text-white px-4 py-3 rounded-2xl shadow-lg"
          onClick={onSave}
        >
          {t("live_save")}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="bg-clay-800 text-white px-4 py-3 rounded-2xl shadow-lg"
          onClick={onAsk}
        >
          {t("ask_solution")}
        </motion.button>
      </div>

      {autoCapturing && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/90 rounded-full px-5 py-3 text-sm shadow-lg">
            {t("auto_capturing")}
          </div>
        </div>
      )}
    </div>
  );
}
