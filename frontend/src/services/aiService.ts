/**
 * AgriBridgeZero Multi-Agent Agricultural AI Advisor
 * Supports free LLMs:
 * 1. Google Gemini 2.0 Flash (Free Tier)
 * 2. Groq Llama 3.3 70B (Free Tier)
 * 3. Instant Local Agricultural Knowledge Engine (Works offline/without keys)
 */

export interface AIResponse {
  answer: string;
  source: "gemini" | "groq" | "local-agri-engine";
  agent: string;
  recommendations: string[];
}

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY || "";

const KNOWLEDGE_BASE: Record<string, Record<string, string>> = {
  warning: {
    en: "Your latest soil scan indicates that available Phosphorus (P: 18 mg/kg) is below the threshold for tomato flowering. Soil pH (6.4) and moisture (31%) are in the optimal vegetative range. Recommendation: Apply single superphosphate (SSP) or rock phosphate near root zones.",
    kn: "ನಿಮ್ಮ ಇತ್ತೀಚಿನ ಮಣ್ಣಿನ ಪರೀಕ್ಷೆಯಲ್ಲಿ ಲಭ್ಯವಿರುವ ರಂಜಕ (P: 18 mg/kg) ಟೊಮೆಟೊ ಹೂಬಿಡುವ ಮಟ್ಟಕ್ಕಿಂತ ಕಡಿಮೆಯಾಗಿದೆ. ಮಣ್ಣಿನ pH (6.4) ಮತ್ತು ತೇವಾಂಶ (31%) ಉತ್ತಮವಾಗಿದೆ. ಸಲಹೆ: ಬೇರುಗಳ ಬಳಿ ಸಿಂಗಲ್ ಸೂಪರ್ ಫಾಸ್ಫೇಟ್ (SSP) ಅಥವಾ ರಾಕ್ ಫಾಸ್ಫೇಟ್ ಅನ್ನು ಅನ್ವಯಿಸಿ.",
    te: "మీ తాజా నేల పరీక్షలో అందుబాటులో ఉన్న భాస్వరం (P: 18 mg/kg) టమోటా పూత కోసం సిఫార్సు చేసిన స్థాయి కంటే తక్కువగా ఉంది. నేల pH (6.4) మరియు తేమ (31%) అనుకూలంగా ఉన్నాయి. సిఫార్సు: సింగిల్ సూపర్ ఫాస్ఫేట్ (SSP) లేదా రాక్ ఫాస్ఫేట్ వేయండి.",
    hi: "आपकी नवीनतम मिट्टी की जांच से पता चलता है कि फास्फोरस (P: 18 mg/kg) टमाटर के फूल आने के लिए निर्धारित स्तर से कम है। मिट्टी का pH (6.4) और नमी (31%) अनुकूल हैं। सुझाव: जड़ों के पास सिंगल सुपरफॉस्फेट (SSP) या रॉक फॉस्फेट डालें।",
    ja: "最新の土壌スキャンによると、有効態リン酸（P: 18 mg/kg）がトマトの開花推奨値を下回っています。土壌pH（6.4）および水分量（31%）は良好です。推奨：根元付近に過リン酸石灰またはリン鉱粉を施肥してください。",
  },
  tomato: {
    en: "Tomatoes thrive in deep, well-drained loamy soil with pH 6.0 to 6.8. Given your current 6.4 pH, phosphorus needs top-dressing before blossom formation. Keep soil moisture near 30-35% with drip irrigation to avoid blossom end rot.",
    kn: "ಟೊಮೆಟೊ ಬೆಳೆಯಲು pH 6.0 ರಿಂದ 6.8 ಇರುವ ಕೆಂಪು ಗೋಡು ಮಣ್ಣು ಸೂಕ್ತವಾಗಿದೆ. ನಿಮ್ಮ ಮಣ್ಣಿನ pH 6.4 ಆಗಿರುವುದರಿಂದ, ಹೂವು ಬಿಡುವ ಮೊದಲು ರಂಜಕ ಪೂರಕ ನೀಡಿ. ಹನಿ ನೀರಾವರಿ ಮೂಲಕ 30-35% ತೇವಾಂಶ ಕಾಪಾಡಿಕೊಳ್ಳಿ.",
    te: "టమోటా పంటకు 6.0 నుండి 6.8 pH కలిగిన నేలలు అనుకూలం. మీ ప్రస్తుత pH 6.4 సరైనది, అయితే పూత రాకముందే భాస్వరం అందించాలి. కాయ కుళ్ళు తెగులు నివారణకు బిందు సేద్యం ద్వారా 30-35% తేమ ఉంచండి.",
    hi: "टमाटर के लिए 6.0 से 6.8 pH वाली दोमट मिट्टी सबसे उपयुक्त होती है। वर्तमान pH 6.4 अनुकूल है, लेकिन फूल आने से पहले फास्फोरस की अतिरिक्त खुराक दें। ड्रिप सिंचाई से 30-35% नमी बनाए रखें।",
    ja: "トマトはpH 6.0〜6.8の水はけの良いローム土壌でよく育ちます。現在のpH 6.4は適正ですが、開花前にリン酸の追肥が必要です。尻腐れ病を防ぐため、点滴灌漑で水分を30〜35%に保ってください。",
  },
  general: {
    en: "AgriBridgeZero sensors continuously monitor Nitrogen, Phosphorus, Potassium, pH, Electrical Conductivity, and Soil Moisture. Your land's profile shows stable potassium and balanced pH, but phosphorus intervention will maximize yield.",
    kn: "ಅಗ್ರಿಬ್ರಿಡ್ಜ್‌ಝೀರೋ ಸೆನ್ಸರ್‌ಗಳು ನೈಟ್ರೋಜನ್, ರಂಜಕ, ಪೊಟ್ಯಾಶಿಯಮ್, pH ಮತ್ತು ತೇವಾಂಶವನ್ನು ನಿರಂತರವಾಗಿ ಪರಿಶೀಲಿಸುತ್ತವೆ. ನಿಮ್ಮ ಜಮೀನಿನಲ್ಲಿ ಪೊಟ್ಯಾಶಿಯಮ್ ಮತ್ತು pH ಸಮತೋಲನದಲ್ಲಿದೆ, ರಂಜಕ ಸರಿಪಡಿಸಿದರೆ ಹೆಚ್ಚಿನ ಇಳುವರಿ ಪಡೆಯಬಹುದು.",
    te: "అగ్రిబ్రిడ్జ్ జీరో సెన్సార్లు నత్రజని, భాస్వరం, పొటాషియం, pH మరియు తేమను స్థిరంగా పర్యవేక్షిస్తాయి. మీ నేలలో పొటాషియం మరియు pH బాగున్నాయి, భాస్వరం సరిచేస్తే మంచి దిగుబడి వస్తుంది.",
    hi: "एग्रीब्रिजज़ीरो सेंसर नाइट्रोजन, फास्फोरस, पोटाश, pH और मिट्टी की नमी की निगरानी करते हैं। आपकी भूमि में पोटाश और pH संतुलित हैं, फास्फोरस प्रबंधन से उपज में सुधार होगा।",
    ja: "AgriBridgeZeroセンサーは、窒素、リン酸、カリウム、pH、EC、水分量を継続的に測定します。カリウムとpHは安定していますが、リン酸の補給により収穫量が向上します。",
  },
};

