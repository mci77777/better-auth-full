from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any
import jwt
from jwt import PyJWKClient
import os

AUTH_BASE = os.getenv("BETTER_AUTH_URL", "http://localhost:4000")
JWKS_URL  = f"{AUTH_BASE}/api/auth/jwks"
ISS_AUD   = AUTH_BASE

app = FastAPI()
bearer_scheme = HTTPBearer()
jwk_client = PyJWKClient(JWKS_URL)

# 添加 CORS 支持
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应该限制为特定域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def verify_jwt(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> Dict[str, Any]:
    try:
        token = credentials.credentials
        signing_key = jwk_client.get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["EdDSA"],
            audience=ISS_AUD,
            issuer=ISS_AUD,
            options={"require": ["exp", "iss", "aud", "sub"]},
        )
        return payload
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

@app.get("/")
def read_root():
    return {"message": "FastAPI Better Auth Integration"}

@app.get("/agent/chat")
def chat(user=Depends(verify_jwt)):
    return {"hello": user.get("email", "user"), "user_id": user.get("sub")}

@app.get("/agent/profile")
def profile(user=Depends(verify_jwt)):
    return {
        "user_id": user.get("sub"),
        "email": user.get("email"),
        "role": user.get("role", "user"),
        "message": "This is your profile data"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)


