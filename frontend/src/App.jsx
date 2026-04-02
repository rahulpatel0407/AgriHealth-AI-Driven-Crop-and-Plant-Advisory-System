import { useState } from "react";
import { useTranslation } from "react-i18next";
import LiveScan from "./screens/LiveScan.jsx";
import ScanResult from "./screens/ScanResult.jsx";
import AdvisoryChat from "./screens/AdvisoryChat.jsx";

const mockResult = {
  disease: "Early Blight",
  confidence: 0.92,
  treatment: ["Remove infected leaves", "Apply recommended fungicide"],
  explanation: "The model detected concentric lesions typical of early blight.",
};

export default function App() {
  const { t, i18n } = useTranslation();
  const [tab, setTab] = useState("scan");
  const [seedQuestion, setSeedQuestion] = useState("");
  const [result, setResult] = useState(mockResult);

  const handleAutoCapture = (payload) => {
    if (payload?.candidates?.length) {
      setResult({
        disease: payload.candidates[0].label,
        confidence: payload.candidates[0].confidence,
        treatment: mockResult.treatment,
        explanation: mockResult.explanation,
      });
    }
    setTab("results");
  };

  const handleAsk = (question) => {
    if (question) setSeedQuestion(question);
    setTab("advisory");
  };

  return (
    <div className="min-h-screen hero-bg text-clay-900">
      <header className="px-6 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/logo.jpeg"
            alt="AgriHealth AI"
            className="h-10 w-10 rounded-2xl object-cover shadow"
          />
          <div>
            <h1 className="text-2xl font-display font-semibold">{t("app_title")}</h1>
            <p className="text-sm text-clay-800/70">{t("tagline")}</p>
          </div>
        </div>
        <select
          className="border border-clay-200 rounded-xl px-3 py-2 bg-white/80"
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          aria-label={t("language")}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
        </select>
      </header>

      <main className="px-6 pb-24 space-y-6">
        {tab === "scan" && (
          <LiveScan onAutoCapture={handleAutoCapture} onAsk={handleAsk} />
        )}
        {tab === "results" && <ScanResult result={result} onAsk={handleAsk} />}
        {tab === "advisory" && <AdvisoryChat seedQuestion={seedQuestion} />}
      </main>

      <nav className="fixed bottom-4 left-4 right-4 bg-white/90 rounded-3xl shadow-xl flex justify-around py-3">
        <button
          className={`text-sm ${tab === "scan" ? "text-leaf-700 font-semibold" : "text-clay-600"}`}
          onClick={() => setTab("scan")}
        >
          {t("nav_scan")}
        </button>
        <button
          className={`text-sm ${tab === "results" ? "text-leaf-700 font-semibold" : "text-clay-600"}`}
          onClick={() => setTab("results")}
        >
          {t("nav_results")}
        </button>
        <button
          className={`text-sm ${tab === "advisory" ? "text-leaf-700 font-semibold" : "text-clay-600"}`}
          onClick={() => setTab("advisory")}
        >
          {t("nav_advisory")}
        </button>
      </nav>
    </div>
  );
}
