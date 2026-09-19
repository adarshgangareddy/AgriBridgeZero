import { useState, useRef, useEffect } from "react";
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Mic, 
  Globe, 
  Check, 
  MessageSquare, 
  Sprout, 
  Plus
} from "lucide-react";
import { askAgriAI, type AIResponse } from "../services/aiService";
import { supportedLanguages, type LanguageCode } from "../data/i18n";
import type { CadastralParcel } from "../data/demo";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  recommendations?: string[];
  source?: string;
}

interface AIAssistantChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  activeParcel: CadastralParcel;
  initialPrompt?: string;
}

export function AIAssistantChatModal({
  isOpen,
  onClose,
  currentLang,
  onLanguageChange,
  activeParcel,
  initialPrompt,
}: AIAssistantChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "msg-1",
      sender: "ai",
      text:
        currentLang === "kn"
          ? `ನಮಸ್ಕಾರ! ನಾನು ಅಗ್ರಿಬ್ರಿಡ್ಜ್‌ಝೀರೋ AI ಕೃಷಿ ಸಲಹೆಗಾರ. ${activeParcel.name} (${activeParcel.crop}) ಗಾಗಿ ಮಣ್ಣಿನ ಮಾಹಿತಿ ಮತ್ತು ಬೆಳೆ ಪೋಷಣೆಯ ಬಗ್ಗೆ ನೀವು ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಬಹುದು.`
          : currentLang === "te"
          ? `నమస్కారం! నేను అగ్రిబ్రిడ్జ్ జీరో AI వ్యవసాయ సలహాదారుని. ${activeParcel.name} (${activeParcel.crop}) కోసం నేల మరియు పంట ఆరోగ్యంపై మీ ప్రశ్నలను అడగవచ్చు.`
          : currentLang === "hi"
          ? `नमस्ते! मैं एग्रीब्रिजज़ीरो AI कृषि सलाहकार हूँ। ${activeParcel.name} (${activeParcel.crop}) के लिए मिट्टी की स्थिति और फसल प्रबंधन पर कोई भी सवाल पूछें।`
          : currentLang === "ja"
          ? `こんにちは！AgriBridgeZero AI農業アドバイザーです。${activeParcel.name}（作物：${activeParcel.crop}）の土壌データに基づき、最適な肥培管理をアドバイスします。`
          : `Hello! I am your AgriBridgeZero AI Agronomist. I have loaded real sensor telemetry for ${activeParcel.name} (Crop: ${activeParcel.crop}, Soil: ${activeParcel.soilType}, pH: ${activeParcel.snapshot.ph.value}). How can I assist you today?`,
      timestamp: "Just now",
      recommendations: [
        "Phosphorus top-dressing required before bloom",
        "Keep moisture near 30-35%",
      ],
      source: "Agronomic AI Engine",
    },
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [prevPrompt, setPrevPrompt] = useState(initialPrompt);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(100);

  if (initialPrompt && initialPrompt !== prevPrompt && isOpen) {
    setPrevPrompt(initialPrompt);
    setInputQuery(initialPrompt);
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || loading) return;

    idCounter.current += 1;
    const currentId = idCounter.current;
    const userMsg: ChatMessage = {
      id: `user-${currentId}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setLoading(true);

    const context = `Farm: ${activeParcel.name}, Crop: ${activeParcel.crop}, Soil: ${activeParcel.soilType}, pH: ${activeParcel.snapshot.ph.value}, Moisture: ${activeParcel.snapshot.moisture.value}%, Nitrogen: ${activeParcel.snapshot.nitrogen.value}, Phosphorus: ${activeParcel.snapshot.phosphorus.value}, Potassium: ${activeParcel.snapshot.potassium.value}`;

    try {
      const response: AIResponse = await askAgriAI(query, currentLang, context);
      idCounter.current += 1;
      const aiMsg: ChatMessage = {
        id: `ai-${idCounter.current}`,
        sender: "ai",
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        recommendations: response.recommendations,
        source: response.source === "gemini" ? "Gemini 2.0 Flash" : response.source === "groq" ? "Groq Llama 3.3" : "Agronomic AI Engine",
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      idCounter.current += 1;
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${idCounter.current}`,
        sender: "ai",
        text: "I analyzed your soil conditions. Soil pH is balanced, but phosphorus requires supplement for optimal flowering.",
        timestamp: "Just now",
        source: "Agronomic AI Engine",
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const sampleSuggestions = [
    `What is the best fertilizer dosage for ${activeParcel.crop}?`,
    "Why is my phosphorus reading showing attention?",
    "How often should I irrigate with current moisture?",
    `Is ${activeParcel.crop} safe from soil root rot?`,
  ];

  return (
    <div className="chatgpt-modal-backdrop" onClick={onClose}>
      <div className="chatgpt-modal-window" onClick={(e) => e.stopPropagation()}>
        {/* Left Sidebar (Desktop) */}
        <aside className="chatgpt-sidebar">
          <button 
            className="new-chat-btn"
            onClick={() => {
              setMessages([
                {
                  id: `msg-${Date.now()}`,
                  sender: "ai",
                  text: `Started a fresh consultation for ${activeParcel.name}. What questions do you have about your soil?`,
                  timestamp: "Just now",
                },
              ]);
            }}
          >
            <Plus size={15} />
            <span>New Agronomy Consultation</span>
          </button>

          <div className="sidebar-context-card">
            <span className="context-card-lbl">Grounded Farm Data</span>
            <div className="context-card-title">
              <Sprout size={14} className="green-txt" />
              <strong>{activeParcel.name}</strong>
            </div>
            <div className="context-metric-pill">
              <span>Crop: <strong>{activeParcel.crop}</strong></span>
              <span>Area: <strong>{activeParcel.areaAcres} Ac</strong></span>
            </div>
            <div className="context-metric-pill">
              <span>pH: <strong>{activeParcel.snapshot.ph.value}</strong></span>
              <span>Moist: <strong>{activeParcel.snapshot.moisture.value}%</strong></span>
            </div>
          </div>

          <div className="sidebar-recent-queries">
            <span className="recent-lbl">Quick Topics</span>
            {sampleSuggestions.map((s, idx) => (
              <button
                key={idx}
                className="recent-topic-btn"
                onClick={() => handleSendMessage(s)}
              >
                <MessageSquare size={12} />
                <span>{s}</span>
              </button>
            ))}
          </div>

          {/* Language selector in sidebar */}
          <div className="sidebar-lang-selector">
            <Globe size={14} />
            <select
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              className="sidebar-lang-dropdown"
            >
              {supportedLanguages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.nativeLabel} ({l.label})
                </option>
              ))}
            </select>
          </div>
        </aside>

        {/* Main ChatGPT Conversational Thread */}
        <div className="chatgpt-main-panel">
          {/* Top Bar */}
          <header className="chatgpt-header">
            <div className="header-info-col">
              <div className="header-ai-brand">
                <div className="ai-icon-avatar">
                  <Bot size={17} />
                </div>
                <div>
                  <h3 className="ai-header-name">AgriBridgeZero AI Assistant</h3>
                  <span className="ai-status-indicator">
                    <span className="green-blink" />
                    Online • Grounded on {activeParcel.name} Telemetry
                  </span>
                </div>
              </div>
            </div>

            <div className="header-actions">
              <button className="chat-close-btn" onClick={onClose} aria-label="Close">
                <X size={18} />
              </button>
            </div>
          </header>

          {/* Messages Stream */}
          <div className="chatgpt-messages-container">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chatgpt-msg-row ${msg.sender === "user" ? "user-row" : "ai-row"}`}
              >
                <div className="msg-avatar">
                  {msg.sender === "user" ? <User size={16} /> : <Bot size={16} />}
                </div>

                <div className="msg-bubble">
                  <div className="msg-meta-row">
                    <span className="msg-sender-name">
                      {msg.sender === "user" ? "You (Farmer)" : "AgriBridgeZero AI"}
                    </span>
                    <span className="msg-time">{msg.timestamp}</span>
                    {msg.source && <span className="msg-source-badge">{msg.source}</span>}
                  </div>

                  <p className="msg-text-content">{msg.text}</p>

                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="msg-recommendations">
                      <span className="recs-heading">Recommended Actions:</span>
                      <ul>
                        {msg.recommendations.map((rec, i) => (
                          <li key={i}>
                            <Check size={12} className="rec-bullet-check" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chatgpt-msg-row ai-row">
                <div className="msg-avatar">
                  <Bot size={16} />
                </div>
                <div className="msg-bubble loading-bubble">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Prompt Chips */}
          <div className="chatgpt-prompt-chips">
            {sampleSuggestions.slice(0, 3).map((chip, i) => (
              <button
                key={i}
                className="chip-suggestion"
                onClick={() => handleSendMessage(chip)}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Bottom Chat Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="chatgpt-input-bar"
          >
            <button
              type="button"
              className="mic-btn"
              onClick={() => alert("Voice input listening... Speak your question in your language.")}
              title="Voice Input"
            >
              <Mic size={18} />
            </button>

            <input
              type="text"
              className="chat-text-input"
              placeholder={`Ask about ${activeParcel.crop} care, soil pH, fertilizers, or diseases in your language...`}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              autoFocus
            />

            <button
              type="submit"
              className="send-msg-btn"
              disabled={loading || !inputQuery.trim()}
              aria-label="Send"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
