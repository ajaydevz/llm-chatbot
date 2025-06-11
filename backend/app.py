import os
from typing import List, Dict
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from groq import Groq
from fastapi.middleware.cors import CORSMiddleware
from uuid import uuid4

load_dotenv()

GROQ_API_KEY=os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError(" Api key for groq is missing. please set the groq api key on .env file")


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=GROQ_API_KEY)

#Validates and parses user message input (from frontend/API)
from typing import Optional
class UserInput(BaseModel):
    message: str
    role: str = "user"
    conversation_id: Optional[str] = None




# This class is used to store all messages in a particular conversation (thread) ,A global dictionary to track all chats using conversation_id
class Conversation:
    def __init__(self):
        self.messages: List[Dict[str, str]] = [
            {"role":"system", "content":"your are an usefull AI assistant."}
        ]
        self.active: bool = True

conversations: Dict[str,Conversation] = {}


# function to get a response from the Groq API (which supports LLaMA models like llama-3.1-8b-instant).
def query_groq_api(conversation: Conversation) -> str:
    try:
        # Send the full message history to Groq's API
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",  # Use LLaMA model
            messages=conversation.messages,  
            temperature=1,                  
            max_tokens=1024,                 
            top_p=1,                         
            stream=True,                     
            stop=None                        
        )

        # Read the streamed response
        response = ""
        for chunk in completion:
            content = chunk.choices[0].delta.content or ""
            response += content

        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error with Groq API: {str(e)}")
    

def get_or_create_conversation(conversation_id: str) -> Conversation:
    if conversation_id not in conversations:
        conversations[conversation_id] = Conversation()
    return conversations[conversation_id]


@app.post("/chat")
async def chat(input: UserInput):
    if not input.conversation_id:
        input.conversation_id = str(uuid4())  # auto-generate if missing

    conversation = get_or_create_conversation(input.conversation_id)

    if not conversation.active:
        raise HTTPException(
            status_code=400, 
            detail="The chat session has ended. Please start a new session."
        )
        
    try:
        # Append the user's message to the conversation
        conversation.messages.append({
            "role": input.role,
            "content": input.message
        })
        
        response = query_groq_api(conversation)
        
        conversation.messages.append({
            "role": "assistant",
            "content": response
        })
        
        return {
            "response": response,
            "conversation_id": input.conversation_id
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)