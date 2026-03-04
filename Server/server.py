from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from pypdf import PdfReader  
from docx import Document
from pydantic import BaseModel

import os
import re
import uuid
import httpx


# loading the env variables
load_dotenv()

NAMESPACE = os.getenv('NAMESPACE')
PROJECT_NAME = os.getenv('PROJECT_NAME')
VERSION = os.getenv('VERSION')

app = FastAPI()
prefix_router = APIRouter(prefix=NAMESPACE+PROJECT_NAME+VERSION)

# Allow requests from frontend
origins = [
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://sadidula.github.io"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from fastapi import Request
from fastapi.responses import JSONResponse

@app.options("/{rest_of_path:path}")
async def preflight_handler(request: Request, rest_of_path: str):
    return JSONResponse(
        content={},
        headers={
            "Access-Control-Allow-Origin": "https://sadidula.github.io",
            "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        }
    )


# <------- SESSION STORE ------->
# Stores session data in memory for the lifetime of the server process.
# Structure: { session_id: { "visitor_name": str | None, "history": [...], "background_info": str } }
sessions: dict = {}

def get_session(session_id: str) -> dict:
    if session_id not in sessions:
        sessions[session_id] = {
            "visitor_name": None,   # None until visitor tells us their name
            "history": [],          # list of {"role": "user"|"assistant", "content": str}
            "background_info": ""
        }
    return sessions[session_id]

# <------- BACKGROUND DOCUMENTS READER ------->
DOCS_BASE = os.getenv('DOCS_BASE')
BASE_DIR = Path(__file__).resolve().parent
DOCS_DIR = BASE_DIR / DOCS_BASE

def read_files_from_dir(directory: Path) -> tuple[list[str], list[str]]:
    """
    Helper to read .txt, .docx, .pdf files from a given directory.
    Returns (all_content, files_found).
    """
    all_content = []
    files_found = []

    for file_path in directory.iterdir():
        if not file_path.is_file():
            continue
        try:
            if file_path.suffix.lower() == '.docx':
                doc = Document(str(file_path))
                content = "\n".join([para.text for para in doc.paragraphs])
            elif file_path.suffix.lower() == '.txt':
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
            elif file_path.suffix.lower() == '.pdf':
                reader = PdfReader(str(file_path))
                content = "\n".join(
                    page.extract_text() for page in reader.pages
                    if page.extract_text().strip()
                )
            else:
                continue

            all_content.append(f"=== {file_path.name} ===\n{content}")
            files_found.append(file_path.name)

        except Exception as e:
            print(f"Error reading {file_path.name}: {str(e)}")
            continue

    return all_content, files_found


async def read_background_documents():
    """
    Read ONLY the shareable documents folder — confidential is never touched.

    Folder structure:
        docs/shareable/     <-- LLM reads ONLY this
        docs/confidential/  <-- Never loaded into LLM
    """
    try:
        shareable_dir = DOCS_DIR / "shareable"
        confidential_dir = DOCS_DIR / "confidential"

        for folder in [shareable_dir, confidential_dir]:
            if not folder.exists():
                folder.mkdir(parents=True, exist_ok=True)

        if not any(shareable_dir.iterdir()):
            return {
                "message": "Shareable directory is empty. Add documents you want the LLM to know about.",
                "content": "",
                "files_found": []
            }

        all_content, files_found = read_files_from_dir(shareable_dir)
        combined_content = "\n\n".join(all_content)

        return {
            "message": "Background documents read successfully",
            "content": combined_content,
            "files_found": files_found,
            "total_characters": len(combined_content)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read background documents: {str(e)}")

# <------- LLM ------->
OPEN_ROUTER_URL = os.getenv('OPEN_ROUTER_URL')
OPEN_ROUTER_API = os.getenv('OPEN_ROUTER_API')

def build_system_prompt(visitor_name: str | None, background_info: str = "") -> str:
    """
    Builds the system prompt that defines Kas's personality and guardrails.
    Kept as a system message so it anchors every turn of the conversation.
    """
    background_context = ""
    if background_info:
        background_context = f"""
Here's some background about me that you can draw from naturally in conversation:
{background_info}
Only bring up details when they're relevant - don't dump everything at once.
"""

    visitor_label = visitor_name if visitor_name else "the visitor"

    return f"""You are a digital version of me, Kas - chatting on my behalf with {visitor_label}.

Your job is to have a natural, friendly conversation that feels like it's genuinely coming from me.
Think of it like texting a mate, not writing a formal reply.

{background_context}

A few things to keep in mind:
- Always say something in response to the visitor's message, even if it's just a casual acknowledgment. Never leave them hanging.
- Talk in first person - "I", "me", "my" - like you're actually me
- Keep the tone casual and warm, like catching up with someone you know
- Don't over-explain or list things out formally - just talk naturally
- If you're not sure about something, say so in a relaxed way like "hmm, not too sure about that one tbh"
- Never reveal private details like my full name, birthday, or where I live
- Match the vibe and length of what {visitor_label} said - don't be too long-winded
- You remember everything said earlier in this conversation, refer back to it naturally when relevant
- If the visitor tells you their name at any point, use it naturally going forward"""


def extract_name_from_message(message: str) -> str | None:
    """
    Detect if the visitor is telling us their name.
    e.g. "I'm John", "my name is Sarah", "call me Jake", "it's Alex", or just "Alex"
    """
    message_lower = message.lower().strip()
    false_positives = {"fine", "good", "okay", "ok", "yes", "no", "sure", "great", "hey", "hi", "hello", "nothing", "nevermind"}

    patterns = [
        r"(?:i'?m|i am)\s+([a-z]+)",
        r"(?:my name is|my name's)\s+([a-z]+)",
        r"(?:call me|you can call me)\s+([a-z]+)",
        r"(?:it'?s|its)\s+([a-z]+)",
        r"^([a-z]+)$",   # single word reply — likely just their name
    ]

    for pattern in patterns:
        match = re.search(pattern, message_lower)
        if match:
            name = match.group(1).capitalize()
            if name.lower() not in false_positives:
                return name
    return None


# <------- ENDPOINTS ------->

class StartSession(BaseModel):
    useBackgroundInfo: bool = True

class ChatMessage(BaseModel):
    session_id: str
    message: str


@prefix_router.post("/session/start")
async def start_session(payload: StartSession):
    """
    Call this when the chat window opens.
    Returns a session_id and Kas's opening greeting asking for the visitor's name.
    """
    session_id = str(uuid.uuid4())
    session = get_session(session_id)

    # Load background info once at session start and cache it
    background_info = ""
    if payload.useBackgroundInfo:
        try:
            bg_response = await read_background_documents()
            background_info = bg_response.get("content", "")
            print(f"Session {session_id}: loaded {len(background_info)} chars of background info")
        except Exception as e:
            print(f"Warning: Could not load background info: {str(e)}")

    session["background_info"] = background_info

    # Ask the LLM to generate the greeting so it feels natural and in-character
    system_prompt = build_system_prompt(None, background_info)
    greeting = await call_llm_openrouter(
        system_prompt=system_prompt,
        history=[],
        user_message=(
            "A visitor has just opened the chat for the first time. "
            "Greet them warmly and casually as Kas would, and ask for their name so you know what to call them. "
            "Keep it short and friendly - one or two sentences max."
        )
    )

    # Store greeting in history as the first assistant turn
    session["history"].append({"role": "assistant", "content": greeting})

    return {
        "session_id": session_id,
        "greeting": greeting
    }


@prefix_router.post("/session/update")
async def generate_answers(payload: ChatMessage):
    """
    Send a message within an existing session.
    Full conversation history is sent to the LLM each turn so it remembers everything.
    """
    session = get_session(payload.session_id)

    # Try to detect the visitor's name if we don't know it yet
    if session["visitor_name"] is None:
        detected_name = extract_name_from_message(payload.message)
        if detected_name:
            session["visitor_name"] = detected_name
            print(f"Session {payload.session_id}: visitor identified as {detected_name}")

    # Append the new user message to history before calling the LLM
    session["history"].append({"role": "user", "content": payload.message})

    system_prompt = build_system_prompt(
        visitor_name=session["visitor_name"],
        background_info=session["background_info"]
    )

    # Pass all history — LLM sees the full conversation
    response = await call_llm_openrouter(
        system_prompt=system_prompt,
        history=session["history"][:-1],    # everything before the current message
        user_message=payload.message
    )

    # Append assistant response to history so future turns remember it
    session["history"].append({"role": "assistant", "content": response})

    return {
        "reply": response,
        "visitor_name": session["visitor_name"],
        "session_id": payload.session_id
    }


@prefix_router.delete("/session/{session_id}")
async def end_session(session_id: str):
    """
    Call this when the visitor closes the chat to free up memory.
    """
    if session_id in sessions:
        del sessions[session_id]
        return {"message": "Session ended and memory cleared"}
    raise HTTPException(status_code=404, detail="Session not found")


async def call_llm_openrouter(system_prompt: str, history: list, user_message: str) -> str:
    """
    Call OpenRouter with a proper system prompt + conversation history.
    Using system role means the personality/guardrails persist across all turns.
    """
    headers = {
        "Authorization": f"Bearer {OPEN_ROUTER_API}",
        "Content-Type": "application/json"
    }

    messages = [{"role": "system", "content": system_prompt}]
    messages.extend(history)
    messages.append({"role": "user", "content": user_message})

    payload = {
        "model": "arcee-ai/trinity-large-preview:free",
        "messages": messages,
        "reasoning": {"enabled": True},
        "stream": False,
        "max_tokens": 2000,
        "temperature": 0.7
    }

    async with httpx.AsyncClient(timeout=120) as client:
        response = await client.post(OPEN_ROUTER_URL, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]

# <------- FINALISED ------->
app.include_router(prefix_router)