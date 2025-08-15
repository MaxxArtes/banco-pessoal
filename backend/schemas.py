from pydantic import BaseModel, EmailStr, Field

# Schemas (Pydantic) usados para validar entrada/saída da API

# Payload esperado para criar usuário
class UserCreate(BaseModel):
    email: EmailStr
    # força senha mínima (validação do Pydantic)
    password: str = Field(min_length=8)


# Payload para login
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# Modelo de saída de usuário (sem senha)
class UserOut(BaseModel):
    id: int
    email: EmailStr

    # Habilita model parsing a partir de atributos ORM (SQLAlchemy)
    model_config = {
        "from_attributes": True
    }