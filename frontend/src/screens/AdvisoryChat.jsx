import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { chatAdvice } from "../services/liveApi.js";

export default function AdvisoryChat({ seedQuestion }) {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([
    { role: "assistant", content: t("chat_welcome") },
  ]);
  const [input, setInput] = useState(seedQuestion || "");
  const [loading, setLoading] = useState(false);
  const [openCitations, setOpenCitations] = useState({});

  const sendMessage = async (text) => {
    if (!text) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    try {
      const response = await chatAdvice({
        user_id: "demo-user",
        question: text,
        context: { language: i18n.language },
      });
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.answer,
          actions: response.actions,
          citations: response.citations,
          escalate: response.escalate,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: t("chat_fallback") },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [t("chat_q1"), t("chat_q2"), t("chat_q3")];

  useEffect(() => {
    if (seedQuestion) setInput(seedQuestion);
  }, [seedQuestion]);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = i18n.language === "hi" ? "hi-IN" : "en-US";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <section className="bg-white/90 rounded-3xl p-6 shadow-lg min-h-[65vh] flex flex-col">
      <h2 className="text-xl font-display text-clay-900 mb-4">{t("ask_solution")}</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        {quickQuestions.map((question) => (
          <button
            key={question}
            className="text-xs px-3 py-2 rounded-full bg-clay-100 text-clay-700"
            onClick={() => sendMessage(question)}
          >
            {question}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={`${msg.role}-${index}`}
            className={`p-3 rounded-2xl text-sm ${
              msg.role === "user" ? "bg-leaf-500 text-white ml-auto" : "bg-clay-100 text-clay-800"
            }`}
          >
            <p>{msg.content}</p>
            {msg.role === "assistant" && (
              <button
                className="mt-2 text-xs text-clay-600"
                onClick={() => speak(msg.content)}
              >
                {t("tts_play")}
              </button>
            )}
            {msg.actions?.length ? (
              <ul className="mt-2 list-disc ml-4 text-xs text-clay-700">
                {msg.actions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
            ) : null}
            {msg.citations?.length ? (
              <div className="mt-2">
                <button
                  className="text-xs text-leaf-700"
                  onClick={() =>
                    setOpenCitations((prev) => ({
                      ...prev,
                      [index]: !prev[index],
                    }))
                  }
                >
                  {t("show_sources")}
                </button>
                {openCitations[index] && (
                  <ul className="mt-1 text-[11px] text-clay-600 list-disc ml-4">
                    {msg.citations.map((citation) => (
                      <li key={citation}>{citation}</li>
                    ))}
                  </ul>
                )}
              </div>
            ) : null}
            {msg.escalate && (
              <button className="mt-3 text-xs bg-clay-900 text-white px-3 py-2 rounded-xl">
                {t("request_expert")}
              </button>
            )}
          </div>
        ))}
        {loading && <p className="text-xs text-clay-500">{t("chat_thinking")}</p>}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border border-clay-200 rounded-xl px-3 py-2 text-sm"
          placeholder={t("chat_placeholder")}
        />
        <button
          className="bg-leaf-500 text-white px-4 py-2 rounded-xl text-sm"
          onClick={() => sendMessage(input)}
        >
          {t("chat_send")}
        </button>
      </div>
    </section>
  );
}
