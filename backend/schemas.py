from pydantic import BaseModel, EmailStr, Field

# Entrada de cadastro
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)

# Entrada de login
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Saída segura (sem senha)
class UserOut(BaseModel):
    id: int
    email: EmailStr

    # Pydantic v2
    model_config = {
        "from_attributes": True
    }