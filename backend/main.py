from fastapi import FastAPI, UploadFile, File, HTTPException, Path, Depends
from fastapi.middleware.cors import CORSMiddleware
import boto3
import os
from uuid import uuid4
from dotenv import load_dotenv

load_dotenv()

# ----- Validação de ambiente R2 -----
R2_ENDPOINT   = os.getenv("R2_ENDPOINT")
R2_ACCESS_KEY = os.getenv("R2_ACCESS_KEY")
R2_SECRET_KEY = os.getenv("R2_SECRET_KEY")
BUCKET        = os.getenv("R2_BUCKET")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

for var, name in [(R2_ENDPOINT,"R2_ENDPOINT"),(R2_ACCESS_KEY,"R2_ACCESS_KEY"),
                  (R2_SECRET_KEY,"R2_SECRET_KEY"),(BUCKET,"R2_BUCKET")]:
    if not var:
        raise RuntimeError(f"Variável de ambiente obrigatória ausente: {name}")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in ALLOWED_ORIGINS if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

s3 = boto3.client(
    "s3",
    endpoint_url=R2_ENDPOINT,
    aws_access_key_id=R2_ACCESS_KEY,
    aws_secret_access_key=R2_SECRET_KEY,
    region_name="auto"
)

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/")
def root():
    return {"message": "Backend funcionando"}

# ----------------- Rotas de Arquivos (R2) -----------------
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    filename = str(uuid4()) + "_" + file.filename
    s3.upload_fileobj(file.file, BUCKET, filename)
    return {"filename": filename, "status": "sucesso"}

@app.get("/files")
def list_files():
    try:
        response = s3.list_objects_v2(Bucket=BUCKET)
        arquivos = [obj["Key"] for obj in response.get("Contents", [])]
        return {"arquivos": arquivos}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/download/{filename}")
def download_file(filename: str = Path(...)):
    try:
        url = s3.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": BUCKET,
                "Key": filename,
                "ResponseContentDisposition": f'attachment; filename="{filename}"'
            },
            ExpiresIn=3600
        )
        return {"url": url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.delete("/delete/{filename}")
def delete_file(filename: str = Path(...)):
    try:
        s3.delete_object(Bucket=BUCKET, Key=filename)
        return {"message": f"Arquivo '{filename}' deletado com sucesso."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ----------------- Banco de Dados (SQLAlchemy) -----------------
# ABSOLUTO primeiro (Render roda dentro de backend/)
try:
    from database import SessionLocal, Base, engine
except ImportError:
    # fallback para execução como pacote (uvicorn backend.main:app)
    from .database import SessionLocal, Base, engine

from sqlalchemy.orm import Session
from sqlalchemy import select, text

# Models & Schemas & Security (ABSOLUTO primeiro)
try:
    import models, schemas, security
except ImportError:
    from . import models, schemas, security

# cria tabelas (users, etc.) — após importar models
try:
    Base.metadata.create_all(bind=engine)
except Exception:
    pass

# >>>>>>  get_db vem ANTES de qualquer rota que use Depends(get_db)  <<<<<<
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ----------------- Teste DB -----------------
@app.get("/test-db")
def test_db(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT NOW()"))
    return {"time": str(result.scalar_one())}

# ----------------- Auth: Cadastro & Login -----------------
@app.post("/auth/register", response_model=schemas.UserOut, status_code=201)
def register_user(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()

    # Já existe?
    existing = db.execute(
        select(models.User).where(models.User.email == email)
    ).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=409, detail="E-mail já cadastrado")

    # Hash da senha
    pwd_hash = security.hash_password(payload.password)

    user = models.User(email=email, password_hash=pwd_hash)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@app.post("/auth/login")
def login_user(payload: schemas.UserLogin, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()

    user = db.execute(
        select(models.User).where(models.User.email == email)
    ).scalar_one_or_none()
    if not user:
        # não revela se o e-mail existe
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    if not security.verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    # Sem JWT por enquanto; apenas confirma
    return {"ok": True, "message": "Login realizado com sucesso", "user": {"id": user.id, "email": user.email}}

# ----------------- Runner local -----------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
