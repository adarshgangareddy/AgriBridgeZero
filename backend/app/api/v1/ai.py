from fastapi import APIRouter
from app.schemas.ai import ChatRequest, ChatResponse
from app.services.ai_provider import generate_ai_response

router = APIRouter(prefix="/ai", tags=["AI Agronomist"])


@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(payload: ChatRequest):
    """Server-side proxy for agronomic GenAI queries.
    Uses private backend API keys (Gemini / Groq) without exposing them to browser.
    """
    res = await generate_ai_response(
        query=payload.query,
        language=payload.language,
        context=payload.context,
    )
    return ChatResponse(
        answer=res["answer"],
        source=res["source"],
        recommendations=res.get("recommendations", []),
    )
