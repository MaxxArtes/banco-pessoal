import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Database connection URL
# A aplicação espera encontrar a variável de ambiente DATABASE_URL.
# Exemplo (Postgres): postgresql://user:pass@host:5432/dbname
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL não definida")

# Se estiver usando um pooler (pgBouncer), mantenha o pool do SQLAlchemy
# pequeno para evitar problemas com muitos sockets/connexões.
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=0,
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()
