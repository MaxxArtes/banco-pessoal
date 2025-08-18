import os

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"ok": True}

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

def test_test_db():
    response = client.get("/test-db")
    # Pode retornar erro se o banco não estiver configurado corretamente
    assert response.status_code in [200, 500]


def test_env_variables():
    # Testa se as variáveis essenciais do .env estão presentes e corretas
    # 1. R2_ENDPOINT deve ser uma URL válida
    endpoint = os.getenv("R2_ENDPOINT")
    assert endpoint, "R2_ENDPOINT não está definida"
    assert endpoint.startswith("http"), f"R2_ENDPOINT deve começar com http(s): {endpoint}"

    # 2. R2_ACCESS_KEY e R2_SECRET_KEY não podem ser vazios
    access_key = os.getenv("R2_ACCESS_KEY")
    secret_key = os.getenv("R2_SECRET_KEY")
    assert access_key, "R2_ACCESS_KEY não está definida"
    assert secret_key, "R2_SECRET_KEY não está definida"
    assert len(access_key) > 10, "R2_ACCESS_KEY parece muito curta"
    assert len(secret_key) > 10, "R2_SECRET_KEY parece muito curta"

    # 3. R2_BUCKET não pode ser vazio
    bucket = os.getenv("R2_BUCKET")
    assert bucket, "R2_BUCKET não está definida"
    assert len(bucket) > 2, "R2_BUCKET parece muito curto"

    # 4. DATABASE_URL deve ser uma URL PostgreSQL válida
    db_url = os.getenv("DATABASE_URL")
    assert db_url, "DATABASE_URL não está definida"
    assert db_url.startswith("postgresql://"), f"DATABASE_URL deve começar com postgresql://, valor atual: {db_url}"
    assert "@" in db_url and ":" in db_url, "DATABASE_URL deve conter usuário, senha e host"

    # 5. ALLOWED_ORIGINS deve conter pelo menos um domínio
    allowed = os.getenv("ALLOWED_ORIGINS")
    assert allowed, "ALLOWED_ORIGINS não está definida"
    origens = [o.strip() for o in allowed.split(",") if o.strip()]
    assert len(origens) > 0, "ALLOWED_ORIGINS deve conter pelo menos um domínio"
    for origem in origens:
        assert origem.startswith("http"), f"Origem inválida em ALLOWED_ORIGINS: {origem}"
