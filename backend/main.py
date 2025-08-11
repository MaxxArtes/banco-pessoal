
from fastapi import FastAPI, UploadFile, File, HTTPException, Path
from fastapi.middleware.cors import CORSMiddleware
import boto3
import os
from uuid import uuid4
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

s3 = boto3.client(
    "s3",
    endpoint_url=os.getenv("R2_ENDPOINT"),
    aws_access_key_id=os.getenv("R2_ACCESS_KEY"),
    aws_secret_access_key=os.getenv("R2_SECRET_KEY"),
    region_name="auto"
)

BUCKET = os.getenv("R2_BUCKET")

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/")
def root():
    return {"message": "Backend funcionando"}


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
            Params={"Bucket": BUCKET, "Key": filename},
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
    
# Iniciar o servidor mesmo sem chamar uvicorn no terminal
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)