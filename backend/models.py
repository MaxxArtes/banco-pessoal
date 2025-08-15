from sqlalchemy import Column, Integer, String

# Modelo ORM para usuários.
# Tabelas/colunas mínimas: id, email (único) e password_hash.
try:
    from .database import Base
except ImportError:
    from database import Base


class User(Base):
    __tablename__ = "users"

    # Identificador numérico
    id = Column(Integer, primary_key=True, index=True)
    # E-mail do usuário (deve ser único)
    email = Column(String(255), unique=True, index=True, nullable=False)
    # Senha armazenada como hash (não guardar senhas em texto plano)
    password_hash = Column(String(255), nullable=False)
