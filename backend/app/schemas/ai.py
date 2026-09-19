from typing import List, Optional
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    query: str
    language: str = "en"
    context: Optional[str] = None


class ChatResponse(BaseModel):
    answer: str
    source: str
    recommendations: List[str] = Field(default_factory=list)
