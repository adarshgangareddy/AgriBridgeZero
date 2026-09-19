import { useState } from "react";
import { Sparkles, Send, Bot, User, ShieldAlert, Sprout, CloudSun, Database, Activity, Check, FileText } from "lucide-react";
import { aiSpecialistAgents } from "../data/demo";
import { askAgriAI, type AIResponse } from "../services/aiService";
import type { LanguageCode } from "../data/i18n";

interface AIAssistantSectionProps {
  currentLang: LanguageCode;
  onOpenAuth: (actionDesc: string) => void;
  isLoggedIn: boolean;
  t: (key: string) => string;
}

export function AIAssistantSection({ currentLang, onOpenAuth, isLoggedIn, t }: AIAssistantSectionProps) {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>({
    answer:
      currentLang === "kn"
        ? "ನಿಮ್ಮ ಇತ್ತೀಚಿನ ಮಣ್ಣಿನ ಪರೀಕ್ಷೆಯಲ್ಲಿ ಲಭ್ಯವಿರುವ ರಂಜಕ (P: 18 mg/kg) ಟೊಮೆಟೊ ಹೂಬಿಡುವ ಮಟ್ಟಕ್ಕಿಂತ ಕಡಿಮೆಯಾಗಿದೆ. ಮಣ್ಣಿನ pH (6.4) ಮತ್ತು ತೇವಾಂಶ (31%) ಉತ್ತಮವಾಗಿದೆ. ಸಲಹೆ: ಬೇರುಗಳ ಬಳಿ ಸಿಂಗಲ್ ಸೂಪರ್ ಫಾಸ್ಫೇಟ್ (SSP) ಅನ್ವಯಿಸಿ."
        : currentLang === "te"
        ? "మీ తాజా నేల పరీక్షలో అందుబాటులో ఉన్న భాస్వరం (P: 18 mg/kg) టమోటా పూత కోసం సిఫార్సు చేసిన స్థాయి కంటే తక్కువగా ఉంది. నేల pH (6.4) మరియు తేమ (31%) అనుకూలంగా ఉన్నాయి."
        : currentLang === "hi"
        ? "आपकी नवीनतम मिट्टी की जांच से पता चलता है कि फास्फोरस (P: 18 mg/kg) टमाटर के फूल आने के लिए निर्धारित स्तर से कम है। मिट्टी का pH (6.4) और नमी (31%) सामान्य हैं।"
        : currentLang === "ja"
        ? "最新の土壌スキャンによると、有効態リン酸（P: 18 mg/kg）がトマトの開花推奨値を下回っています。土壌pH（6.4）および水分量（31%）は良好です。"
        : "Your latest soil scan shows phosphorus (P: 18 mg/kg) below the recommended range for tomato flowering. Soil pH (6.4) and moisture (31%) remain within the suitable range.",
    source: "local-agri-engine",
    agent: "Soil Intelligence Agent",
    recommendations: [
      "Apply single superphosphate (SSP) or rock phosphate near root zones",
      "Maintain 30-35% soil moisture monitoring",
    ],
  });

  const handleAsk = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userInput.trim()) return;

    setLoading(true);
    const result = await askAgriAI(userInput, currentLang);
    setAiResponse(result);
    setLoading(false);
  };

  const sampleQuestions = [
    "Why is my soil showing a warning?",
    "What fertilizers does my tomato crop need now?",
    "How does AgriBridgeZero detect phosphorus deficiency?",
  ];

  return (
    <section className="ai-section" id="ai-section">
      <div className="section-container">
        {/* Top Header */}
        <div className="section-header-centered">
          <div className="section-badge-pill">
            <Sparkles size={13} />
            <span>GenAI & Agentic Soil Intelligence</span>
          </div>
          <h2 className="section-heading">{t("aiStoryTitle")}</h2>
          <p className="section-subheading">
            Ask questions in your mother tongue and get scientifically verified agronomic guidance.
          </p>
        </div>

        {/* Interactive AI Chat Box */}
        <div className="ai-chat-card-wrap">
          <div className="ai-chat-window">
            {/* User message sample */}
            <div className="chat-bubble user-bubble">
              <div className="chat-avatar user-av">
                <User size={15} />
              </div>
              <div className="bubble-content">
                <span className="bubble-sender">Farmer Adarsh</span>
                <p className="bubble-text">
                  {userInput.trim() || "Why is my soil showing a warning?"}
                </p>
              </div>
            </div>

            {/* AI message */}
            <div className="chat-bubble ai-bubble">
              <div className="chat-avatar ai-av">
                <Bot size={15} />
              </div>
              <div className="bubble-content">
                <div className="ai-bubble-head">
                  <span className="bubble-sender">
                    AgriBridgeZero AI ({aiResponse?.agent || "Soil Specialist"})
                  </span>
                  <span className="ai-source-tag">
                    {aiResponse?.source === "gemini" ? "Google Gemini 2.0 Flash" : aiResponse?.source === "groq" ? "Groq Llama 3.3" : "Agronomic AI Engine"}
                  </span>
                </div>
                <p className="bubble-text">
                  {loading ? "Analyzing multi-sensor readings..." : aiResponse?.answer}
                </p>

                {aiResponse?.recommendations && aiResponse.recommendations.length > 0 && (
                  <div className="ai-recs-box">
                    <span className="recs-title">Recommended Actions:</span>
                    <ul className="recs-list">
                      {aiResponse.recommendations.map((rec, i) => (
                        <li key={i}>
                          <Check size={12} className="rec-check" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Prompts */}
            <div className="quick-prompts-row">
              <span className="quick-prompts-label">Try asking:</span>
              {sampleQuestions.map((q) => (
                <button
                  key={q}
                  className="prompt-pill"
                  onClick={() => {
                    setUserInput(q);
                    setTimeout(() => handleAsk(), 50);
                  }}
                >
                  "{q}"
                </button>
              ))}
            </div>

            {/* Input Row */}
            <form onSubmit={handleAsk} className="ai-input-form">
              <input
                type="text"
                className="ai-chat-input"
                placeholder={t("aiQueryPlaceholder")}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
              <button
                type="submit"
                className="ai-send-btn"
                disabled={loading || !userInput.trim()}
              >
                {loading ? (
                  <span className="btn-spinner" />
                ) : (
                  <>
                    <span>{t("askAI")}</span>
                    <Send size={14} />
                  </>
                )}
              </button>
            </form>

            <div className="ai-chat-bottom-actions">
              <button
                type="button"
                className="view-soil-btn"
                onClick={() => {
                  if (!isLoggedIn) {
                    onOpenAuth("View Detailed Soil Analysis");
                  } else {
                    const el = document.getElementById("soil-section");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                <FileText size={13} />
                <span>{t("viewSoilAnalysis")}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 21: One AI. Multiple Agricultural Specialists. */}
        <div className="specialists-block">
          <div className="section-header-centered small-mb">
            <h3 className="section-subheading-bold">{t("aiSpecialistsTitle")}</h3>
            <p className="section-subheading">
              A cooperative multi-agent architecture where specialized AI models collaborate on your land data.
            </p>
          </div>

          <div className="specialist-agents-grid">
            {aiSpecialistAgents.map((agent) => (
              <div key={agent.id} className="specialist-card">
                <div className="agent-icon-header">
                  <div className="agent-icon-box">
                    {agent.id === "agent-soil" && <Activity size={17} />}
                    {agent.id === "agent-crop" && <Sprout size={17} />}
                    {agent.id === "agent-contaminant" && <ShieldAlert size={17} />}
                    {agent.id === "agent-weather" && <CloudSun size={17} />}
                    {agent.id === "agent-knowledge" && <Database size={17} />}
                    {agent.id === "agent-farmer" && <User size={17} />}
                  </div>
                  <span className="agent-badge">{agent.name}</span>
                </div>
                <h4 className="agent-role-title">{agent.role}</h4>
                <p className="agent-desc">{agent.description}</p>
                <div className="agent-specialty-footer">
                  <span className="agent-spec-tag">{agent.specialty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