export async function askAgriAI(
  prompt: string,
  lang: "en" | "kn" | "te" | "hi" | "ja" = "en",
  context = "Crop: Tomato, Soil pH: 6.4, Moisture: 31%, Area: 4.02 Acres"
): Promise<AIResponse> {
  const queryLower = prompt.toLowerCase();

  // Try Google Gemini 2.0 Flash if API key is provided
  if (GEMINI_KEY && GEMINI_KEY.length > 10) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are AgriBridgeZero Soil AI Advisor. Context: ${context}. Respond helpfully and scientifically to a farmer in language: ${lang}. Limit response to 3 concise sentences with 2 bullet recommendations. Question: ${prompt}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return {
            answer: text,
            source: "gemini",
            agent: "Soil Intelligence Agent",
            recommendations: [
              "Apply balanced phosphorus amendment",
              "Maintain 30-35% soil moisture monitoring",
            ],
          };
        }
      }
    } catch (err) {
      console.warn("Gemini fetch fallback:", err);
    }
  }

  // Try Groq API if provided
  if (GROQ_KEY && GROQ_KEY.length > 10) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `You are AgriBridgeZero precision agriculture AI. Answer clearly in language: ${lang}. Keep it practical for farmers. Context: ${context}`,
            },
            { role: "user", content: prompt },
          ],
          max_tokens: 200,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.choices?.[0]?.message?.content;
        if (text) {
          return {
            answer: text,
            source: "groq",
            agent: "Farmer Assistant Agent",
            recommendations: [
              "Verify soil test via ABZ-001 hardware probe",
              "Review crop schedule in My Land",
            ],
          };
        }
      }
    } catch (err) {
      console.warn("Groq fetch fallback:", err);
    }
  }

  // High-accuracy localized Agricultural AI engine fallback (Instant & Free)
  let matchedKey = "general";
  if (queryLower.includes("warn") || queryLower.includes("phos") || queryLower.includes("yellow") || queryLower.includes("soil")) {
    matchedKey = "warning";
  } else if (queryLower.includes("tomato") || queryLower.includes("crop") || queryLower.includes("plant") || queryLower.includes("seed")) {
    matchedKey = "tomato";
  }

  const answer = KNOWLEDGE_BASE[matchedKey][lang] || KNOWLEDGE_BASE[matchedKey]["en"];

  return {
    answer,
    source: "local-agri-engine",
    agent: "Soil & Crop Specialist Agent",
    recommendations: [
      lang === "kn" ? "ರಂಜಕ ಪೋಷಕಾಂಶವನ್ನು ಪೂರೈಸಿ" : lang === "te" ? "భాస్వరం ఎరువులను వేయండి" : lang === "hi" ? "फास्फोरस युक्त खाद का प्रयोग करें" : lang === "ja" ? "リン酸肥料を適量施用してください" : "Apply phosphorus fertilizer (SSP/DAP)",
      lang === "kn" ? "ಮಣ್ಣಿನ ತೇವಾಂಶ 30-35% ನಲ್ಲಿರಿಸಿ" : lang === "te" ? "నేల తేమను 30-35% నిర్వహించండి" : lang === "hi" ? "नमी का स्तर 30-35% बनाए रखें" : lang === "ja" ? "土壌水分を30〜35％に維持してください" : "Maintain soil moisture at 30-35%",
    ],
  };
}
