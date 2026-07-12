import os

class Settings:
    SECRET_KEY: str = os.environ.get("SECRET_KEY", "your_super_secret_jwt_key_here")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    MONGO_URI: str = os.environ.get("MONGO_URI", "mongodb://localhost:27017")

settings = Settings()