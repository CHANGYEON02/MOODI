import json
import os
import re
import time
import base64
from typing import Any, Dict, List, Optional

import httpx
from dotenv import load_dotenv

load_dotenv()

_spotify_token: Optional[str] = None
_spotify_token_exp: float = 0.0

def _decrypt_key(encrypted_str: str) -> str:
    if not encrypted_str:
        return ""
    try:
        # Base64 decode
        encrypted_bytes = base64.b64decode(encrypted_str.encode('utf-8'))
        # XOR decode with fixed key
        key = b"moodi_secret_key"
        xor_result = bytes(b ^ key[i % len(key)] for i, b in enumerate(encrypted_bytes))
        return xor_result.decode('utf-8')
    except Exception as e:
        print(f"Decryption error: {e}")
        return ""

def _fallback_base(emotion: str, detail: str) -> Dict[str, Any]:
    src = (emotion or detail or "").strip()
    return {
        "emotion_summary": f"입력한 감정/상황을 바탕으로 음악을 추천합니다. (요약: {src[:120]})",
        "caution_note": "의학적/심리학적 진단이 아닌 음악 추천용 요약입니다.",
        "tracks": [],
    }

def _remove_code_fence(text: str) -> str:
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\s*```$", "", text)
    return text.strip()

def _safe_json_parse(text: str) -> Optional[Dict[str, Any]]:
    if not text:
        return None

    cleaned = _remove_code_fence(text)

    # 1차: 그대로 JSON 파싱
    try:
        data = json.loads(cleaned)
        if isinstance(data, dict):
            return data
    except Exception:
        pass

    # 2차: 문자열 내부 JSON 객체 부분만 추출
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start != -1 and end != -1 and end > start:
        snippet = cleaned[start:end + 1]
        try:
            data = json.loads(snippet)
            if isinstance(data, dict):
                return data
        except Exception:
            return None

    return None

def _normalize_llm_result(data: Dict[str, Any], emotion: str, detail: str) -> Dict[str, Any]:
    emotion_summary = str(data.get("emotion_summary", "")).strip()
    caution_note = str(data.get("caution_note", "")).strip()
    tracks = data.get("tracks", [])

    if not emotion_summary:
        src = emotion if emotion else detail
        emotion_summary = f"입력된 감정/상황 요약: {src[:120]}"

    if not caution_note:
        caution_note = "의학적 진단 없이 감정 상태를 존중하는 음악 추천입니다."

    normalized_tracks: List[Dict[str, str]] = []
    if isinstance(tracks, list):
        for t in tracks:
            if not isinstance(t, dict):
                continue
            title = str(t.get("title", "")).strip()
            artist = str(t.get("artist", "")).strip()
            reason = str(t.get("reason", "")).strip() or "입력 감정/상황에 어울리는 분위기"
            if title and artist:
                normalized_tracks.append({
                    "title": title,
                    "artist": artist,
                    "reason": reason,
                })

    return {
        "emotion_summary": emotion_summary,
        "caution_note": caution_note,
        "tracks": normalized_tracks[:5],  # 최대 5개 제한
    }

def _build_prompt(emotion: str, detail: str) -> str:
    return f"""
너는 감정 기반 음악 추천 어시스턴트다.
목표:
1) 사용자의 감정을 짧고 공감적으로 요약한다.
2) 과하게 진단하거나 단정하지 않는다. (의학적 판단 금지)
3) 사용자의 입력 톤과 취향 맥락(감정/상황)에 맞춰 음악을 추천한다.
4) 반드시 JSON만 출력한다. 설명문, 마크다운, 코드블록 금지.

사용자 입력:
- emotion: "{emotion}"
- detail: "{detail}"

반드시 아래 JSON 스키마로만 응답:
{{
  "emotion_summary": "한두 문장 요약",
  "caution_note": "진단이 아닌 추천임을 알리는 짧은 문장",
  "tracks": [
    {{
      "title": "곡 제목",
      "artist": "아티스트",
      "reason": "추천 이유(짧게)"
    }}
  ]
}}

추가 규칙:
- tracks는 3~5곡
- 실제로 존재할 가능성이 높은 곡
- 빈 값 금지
""".strip()

async def _call_openai(prompt: str) -> Optional[Dict[str, Any]]:
    api_key = os.getenv("OPENAI_API_KEY")
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    if not api_key or "your_" in api_key:
        return None

    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model,
        "temperature": 0.7,
        "response_format": {"type": "json_object"},
        "messages": [
            {"role": "system", "content": "항상 유효한 JSON 객체만 출력한다."},
            {"role": "user", "content": prompt},
        ],
    }

    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(url, headers=headers, json=payload)
        r.raise_for_status()
        data = r.json()

    content = data["choices"][0]["message"]["content"]
    return _safe_json_parse(content)

async def _call_gemini(prompt: str) -> Optional[Dict[str, Any]]:
    api_key = os.getenv("GEMINI_API_KEY")
    model = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    if not api_key or "your_" in api_key:
        return None

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.7, "maxOutputTokens": 1000},
    }

    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(url, json=payload)
        r.raise_for_status()
        data = r.json()

    text = (
        data.get("candidates", [{}])[0]
        .get("content", {})
        .get("parts", [{}])[0]
        .get("text", "")
    )
    return _safe_json_parse(text)

async def _call_deepseek(prompt: str) -> Optional[Dict[str, Any]]:
    api_key = os.getenv("DEEPSEEK_API_KEY")
    model = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")
    if not api_key or "your_" in api_key:
        return None

    url = "https://api.deepseek.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model,
        "temperature": 0.7,
        "response_format": {"type": "json_object"},
        "messages": [
            {"role": "system", "content": "항상 유효한 JSON 객체만 출력한다."},
            {"role": "user", "content": prompt},
        ],
    }

    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(url, headers=headers, json=payload)
        r.raise_for_status()
        data = r.json()

    content = data["choices"][0]["message"]["content"]
    return _safe_json_parse(content)

async def _call_openrouter(prompt: str) -> Optional[Dict[str, Any]]:
    enc_key = os.getenv("OPENROUTER_API_KEY_ENC")
    api_key = _decrypt_key(enc_key)
    model = os.getenv("OPENROUTER_MODEL", "deepseek/deepseek-chat")
    
    if not api_key:
        return None

    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3001",
        "X-Title": "MooDI"
    }
    payload = {
        "model": model,
        "temperature": 0.7,
        "response_format": {"type": "json_object"},
        "messages": [
            {"role": "system", "content": "항상 유효한 JSON 객체만 출력한다."},
            {"role": "user", "content": prompt},
        ],
    }

    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(url, headers=headers, json=payload)
        r.raise_for_status()
        data = r.json()

    content = data["choices"][0]["message"]["content"]
    return _safe_json_parse(content)

async def _call_llm(emotion: str, detail: str) -> Optional[Dict[str, Any]]:
    provider = os.getenv("LLM_PROVIDER", "openrouter").lower().strip()
    prompt = _build_prompt(emotion, detail)

    # 1차 시도
    try:
        if provider == "gemini":
            result = await _call_gemini(prompt)
        elif provider == "deepseek":
            result = await _call_deepseek(prompt)
        elif provider == "openrouter":
            result = await _call_openrouter(prompt)
        else:
            result = await _call_openai(prompt)
        if result:
            return result
    except Exception:
        pass

    # 2차 시도 (엄격 지시)
    strict_prompt = prompt + "\n반드시 JSON 객체만 반환."
    try:
        if provider == "gemini":
            return await _call_gemini(strict_prompt)
        elif provider == "deepseek":
            return await _call_deepseek(strict_prompt)
        elif provider == "openrouter":
            return await _call_openrouter(strict_prompt)
        else:
            return await _call_openai(strict_prompt)
    except Exception:
        return None

async def _get_spotify_access_token(client: httpx.AsyncClient) -> Optional[str]:
    global _spotify_token, _spotify_token_exp

    now = time.time()
    if _spotify_token and now < (_spotify_token_exp - 30):
        return _spotify_token

    client_id = os.getenv("SPOTIFY_CLIENT_ID")
    client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")
    if not client_id or not client_secret or "your_" in client_id:
        return None

    try:
        r = await client.post(
            "https://accounts.spotify.com/api/token",
            data={"grant_type": "client_credentials"},
            auth=(client_id, client_secret),
            timeout=15,
        )
        r.raise_for_status()
        data = r.json()
        _spotify_token = data.get("access_token")
        _spotify_token_exp = now + int(data.get("expires_in", 3600))
        return _spotify_token
    except Exception:
        return None

async def _spotify_search_by_query(client: httpx.AsyncClient, query: str, limit: int = 5) -> List[Dict[str, str]]:
    token = await _get_spotify_access_token(client)
    if not token or not query.strip():
        return []

    try:
        r = await client.get(
            "https://api.spotify.com/v1/search",
            headers={"Authorization": f"Bearer {token}"},
            params={"q": query, "type": "track", "limit": limit, "market": "KR"},
            timeout=15,
        )
        r.raise_for_status()
        data = r.json()
        items = data.get("tracks", {}).get("items", [])

        results: List[Dict[str, str]] = []
        for item in items:
            title = (item.get("name") or "").strip()
            artists = item.get("artists", [])
            artist = (artists[0].get("name") if artists else "") or ""
            artist = artist.strip()

            if title and artist:
                results.append({
                    "title": title,
                    "artist": artist,
                    "reason": "입력한 감정/상황 키워드와 유사한 분위기의 트랙",
                })
        return results
    except Exception:
        return []

async def _search_spotify_track(client: httpx.AsyncClient, title: str, artist: str) -> Dict[str, Any]:
    token = await _get_spotify_access_token(client)
    if not token:
        return {"url": None, "preview_url": None, "image": None}

    try:
        r = await client.get(
            "https://api.spotify.com/v1/search",
            headers={"Authorization": f"Bearer {token}"},
            params={"q": f'track:"{title}" artist:"{artist}"', "type": "track", "limit": 1},
            timeout=15,
        )
        r.raise_for_status()
        data = r.json()
        items = data.get("tracks", {}).get("items", [])
        if not items:
            return {"url": None, "preview_url": None, "image": None}

        item = items[0]
        images = item.get("album", {}).get("images", [])
        return {
            "url": item.get("external_urls", {}).get("spotify"),
            "preview_url": item.get("preview_url"),
            "image": images[0]["url"] if images else None,
        }
    except Exception:
        return {"url": None, "preview_url": None, "image": None}

async def _search_youtube_video(client: httpx.AsyncClient, query: str) -> Dict[str, Any]:
    enc_key = os.getenv("YOUTUBE_API_KEY_ENC")
    api_key = _decrypt_key(enc_key)
    if not api_key:
        return {"url": None, "video_id": None, "title": None}

    try:
        r = await client.get(
            "https://www.googleapis.com/youtube/v3/search",
            params={
                "part": "snippet",
                "q": query,
                "type": "video",
                "maxResults": 1,
                "key": api_key,
            },
            timeout=15,
        )
        r.raise_for_status()
        data = r.json()
        items = data.get("items", [])
        if not items:
            return {"url": None, "video_id": None, "title": None}

        item = items[0]
        video_id = item.get("id", {}).get("videoId")
        return {
            "url": f"https://www.youtube.com/watch?v={video_id}" if video_id else None,
            "video_id": video_id,
            "title": item.get("snippet", {}).get("title"),
        }
    except Exception:
        return {"url": None, "video_id": None, "title": None}

async def recommend_music(emotion: str, detail: str) -> Dict[str, Any]:
    llm_raw = await _call_llm(emotion, detail)

    if llm_raw:
        base = _normalize_llm_result(llm_raw, emotion, detail)
        fallback_used = False
    else:
        base = _fallback_base(emotion, detail)
        fallback_used = True

    async with httpx.AsyncClient() as client:
        # LLM 실패 시 Spotify 키워드 기반 동적 검색
        if not base["tracks"]:
            dynamic_query = f"{emotion} {detail}".strip()
            base["tracks"] = await _spotify_search_by_query(client, dynamic_query, limit=5)

        enriched: List[Dict[str, Any]] = []
        for t in base["tracks"]:
            title = t["title"]
            artist = t["artist"]

            spotify = await _search_spotify_track(client, title, artist)
            youtube = await _search_youtube_video(client, f"{title} {artist} official audio")

            enriched.append({
                "title": title,
                "artist": artist,
                "reason": t.get("reason"),
                "spotify": spotify,
                "youtube": youtube,
            })

    return {
        "emotion_summary": base["emotion_summary"],
        "caution_note": base["caution_note"],
        "recommendations": enriched,
        "meta": {
            "llm_provider": os.getenv("LLM_PROVIDER", "openrouter"),
            "fallback_used": fallback_used,
        },
    }

async def naver_oauth_login(code: str, state: str) -> Dict[str, Any]:
    client_id = os.getenv("NAVER_CLIENT_ID")
    enc_secret = os.getenv("NAVER_CLIENT_SECRET_ENC")
    client_secret = _decrypt_key(enc_secret)

    if not client_id or not client_secret:
        raise ValueError("Naver OAuth Client ID or Client Secret not configured.")

    # 1. Access Token 발급 요청
    token_url = "https://nid.naver.com/oauth2.0/token"
    params = {
        "grant_type": "authorization_code",
        "client_id": client_id,
        "client_secret": client_secret,
        "code": code,
        "state": state
    }

    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.post(token_url, params=params)
        r.raise_for_status()
        token_data = r.json()
        
        access_token = token_data.get("access_token")
        if not access_token:
            error_msg = token_data.get("error_description", "Failed to obtain access token from Naver")
            raise ValueError(error_msg)

        # 2. 사용자 프로필 정보 조회
        profile_url = "https://openapi.naver.com/v1/nid/me"
        headers = {
            "Authorization": f"Bearer {access_token}"
        }
        
        r_profile = await client.get(profile_url, headers=headers)
        r_profile.raise_for_status()
        profile_data = r_profile.json()

        if profile_data.get("resultcode") != "00":
            raise ValueError(profile_data.get("message", "Failed to fetch profile info"))

        response_info = profile_data.get("response", {})
        return {
            "id": response_info.get("id"),
            "nickname": response_info.get("nickname"),
            "profile_image": response_info.get("profile_image"),
            "email": response_info.get("email")
        }
