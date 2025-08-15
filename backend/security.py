from passlib.context import CryptContext

_pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(raw: str) -> str:
    return _pwd_ctx.hash(raw)

def verify_password(raw: str, hashed: str) -> bool:
    return _pwd_ctx.verify(raw, hashed)
