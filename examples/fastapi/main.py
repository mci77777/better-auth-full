from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
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

def verify_jwt(credentials: HTTPAuthorizationCredentials) -> Dict[str, Any]:
    try:
        token = credentials.credentials
        signing_key = jwk_client.get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=[signing_key.alg],
            audience=ISS_AUD,
            issuer=ISS_AUD,
            options={"require": ["exp", "iss", "aud", "sub"]},
        )
        return payload
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

@app.get("/agent/chat")
def chat(user=Depends(verify_jwt)):
    return {"hello": user.get("email", "user")}


