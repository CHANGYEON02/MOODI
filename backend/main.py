import os
from typing import Optional
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from services.llm_service import recommend_music, naver_oauth_login

load_dotenv()

app = FastAPI(title="Emotion-based Music Recommendation API")

# CORS 설정
raw_origins = os.getenv("ALLOWED_ORIGINS", "*")
allow_origins = [o.strip() for o in raw_origins.split(",")] if raw_origins else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RecommendRequest(BaseModel):
    emotion: Optional[str] = None
    detail: Optional[str] = None

class NaverAuthRequest(BaseModel):
    code: str
    state: str

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/api/recommend")
async def recommend(req: RecommendRequest):
    emotion = (req.emotion or "").strip()
    detail = (req.detail or "").strip()

    # 둘 다 비어있으면 400 에러 반환
    if not emotion and not detail:
        raise HTTPException(
            status_code=400,
            detail="emotion 또는 detail 중 최소 1개는 입력되어야 합니다."
        )

    result = await recommend_music(emotion=emotion, detail=detail)
    return result

@app.post("/api/auth/naver")
async def naver_auth(req: NaverAuthRequest):
    code = req.code.strip()
    state = req.state.strip()
    
    if not code:
        raise HTTPException(status_code=400, detail="code는 필수값입니다.")
        
    try:
        profile = await naver_oauth_login(code=code, state=state)
        return profile
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"네이버 로그인 실패: {str(e)}")
