import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function ScanResult({ result, onAsk }) {
  const { t, i18n } = useTranslation();
  const confidencePercent = Math.round(result.confidence * 100);
  const confidenceTone = useMemo(() => {
    if (result.confidence >= 0.8) return "bg-leaf-500";
    if (result.confidence >= 0.5) return "bg-amber-400";
    return "bg-red-400";
  }, [result.confidence]);

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(
      `${result.disease}. ${t("confidence")}: ${confidencePercent}%. ${result.treatment.join(
        ", "
      )}`
    );
    utterance.lang = i18n.language === "hi" ? "hi-IN" : "en-US";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <section className="bg-white/90 rounded-3xl p-6 shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display text-clay-900">{result.disease}</h2>
          <p className="text-sm text-clay-600">{t("result_subtitle")}</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="bg-clay-900 text-white px-3 py-2 rounded-xl text-sm"
          onClick={speak}
        >
          {t("tts_play")}
        </motion.button>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm text-clay-600">
          <span>{t("confidence")}</span>
          <span>{confidencePercent}%</span>
        </div>
        <div className="h-3 bg-clay-200 rounded-full overflow-hidden mt-2">
          <div className={`h-full ${confidenceTone}`} style={{ width: `${confidencePercent}%` }} />
        </div>
      </div>

      <div className="mt-5">
        <h3 className="font-semibold text-clay-900">{t("treatment")}</h3>
        <ul className="list-disc ml-5 text-sm text-clay-700 mt-2">
          {result.treatment.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4 text-sm text-clay-700">
        <span className="font-semibold">{t("why_this")} </span>
        {result.explanation}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {["chat_q1", "chat_q2", "chat_q3"].map((key) => (
          <button
            key={key}
            className="px-3 py-2 rounded-full bg-clay-100 text-clay-700 text-xs"
            onClick={() => onAsk(t(key))}
          >
            {t(key)}
          </button>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <button className="bg-leaf-500 text-white px-4 py-2 rounded-xl">
          {t("save_history")}
        </button>
        <button
          className="border border-clay-200 px-4 py-2 rounded-xl"
          onClick={onAsk}
        >
          {t("ask_solution")}
        </button>
      </div>
    </section>
  );
}
