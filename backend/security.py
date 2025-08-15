from passlib.context import CryptContext

# Wrappers simples sobre passlib para hash e verificação de senhas.
# Usamos bcrypt por ser bem suportado e seguro quando bem configurado.
_pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(raw: str) -> str:
    """Gera um hash seguro para a senha em texto plano."""
    return _pwd_ctx.hash(raw)


def verify_password(raw: str, hashed: str) -> bool:
    """Verifica se a senha em texto plano corresponde ao hash armazenado."""
    return _pwd_ctx.verify(raw, hashed)
